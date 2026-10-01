import { useState, useEffect } from 'react';
import { db, storage, hasFirebaseEnvVars } from '../firebase/config';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export interface CoverAssetSlot {
  key: string;
  title: string;
  subtitle: string;
  description: string;
  defaultUrl: string;
  recommendedAspect: string;
}

export const COVER_ASSET_SLOTS: CoverAssetSlot[] = [
  {
    key: 'fan_deck_card_1',
    title: 'Fan Deck Card 1 (Pulpit & Word Proclamation)',
    subtitle: '3D Clockwork Carousel • Left/Main Portrait Card',
    description: 'Pulpit truth proclamation portrait moment displayed in the rotating clockwork fan deck.',
    defaultUrl: '/image_4.png',
    recommendedAspect: '3:4 (Portrait)'
  },
  {
    key: 'fan_deck_card_2',
    title: 'Fan Deck Card 2 (Living Room Small Group Huddle)',
    subtitle: '3D Clockwork Carousel • Discipleship Brotherhood Huddle',
    description: 'Living room small group study and discipleship moment in the rotating clockwork fan deck.',
    defaultUrl: '/image_6.png',
    recommendedAspect: '3:4 (Portrait)'
  },
  {
    key: 'fan_deck_card_3',
    title: 'Fan Deck Card 3 (Creative Praise & Fellowship)',
    subtitle: '3D Clockwork Carousel • Sisterhood & Creative Fellowship',
    description: 'Generational praise, paint fellowship, and creative joy moment in the rotating clockwork fan deck.',
    defaultUrl: '/image_5.png',
    recommendedAspect: '3:4 (Portrait)'
  },
  {
    key: 'fan_deck_card_4',
    title: 'Fan Deck Card 4 (Youth Commission & Consecration)',
    subtitle: '3D Clockwork Carousel • Lead Facilitators Trent & Whitney',
    description: 'Sanctuary leadership and youth commissioning moment in the rotating clockwork fan deck.',
    defaultUrl: '/image_7.png',
    recommendedAspect: '3:4 (Portrait)'
  },
  {
    key: 'home_hero_banner',
    title: 'Main Homepage Hero Banner',
    subtitle: 'Sanctuary Pulpit & Header View',
    description: 'Background cover positioned behind the "Rebuilding Better Together" proclamation and 1-tap calendar buttons.',
    defaultUrl: '/image_4.png',
    recommendedAspect: '16:9 / 4:3 (Landscape HD)'
  },
  {
    key: 'welcome_sanctuary_cover',
    title: 'Welcome Hub Header Cover',
    subtitle: 'Sanctuary Entrance & Fellowship Life',
    description: 'Hero cover displayed at the top of the Welcome to YoungFire portal above the Connect Card.',
    defaultUrl: '/image_7.png',
    recommendedAspect: '16:9 (Landscape HD)'
  },
  {
    key: 'fellowship_hub_cover',
    title: 'Fellowship Idea Wall & Community Cover',
    subtitle: 'Consecrated Moments & Fellowship Gatherings',
    description: 'Header card image displayed on the Fellowship Hub and Idea Wall.',
    defaultUrl: '/image_5.png',
    recommendedAspect: '16:9 (Landscape HD)'
  },
  {
    key: 'open_bible_cover',
    title: 'Open Bible Thursdays Study Card',
    subtitle: '66-Book Random Exploration Engine',
    description: 'Feature cover representing Thursday Open Bible discussions and chapter deep-dives.',
    defaultUrl: '/image_6.png',
    recommendedAspect: '16:9 (Landscape HD)'
  },
  {
    key: 'small_groups_cover',
    title: 'Bi-Weekly Monday Small Group Card',
    subtitle: 'Living Room Study & Dinner Discipleship',
    description: 'Thumbnail and banner card representing Monday small groups and taught lessons.',
    defaultUrl: '/image_3.png',
    recommendedAspect: '16:9 (Landscape HD)'
  },
  {
    key: 'men_on_fire_cover',
    title: 'Men On Fire Brotherhood Cover',
    subtitle: 'Iron Sharpens Iron Brotherhood Space',
    description: 'Header banner and feature card for the Men On Fire cohort and brotherhood meetings.',
    defaultUrl: '/image_3.png',
    recommendedAspect: '16:9 (Landscape HD)'
  },
  {
    key: 'women_ignited_cover',
    title: 'Women Ignited Sisterhood Cover',
    subtitle: 'Proverbs 31 Sacred Flame Sisterhood Space',
    description: 'Header banner and feature card for the Women Ignited sisterhood cohort.',
    defaultUrl: '/image_2.png',
    recommendedAspect: '16:9 (Landscape HD)'
  }
];

