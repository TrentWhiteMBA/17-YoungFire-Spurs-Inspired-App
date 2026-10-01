import {
  collection,
  doc,
  onSnapshot,
  setDoc,
  updateDoc,
  deleteDoc,
  arrayUnion,
  increment,
  Unsubscribe
} from 'firebase/firestore';
import { db, hasFirebaseEnvVars } from '../firebase/config';
import { GatheringEvent, SANCTUARY_EVENTS_STORAGE_KEY } from '../data/gatheringEventsData';
import { RosterMember } from '../components/MemberRosterModal';

// Storage keys
export const PRAYER_WALL_STORAGE_KEY = 'youngfire_prayers_v2';
export const ROSTER_MEMBERS_STORAGE_KEY = 'youngfire_member_roster_v2';
export const SISTER_EVENTS_STORAGE_KEY = 'youngfire_sister_events_v2';
export const CALENDAR_OVERRIDES_KEY = 'youngfire_calendar_overrides';

// --- 1. SANCTUARY EVENTS LISTENER ---
/**
 * Real-time listener for sanctuary_events
 * Syncs Monday Small Group huddles, cancellations, and reschedules to all devices within 1 second.
 */
export function subscribeSanctuaryEvents(
  onUpdate?: (events: GatheringEvent[]) => void
): Unsubscribe {
  if (!db || !hasFirebaseEnvVars) {
    console.info('[Firebase Sync] Operating in local storage fallback for sanctuary_events.');
    return () => {};
  }

  try {
    const eventsCol = collection(db, 'sanctuary_events');
    const unsubscribe = onSnapshot(
      eventsCol,
      (snapshot) => {
        const events: GatheringEvent[] = [];
        snapshot.forEach((docSnap) => {
          events.push({ id: docSnap.id, ...(docSnap.data() as any) });
        });

        if (events.length > 0) {
          // Merge with local storage
          try {
            const currentRaw = localStorage.getItem(SANCTUARY_EVENTS_STORAGE_KEY);
            const currentEvents: GatheringEvent[] = currentRaw ? JSON.parse(currentRaw) : [];
            const mergedMap = new Map<string, GatheringEvent>();
            currentEvents.forEach((e) => mergedMap.set(e.id, e));
            events.forEach((e) => mergedMap.set(e.id, { ...mergedMap.get(e.id), ...e }));
            const merged = Array.from(mergedMap.values());
            localStorage.setItem(SANCTUARY_EVENTS_STORAGE_KEY, JSON.stringify(merged));
          } catch {}

          // Broadcast to local application
          window.dispatchEvent(
            new CustomEvent('sanctuary_calendar_events_updated', {
              detail: { events, source: 'firebase_live' }
            })
          );
        }

        onUpdate?.(events);
      },
      (err) => {
        console.warn('[Firebase Sync] sanctuary_events listener warning:', err.message);
      }
    );
    return unsubscribe;
  } catch (err: any) {
    console.warn('[Firebase Sync] Failed initializing sanctuary_events listener:', err.message);
    return () => {};
  }
}

// --- 2. SISTER EVENTS LISTENER ---
/**
 * Real-time listener for sister_events
 * Syncs approved/voted Men On Fire and Women Ignited meetups to the master sanctuary calendar.
 */
export function subscribeSisterEvents(
  onUpdate?: (events: GatheringEvent[]) => void
): Unsubscribe {
  if (!db || !hasFirebaseEnvVars) {
    return () => {};
  }

  try {
    const sisterCol = collection(db, 'sister_events');
    const unsubscribe = onSnapshot(
      sisterCol,
      (snapshot) => {
        const sisterEvents: GatheringEvent[] = [];
        snapshot.forEach((docSnap) => {
          sisterEvents.push({ id: docSnap.id, ...(docSnap.data() as any) });
        });

        if (sisterEvents.length > 0) {
          // Sync into local sister events storage
          try {
            localStorage.setItem(SISTER_EVENTS_STORAGE_KEY, JSON.stringify(sisterEvents));
          } catch {}

          // Also merge into master sanctuary calendar
          try {
            const raw = localStorage.getItem(SANCTUARY_EVENTS_STORAGE_KEY);
            const existing: GatheringEvent[] = raw ? JSON.parse(raw) : [];
            const map = new Map<string, GatheringEvent>();
            existing.forEach((e) => map.set(e.id, e));
            sisterEvents.forEach((se) => map.set(se.id, se));
            const merged = Array.from(map.values());
            localStorage.setItem(SANCTUARY_EVENTS_STORAGE_KEY, JSON.stringify(merged));

            window.dispatchEvent(
              new CustomEvent('sanctuary_calendar_events_updated', {
                detail: { events: merged, source: 'sister_events_sync' }
              })
            );
          } catch {}

          window.dispatchEvent(
            new CustomEvent('sister_events_updated', {
              detail: { events: sisterEvents }
            })
          );
        }

        onUpdate?.(sisterEvents);
      },
      (err) => {
        console.warn('[Firebase Sync] sister_events listener notice:', err.message);
      }
    );
    return unsubscribe;
  } catch (err: any) {
    console.warn('[Firebase Sync] Failed initializing sister_events listener:', err.message);
    return () => {};
  }
}

