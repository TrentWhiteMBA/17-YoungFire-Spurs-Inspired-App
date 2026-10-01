import { db, hasFirebaseEnvVars } from '../firebase/config';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';

export interface BroadcastMeetingPayload {
  title: string;
  dateTime: string;
  isoDateTime?: string;
  zoomUrl: string;
  meetingId: string;
  passcode: string;
  targetAudience: 'All Ministry Disciples' | 'Leaders & Facilitators Only';
  flyerUrl?: string;
  updatedAt?: string;
  broadcastAt?: string;
  active?: boolean;
}

export const BROADCAST_STORAGE_KEY = 'youngfire_admin_broadcast_meeting';
export const ACTIVE_FLYER_STORAGE_KEY = 'youngfire_active_ministry_flyer';
export const DEFAULT_FLYER_URL = '/youngfire_zoom_flyer.png';

export const DEFAULT_BROADCAST_MEETING: BroadcastMeetingPayload = {
  title: 'YoungFire Ministry-Wide Zoom Assembly',
  dateTime: 'Monday, Oct 12, 2026 @ 7:30 PM CST',
  isoDateTime: '2026-10-12T19:30:00-05:00',
  zoomUrl: 'https://us05web.zoom.us/j/8785161298?pwd=e0zBTD2QHIHfx0AzjzXG7EHQno9Oig.1&omn=85728476365',
  meetingId: '878 516 1298',
  passcode: 'FIRE2026',
  targetAudience: 'All Ministry Disciples',
  flyerUrl: DEFAULT_FLYER_URL,
  active: false,
  updatedAt: new Date().toISOString()
};

/**
 * Checks whether a broadcast meeting is currently active and NOT expired.
 * A meeting is considered over if current time is past the meeting time (+ 2.5 hours duration buffer).
 */
export function isMeetingActiveAndUpcoming(meeting: BroadcastMeetingPayload): boolean {
  if (meeting.active === false) return false;
  if (!meeting.isoDateTime && !meeting.dateTime) return false;

  try {
    let meetingTime: number | null = null;
    if (meeting.isoDateTime) {
      meetingTime = new Date(meeting.isoDateTime).getTime();
    } else if (meeting.dateTime) {
      const parsed = Date.parse(meeting.dateTime);
      if (!isNaN(parsed)) meetingTime = parsed;
    }

    if (meetingTime) {
      const now = Date.now();
      // Assume meeting lasts up to 2.5 hours (9,000,000 ms)
      const expirationTime = meetingTime + (2.5 * 60 * 60 * 1000);
      if (now > expirationTime) {
        return false; // Meeting is OVER!
      }
    }
  } catch {}

  return true;
}

/**
 * Determines whether the Beacon banner should be visible based on user settings,
 * dismissal history, and whether the meeting is currently active and upcoming.
 */
export function isBeaconBannerVisible(meeting?: BroadcastMeetingPayload): boolean {
  try {
    const mode = (localStorage.getItem('youngfire_beacon_mode') || 'auto') as 'auto' | 'always' | 'disabled';
    if (mode === 'disabled') return false;

    const m = meeting || getBroadcastMeeting();

    // Check if user manually dismissed this specific meeting banner
    const dismissedKey = localStorage.getItem('youngfire_dismissed_meeting_id');
    const meetingKey = m.dateTime || m.title || 'default_meeting';
    if (dismissedKey && dismissedKey === meetingKey) {
      return false;
    }

    if (mode === 'auto') {
      return isMeetingActiveAndUpcoming(m);
    }

    return m.active !== false;
  } catch {
    return false;
  }
}

/**
 * Dismisses the current beacon banner
 */
export function dismissBeaconBanner(meetingIdentifier?: string): void {
  try {
    const key = meetingIdentifier || getBroadcastMeeting().dateTime || 'dismissed';
    localStorage.setItem('youngfire_dismissed_meeting_id', key);
    window.dispatchEvent(new CustomEvent('yf_beacon_visibility_changed', { detail: { visible: false } }));
  } catch {}
}

/**
 * Clears dismissal so the banner can reappear when desired
 */
export function resetBeaconDismissal(): void {
  try {
    localStorage.removeItem('youngfire_dismissed_meeting_id');
    window.dispatchEvent(new CustomEvent('yf_beacon_visibility_changed', { detail: { visible: true } }));
  } catch {}
}