export const ASSET_OVERRIDES_STORAGE_KEY = 'youngfire_asset_overrides';
export const ASSET_FIRESTORE_COLLECTION = 'app_branding_assets';
export const ASSET_FIRESTORE_DOC = 'cover_photos';

/**
 * Reads all cover overrides from localStorage
 */
export function getAllCoverOverrides(): Record<string, string> {
  try {
    const raw = localStorage.getItem(ASSET_OVERRIDES_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

/**
 * Synchronous getter with fallback to default
 */
export function getAppCover(assetKey: string): string {
  const overrides = getAllCoverOverrides();
  if (overrides[assetKey]) {
    return overrides[assetKey];
  }
  const slot = COVER_ASSET_SLOTS.find(s => s.key === assetKey);
  return slot ? slot.defaultUrl : '/image_4.png';
}

/**
 * Saves an override to localStorage, broadcasts custom event,
 * and syncs to Firestore if live cloud is connected.
 */
export async function setAppCoverOverride(assetKey: string, url: string): Promise<void> {
  const overrides = getAllCoverOverrides();
  overrides[assetKey] = url;

  try {
    localStorage.setItem(ASSET_OVERRIDES_STORAGE_KEY, JSON.stringify(overrides));
  } catch (err) {
    console.warn('[Cover Photos] LocalStorage save warning:', err);
  }

  // Broadcast event so all mounted components update dynamically without reload
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('youngfire_cover_assets_updated', {
        detail: { assetKey, url, overrides }
      })
    );
  }

  // Cloud sync to Firestore collection `app_branding_assets`
  if (db && hasFirebaseEnvVars) {
    try {
      const docRef = doc(db, ASSET_FIRESTORE_COLLECTION, ASSET_FIRESTORE_DOC);
      await setDoc(docRef, { [assetKey]: url, updatedAt: new Date().toISOString() }, { merge: true });
    } catch (err: any) {
      console.warn('[Cover Photos] Firestore sync warning:', err.message);
    }
  }

  // Server persistent sync
  try {
    fetch('/api/branding-assets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ assetKey, url })
    }).catch(() => {});
  } catch {}
}

/**
 * Resets a single asset slot to its default built-in image
 */
export async function resetAppCover(assetKey: string): Promise<void> {
  const overrides = getAllCoverOverrides();
  delete overrides[assetKey];

  try {
    localStorage.setItem(ASSET_OVERRIDES_STORAGE_KEY, JSON.stringify(overrides));
  } catch {}

  const slot = COVER_ASSET_SLOTS.find(s => s.key === assetKey);
  const defaultUrl = slot ? slot.defaultUrl : '/image_4.png';

  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('youngfire_cover_assets_updated', {
        detail: { assetKey, url: defaultUrl, overrides }
      })
    );
  }

  if (db && hasFirebaseEnvVars) {
    try {
      const docRef = doc(db, ASSET_FIRESTORE_COLLECTION, ASSET_FIRESTORE_DOC);
      await setDoc(docRef, { [assetKey]: null, updatedAt: new Date().toISOString() }, { merge: true });
    } catch {}
  }

  try {
    fetch('/api/branding-assets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ assetKey, url: null })
    }).catch(() => {});
  } catch {}
}

/**
 * Handles device file upload: uploads to Firebase Storage (`branding/`) if connected,
 * or compresses to optimized WebP/JPEG DataURL.
 */
export async function uploadCoverImage(slotKey: string, file: File): Promise<string> {
  if (storage && hasFirebaseEnvVars) {
    try {
      const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const storageRef = ref(storage, `branding/${slotKey}_${Date.now()}_${safeName}`);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadUrl = await getDownloadURL(snapshot.ref);
      await setAppCoverOverride(slotKey, downloadUrl);
      return downloadUrl;
    } catch (storageErr) {
      console.warn('[Cover Photos] Firebase Storage upload fallback to WebP DataURL:', storageErr);
    }
  }

  const compressed = await compressImageFile(file);
  await setAppCoverOverride(slotKey, compressed);
  return compressed;
}

/**
 * React hook that returns the active cover URL for an asset key.
 * Dynamically re-renders whenever the asset changes across tabs, modal updates, or Firestore sync.
 */