// --- 3. PRAYER WALL LISTENER & LIVE INTERCESSION ---
/**
 * Real-time listener for prayer_wall
 * Live stream of all posted community prayers.
 */
export function subscribePrayerWall(
  onUpdate?: (prayers: any[]) => void
): Unsubscribe {
  if (!db || !hasFirebaseEnvVars) {
    return () => {};
  }

  try {
    const prayersCol = collection(db, 'prayer_wall');
    const unsubscribe = onSnapshot(
      prayersCol,
      (snapshot) => {
        const prayers: any[] = [];
        snapshot.forEach((docSnap) => {
          prayers.push({ id: docSnap.id, ...docSnap.data() });
        });

        if (prayers.length > 0) {
          try {
            localStorage.setItem(PRAYER_WALL_STORAGE_KEY, JSON.stringify(prayers));
          } catch {}

          window.dispatchEvent(
            new CustomEvent('prayer_wall_updated', {
              detail: { prayers, source: 'firebase_live' }
            })
          );
        }

        onUpdate?.(prayers);
      },
      (err) => {
        console.warn('[Firebase Sync] prayer_wall listener warning:', err.message);
      }
    );
    return unsubscribe;
  } catch (err: any) {
    console.warn('[Firebase Sync] Failed initializing prayer_wall listener:', err.message);
    return () => {};
  }
}

/**
 * When an intercessor clicks "🙏 I Prayed For This":
 * Uses arrayUnion to add their user ID and avatar badge live to that prayer document in Firestore.
 */
export async function recordPrayerIntercession(
  prayerId: string,
  user: { id: string; name: string; avatarUrl?: string }
): Promise<void> {
  const userBadge = {
    id: user.id || 'intercessor_' + Date.now(),
    name: user.name || 'Sanctuary Intercessor',
    avatarUrl: user.avatarUrl || '/image_4.png',
    prayedAt: new Date().toISOString()
  };

  // 1. Try Firestore live update with arrayUnion
  if (db && hasFirebaseEnvVars) {
    try {
      const prayerDocRef = doc(db, 'prayer_wall', prayerId);
      await updateDoc(prayerDocRef, {
        prayedBy: arrayUnion(user.id),
        prayedByUsers: arrayUnion(userBadge),
        intercessorsCount: increment(1)
      });
    } catch (err: any) {
      console.warn('[Firebase Sync] Firestore prayer intercession update notice:', err.message);
    }
  }

  // 2. Call backend express API for multi-tiered persistence
  try {
    await fetch(`/api/prayers/${prayerId}/pray`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: user.id, userName: user.name })
    });
  } catch {}

  // 3. Update localStorage fallback state
  try {
    const raw = localStorage.getItem(PRAYER_WALL_STORAGE_KEY);
    if (raw) {
      const list = JSON.parse(raw);
      const updated = list.map((p: any) => {
        if (p.id === prayerId) {
          const currentBadges = Array.isArray(p.prayedByUsers) ? p.prayedByUsers : [];
          const exists = currentBadges.some((b: any) => b.id === user.id);
          const newBadges = exists ? currentBadges : [...currentBadges, userBadge];
          return {
            ...p,
            prayedByUsers: newBadges,
            prayedBy: newBadges.map((b: any) => b.id),
            intercessorsCount: newBadges.length
          };
        }
        return p;
      });
      localStorage.setItem(PRAYER_WALL_STORAGE_KEY, JSON.stringify(updated));
    }
  } catch {}
}

