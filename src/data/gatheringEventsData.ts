/**
 * Gathering Events & Sanctuary Calendar Types & Helpers
 */

export interface GatheringEvent {
  id: string;
  title: string;
  scriptureRef: string;
  focusTopic: string;
  dateTime: string; // ISO string or 'YYYY-MM-DDTHH:mm'
  date: string; // YYYY-MM-DD
  time: string; // e.g. '7:00 PM CST'
  zoomUrl?: string;
  zoomMeetingId?: string;
  zoomPasscode?: string;
  groupTag: '#MenOnFire' | '#WomenIgnited' | '#YoungFire';
  targetAudience: 'men' | 'women' | 'all';
  createdBy?: string;
  createdRole?: string;
  location?: string;
  description?: string;
  status?: 'active' | 'canceled' | 'rescheduled';
}

export const SANCTUARY_EVENTS_STORAGE_KEY = 'sanctuary_calendar_events';

export const getStoredGatheringEvents = (): GatheringEvent[] => {
  try {
    const raw = localStorage.getItem(SANCTUARY_EVENTS_STORAGE_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      // Remove mock events if previously cached
      return parsed.filter(e => e.id !== 'mof_gathering_launch' && e.id !== 'wi_gathering_launch');
    }
    return [];
  } catch (err) {
    console.error('Failed reading sanctuary_calendar_events:', err);
    return [];
  }
};

export const saveGatheringEvent = (event: GatheringEvent): GatheringEvent[] => {
  const current = getStoredGatheringEvents();
  const existingIdx = current.findIndex(e => e.id === event.id);
  let updated: GatheringEvent[];
  if (existingIdx >= 0) {
    updated = current.map(e => e.id === event.id ? event : e);
  } else {
    updated = [event, ...current];
  }
  try {
    localStorage.setItem(SANCTUARY_EVENTS_STORAGE_KEY, JSON.stringify(updated));
    // Broadcast event so other components (Calendar, Hubs) sync immediately
    window.dispatchEvent(new CustomEvent('sanctuary_calendar_events_updated', {
      detail: { events: updated, newEvent: event }
    }));
  } catch (err) {
    console.error('Failed saving gathering event to storage:', err);
  }

  // Sync to server API and Firestore cloud in background
  try {
    import('../services/firebaseSyncService')
      .then(m => m.saveSanctuaryEventToCloud(event))
      .catch(() => {});
  } catch {}

  try {
    fetch('/api/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: event.id,
        title: event.title,
        type: event.groupTag === '#MenOnFire' ? 'Men On Fire' : event.groupTag === '#WomenIgnited' ? 'Women Ignited' : 'Small Group',
        date: event.date,
        time: event.time,
        description: event.focusTopic ? `${event.scriptureRef}: ${event.focusTopic}` : event.description,
        isZoom: Boolean(event.zoomUrl),
        zoomUrl: event.zoomUrl,
        groupTag: event.groupTag
      })
    }).catch(() => {});
  } catch {}

  return updated;
};

export const deleteGatheringEvent = (id: string): GatheringEvent[] => {
  const current = getStoredGatheringEvents();
  const updated = current.filter(e => e.id !== id);
  try {
    localStorage.setItem(SANCTUARY_EVENTS_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('sanctuary_calendar_events_updated', {
      detail: { events: updated, deletedId: id }
    }));
  } catch (err) {
    console.error('Failed deleting gathering event:', err);
  }
  return updated;
};