export function useAppCover(assetKey: string): string {
  const [coverUrl, setCoverUrl] = useState<string>(() => getAppCover(assetKey));

  useEffect(() => {
    // 1. Sync from current storage
    setCoverUrl(getAppCover(assetKey));

    // 2. Fetch latest from server API
    fetch('/api/branding-assets')
      .then(res => res.json())
      .then(data => {
        if (data?.assets && data.assets[assetKey]) {
          const serverUrl = data.assets[assetKey];
          setCoverUrl(serverUrl);
          const current = getAllCoverOverrides();
          current[assetKey] = serverUrl;
          try {
            localStorage.setItem(ASSET_OVERRIDES_STORAGE_KEY, JSON.stringify(current));
          } catch {}
        }
      })
      .catch(() => {});

    // 2. Listen to custom DOM event across components
    const handleUpdate = (e: any) => {
      if (e?.detail?.assetKey === assetKey || !e?.detail?.assetKey) {
        setCoverUrl(getAppCover(assetKey));
      }
    };

    window.addEventListener('youngfire_cover_assets_updated', handleUpdate);

    // 3. Optional real-time listener on Firestore doc
    let unsubscribe = () => {};
    if (db && hasFirebaseEnvVars) {
      try {
        const docRef = doc(db, ASSET_FIRESTORE_COLLECTION, ASSET_FIRESTORE_DOC);
        unsubscribe = onSnapshot(docRef, (snap) => {
          if (snap.exists()) {
            const data = snap.data();
            if (data && data[assetKey] && typeof data[assetKey] === 'string') {
              setCoverUrl(data[assetKey]);
              // Also sync to local storage
              const current = getAllCoverOverrides();
              current[assetKey] = data[assetKey];
              try {
                localStorage.setItem(ASSET_OVERRIDES_STORAGE_KEY, JSON.stringify(current));
              } catch {}
            }
          }
        }, (err) => {
          console.warn('[Cover Photos] Firestore listener notice:', err.message);
        });
      } catch {}
    }

    return () => {
      window.removeEventListener('youngfire_cover_assets_updated', handleUpdate);
      unsubscribe();
    };
  }, [assetKey]);

  return coverUrl;
}

/**
 * Client-side Canvas Image Compression helper
 * Downscales large device camera uploads to WebP/JPEG format to fit smoothly into memory & storage
 */
export async function compressImageFile(file: File, maxDimension = 1600, quality = 0.85): Promise<string> {
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

export const FAN_DECK_STORAGE_KEY = 'youngfire_fan_deck_photos';
export const DEFAULT_FAN_DECK_PHOTOS: string[] = [
  '/image_4.png',
  '/image_6.png',
  '/image_5.png',
  '/image_7.png'
];

/**
 * Returns dynamic list of fan deck photos from localStorage or defaults
 */
export function getFanDeckPhotos(): string[] {
  try {
    const raw = localStorage.getItem(FAN_DECK_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map((item: any) => typeof item === 'string' ? item : item.url).filter(Boolean);
      }
    }
  } catch {}
  return DEFAULT_FAN_DECK_PHOTOS;
}

/**
 * Saves dynamic fan deck photos list and dispatches real-time broadcast event
 */
export function saveFanDeckPhotos(photos: string[]): void {
  try {
    localStorage.setItem(FAN_DECK_STORAGE_KEY, JSON.stringify(photos));
  } catch (err) {
    console.warn('[Fan Deck] LocalStorage save warning:', err);
  }

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('yf_fan_deck_photos_updated', { detail: { photos } }));
  }

  // Cloud sync to Firestore if connected
  if (db && hasFirebaseEnvVars) {
    try {
      const docRef = doc(db, 'sanctuary_media', 'fan_deck');
      setDoc(docRef, { photos, updatedAt: new Date().toISOString() }, { merge: true }).catch(() => {});
    } catch {}
  }
}

/**
 * React hook to listen for real-time updates to fan deck photos
 */
export function useFanDeckPhotos(): [string[], (photos: string[]) => void] {
  const [photos, setPhotos] = useState<string[]>(() => getFanDeckPhotos());

  useEffect(() => {
    const handleUpdate = (e: any) => {
      if (e.detail?.photos && Array.isArray(e.detail.photos)) {
        setPhotos(e.detail.photos);
      } else {
        setPhotos(getFanDeckPhotos());
      }
    };

    window.addEventListener('yf_fan_deck_photos_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => {
      window.removeEventListener('yf_fan_deck_photos_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const updatePhotos = (newPhotos: string[]) => {
    saveFanDeckPhotos(newPhotos);
    setPhotos(newPhotos);
  };

  return [photos, updatePhotos];
}

export default useAppCover;