export function getBeaconMode(): 'auto' | 'always' | 'disabled' {
  try {
    return (localStorage.getItem('youngfire_beacon_mode') as any) || 'auto';
  } catch {
    return 'auto';
  }
}

export function setBeaconMode(mode: 'auto' | 'always' | 'disabled'): void {
  try {
    localStorage.setItem('youngfire_beacon_mode', mode);
    window.dispatchEvent(new CustomEvent('yf_beacon_visibility_changed', { detail: { mode, visible: isBeaconBannerVisible() } }));
  } catch {}
}

/**
 * Deactivates/Ends an active broadcast meeting
 */
export async function deactivateBroadcastMeeting(): Promise<void> {
  const current = getBroadcastMeeting();
  const deactivated: BroadcastMeetingPayload = {
    ...current,
    active: false,
    updatedAt: new Date().toISOString()
  };

  try {
    localStorage.setItem(BROADCAST_STORAGE_KEY, JSON.stringify(deactivated));
  } catch {}

  window.dispatchEvent(new CustomEvent('yf_meeting_status_updated', {
    detail: { count: 0, message: null, meeting: deactivated, isBroadcast: false }
  }));
  window.dispatchEvent(new CustomEvent('yf_broadcast_meeting_updated', { detail: deactivated }));
  window.dispatchEvent(new CustomEvent('yf_beacon_visibility_changed', { detail: { visible: false } }));

  if (db && hasFirebaseEnvVars) {
    try {
      await setDoc(doc(db, 'sanctuary_broadcasts', 'meeting'), deactivated, { merge: true });
    } catch {}
  }
}

/**
 * Retrieves the currently active flyer URL with fallback to default
 */
export function getActiveFlyerUrl(): string {
  try {
    const saved = localStorage.getItem(ACTIVE_FLYER_STORAGE_KEY);
    if (saved && saved.trim()) return saved.trim();
  } catch {}
  return DEFAULT_FLYER_URL;
}

/**
 * Retrieves the currently saved broadcast meeting
 */
export function getBroadcastMeeting(): BroadcastMeetingPayload {
  try {
    const saved = localStorage.getItem(BROADCAST_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        ...DEFAULT_BROADCAST_MEETING,
        ...parsed,
        flyerUrl: parsed.flyerUrl || getActiveFlyerUrl()
      };
    }
  } catch {}
  return {
    ...DEFAULT_BROADCAST_MEETING,
    flyerUrl: getActiveFlyerUrl()
  };
}

/**
 * Saves broadcast meeting to localStorage, dispatches events, and syncs to Firestore
 */
export async function saveBroadcastMeeting(payload: BroadcastMeetingPayload): Promise<void> {
  const normalized: BroadcastMeetingPayload = {
    ...payload,
    flyerUrl: payload.flyerUrl || getActiveFlyerUrl(),
    updatedAt: new Date().toISOString(),
    broadcastAt: new Date().toISOString(),
    active: true
  };

  // 1. LocalStorage
  try {
    localStorage.setItem(BROADCAST_STORAGE_KEY, JSON.stringify(normalized));
  } catch (e) {
    console.warn('[Broadcast] LocalStorage save warning:', e);
  }

  // 2. Dispatch custom global notification event
  const beaconMessage = `🔥 Special Ministry Zoom Scheduled: ${normalized.dateTime} • Tap to View Flyer & Join`;
  
  window.dispatchEvent(
    new CustomEvent('yf_meeting_status_updated', {
      detail: {
        count: 1,
        message: beaconMessage,
        meeting: normalized,
        isBroadcast: true
      }
    })
  );

  window.dispatchEvent(
    new CustomEvent('yf_broadcast_meeting_updated', {
      detail: normalized
    })
  );

  // 3. Sync to Firestore (sanctuary_broadcasts/meeting)
  if (db && hasFirebaseEnvVars) {
    try {
      await setDoc(doc(db, 'sanctuary_broadcasts', 'meeting'), normalized, { merge: true });
    } catch (err: any) {
      console.warn('[Broadcast] Cloud sync notice:', err.message);
    }
  }
}

/**
 * Sets the active ministry flyer, saves to localStorage, updates Firestore, and dispatches events
 */