export async function savePrayerToCloud(prayer: any): Promise<void> {
  if (db && hasFirebaseEnvVars) {
    try {
      await setDoc(doc(db, 'prayer_wall', prayer.id), prayer, { merge: true });
    } catch (err: any) {
      console.warn('[Firebase Sync] Failed saving prayer to cloud:', err.message);
    }
  }
}

export async function deletePrayerFromCloud(prayerId: string): Promise<void> {
  if (db && hasFirebaseEnvVars) {
    try {
      await deleteDoc(doc(db, 'prayer_wall', prayerId));
    } catch (err: any) {
      console.warn('[Firebase Sync] Failed deleting prayer from cloud:', err.message);
    }
  }
}

// --- 4. ROSTER MEMBERS LISTENER ---
/**
 * Real-time listener for roster_members
 * Real-time stream of registered brothers and sisters visible in the Admin CMS and sisterhood/brotherhood rosters.
 */
export function subscribeRosterMembers(
  onUpdate?: (members: RosterMember[]) => void
): Unsubscribe {
  if (!db || !hasFirebaseEnvVars) {
    return () => {};
  }

  try {
    const rosterCol = collection(db, 'roster_members');
    const unsubscribe = onSnapshot(
      rosterCol,
      (snapshot) => {
        const members: RosterMember[] = [];
        snapshot.forEach((docSnap) => {
          members.push({ id: docSnap.id, ...(docSnap.data() as any) });
        });

        if (members.length > 0) {
          try {
            localStorage.setItem(ROSTER_MEMBERS_STORAGE_KEY, JSON.stringify(members));
          } catch {}

          window.dispatchEvent(
            new CustomEvent('roster_members_updated', {
              detail: { members, source: 'firebase_live' }
            })
          );
        }

        onUpdate?.(members);
      },
      (err) => {
        console.warn('[Firebase Sync] roster_members listener warning:', err.message);
      }
    );
    return unsubscribe;
  } catch (err: any) {
    console.warn('[Firebase Sync] Failed initializing roster_members listener:', err.message);
    return () => {};
  }
}

export async function saveRosterMemberToCloud(member: RosterMember): Promise<void> {
  if (db && hasFirebaseEnvVars) {
    try {
      await setDoc(doc(db, 'roster_members', member.id), member, { merge: true });
    } catch (err: any) {
      console.warn('[Firebase Sync] Failed saving roster member to cloud:', err.message);
    }
  }
}

export async function deleteRosterMemberFromCloud(memberId: string): Promise<void> {
  if (db && hasFirebaseEnvVars) {
    try {
      await deleteDoc(doc(db, 'roster_members', memberId));
    } catch (err: any) {
      console.warn('[Firebase Sync] Failed deleting roster member from cloud:', err.message);
    }
  }
}

export async function saveSanctuaryEventToCloud(event: GatheringEvent): Promise<void> {
  if (db && hasFirebaseEnvVars) {
    try {
      await setDoc(doc(db, 'sanctuary_events', event.id), event, { merge: true });
    } catch (err: any) {
      console.warn('[Firebase Sync] Failed saving sanctuary event to cloud:', err.message);
    }
  }
}

export async function saveSisterEventToCloud(event: GatheringEvent): Promise<void> {
  if (db && hasFirebaseEnvVars) {
    try {
      await setDoc(doc(db, 'sister_events', event.id), event, { merge: true });
    } catch (err: any) {
      console.warn('[Firebase Sync] Failed saving sister event to cloud:', err.message);
    }
  }
}

/**
 * Initializes all real-time Firestore listeners.
 * Returns an unmount cleanup function.
 */
export function initFirebaseRealtimeSync(): () => void {
  if (!hasFirebaseEnvVars) {
    console.info('[Firebase Realtime Sync] Operating in local_storage_fallback mode. Real-time Firestore sync inactive.');
    return () => {};
  }

  const unsubs: Unsubscribe[] = [];
  unsubs.push(subscribeSanctuaryEvents());
  unsubs.push(subscribeSisterEvents());
  unsubs.push(subscribePrayerWall());
  unsubs.push(subscribeRosterMembers());

  console.info('[Firebase Realtime Sync] All 4 live collections streaming across devices.');

  return () => {
    unsubs.forEach((unsub) => {
      try {
        unsub();
      } catch {}
    });
  };
}