export async function setActiveFlyer(flyerDataUrl: string): Promise<void> {
  const urlToSave = flyerDataUrl.trim();
  if (!urlToSave) return;

  try {
    localStorage.setItem(ACTIVE_FLYER_STORAGE_KEY, urlToSave);
  } catch (e) {
    console.warn('[Active Flyer] LocalStorage save warning:', e);
  }

  // Also update meeting payload flyerUrl if present
  try {
    const existing = getBroadcastMeeting();
    existing.flyerUrl = urlToSave;
    localStorage.setItem(BROADCAST_STORAGE_KEY, JSON.stringify(existing));
  } catch {}

  // Dispatch custom events
  window.dispatchEvent(
    new CustomEvent('yf_active_flyer_updated', {
      detail: { flyerUrl: urlToSave }
    })
  );

  const existingMeeting = getBroadcastMeeting();
  const beaconMsg = `🔥 Special Ministry Zoom Scheduled: ${existingMeeting.dateTime} • Tap to View Flyer & Join`;
  window.dispatchEvent(
    new CustomEvent('yf_meeting_status_updated', {
      detail: {
        count: 1,
        message: beaconMsg,
        meeting: existingMeeting,
        isBroadcast: true
      }
    })
  );

  // Firestore sync (sanctuary_broadcasts/current_flyer)
  if (db && hasFirebaseEnvVars) {
    try {
      await setDoc(
        doc(db, 'sanctuary_broadcasts', 'current_flyer'),
        {
          flyerUrl: urlToSave,
          updatedAt: new Date().toISOString()
        },
        { merge: true }
      );
    } catch (err: any) {
      console.warn('[Active Flyer] Cloud sync notice:', err.message);
    }
  }
}

/**
 * Image compression helper (max 1200px width/height, WebP or JPEG 0.85 quality)
 * Prevents exceeding localStorage limits while maintaining crisp flyer quality.
 */
export async function compressImageFile(file: File, maxDimension = 1200, quality = 0.85): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = reject;
      img.onload = () => {
        let width = img.width;
        let height = img.height;
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(e.target?.result as string);
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        try {
          const webpData = canvas.toDataURL('image/webp', quality);
          resolve(webpData);
        } catch {
          const jpegData = canvas.toDataURL('image/jpeg', quality);
          resolve(jpegData);
        }
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
}

/**
 * Generates an iCalendar (.ics) string for the broadcast meeting
 */
export function generateCalendarIcs(meeting: BroadcastMeetingPayload): string {
  let startDate = new Date();
  if (meeting.isoDateTime) {
    const parsed = new Date(meeting.isoDateTime);
    if (!isNaN(parsed.getTime())) {
      startDate = parsed;
    }
  }

  // 1.5 hours duration default
  const endDate = new Date(startDate.getTime() + 90 * 60 * 1000);

  const formatIcsDate = (date: Date) => {
    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  };

  const startFormatted = formatIcsDate(startDate);
  const endFormatted = formatIcsDate(endDate);

  const description = `${meeting.title}\\n\\nAudience: ${meeting.targetAudience}\\nDirect Zoom: ${meeting.zoomUrl}\\nMeeting ID: ${meeting.meetingId}\\nPasscode: ${meeting.passcode}\\n\\nSan Antonio YoungFire Ministry - Joshua House of Worship`;

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//YoungFire Ministry//Sanctuary Broadcast Hub//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:yf-broadcast-${Date.now()}@youngfireministry.org`,
    `DTSTAMP:${formatIcsDate(new Date())}`,
    `DTSTART:${startFormatted}`,
    `DTEND:${endFormatted}`,
    `SUMMARY:🔥 ${meeting.title}`,
    `DESCRIPTION:${description}`,
    `LOCATION:${meeting.zoomUrl}`,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');
}

/**
 * Triggers direct browser download of the .ics file
 */
export function downloadCalendarIcs(meeting: BroadcastMeetingPayload): void {
  const icsData = generateCalendarIcs(meeting);
  const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  const safeTitle = (meeting.title || 'youngfire_assembly').toLowerCase().replace(/[^a-z0-9]/g, '_');
  link.download = `${safeTitle}.ics`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Triggers direct browser download of the flyer image
 */
export function downloadFlyer(flyerUrl: string, filename = 'youngfire_zoom_assembly_flyer.png'): void {
  if (flyerUrl.startsWith('data:')) {
    const link = document.createElement('a');
    link.href = flyerUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    return;
  }

  fetch(flyerUrl)
    .then(res => res.blob())
    .then(blob => {
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    })
    .catch(() => {
      // Fallback: direct anchor download
      const link = document.createElement('a');
      link.href = flyerUrl;
      link.download = filename;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
}
