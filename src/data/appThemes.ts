/**
 * YoungFire Liturgical Palettes & Sanctuary Hues Engine
 * Supports full Administrator editing, adding new palettes, and deleting custom/default palettes.
 */

export interface AppTheme {
  id: string;
  name: string;
  subtitle: string;
  badge: string;
  bgHex: string;
  cardHex: string;
  accentHex: string;
  borderHex: string;
  isCustom?: boolean;
}

export const DEFAULT_APP_THEMES: AppTheme[] = [
  {
    id: 'spurs-silver',
    name: 'San Antonio Spurs Metallic',
    subtitle: 'Classic Silver, Deep Obsidian & Pure White',
    badge: 'Spurs Heritage',
    bgHex: '#040711',
    cardHex: '#0B1329',
    accentHex: '#F59E0B',
    borderHex: '#334155'
  },
  {
    id: 'kingdom-gold',
    name: 'Kingdom Gold & Amber Altar',
    subtitle: 'Warm Sacred Fire, Rich Charcoal & Amber Glow',
    badge: 'Holy Fire',
    bgHex: '#120B04',
    cardHex: '#1D1207',
    accentHex: '#D97706',
    borderHex: '#78350F'
  },
  {
    id: 'men-on-fire',
    name: 'Men On Fire Flame',
    subtitle: 'Iron Sharpens Iron, Deep Ember & Blazing Orange',
    badge: 'Brotherhood Flame',
    bgHex: '#130704',
    cardHex: '#220D07',
    accentHex: '#F97316',
    borderHex: '#C2410C'
  },
  {
    id: 'women-ignited',
    name: 'Women Ignited Sacred Rose',
    subtitle: 'Royal Magenta, Sacred Sisterhood & Rose Gold',
    badge: 'Sisterhood Flame',
    bgHex: '#15050C',
    cardHex: '#240915',
    accentHex: '#F43F5E',
    borderHex: '#9F1239'
  },
  {
    id: 'dark-matter',
    name: 'Imperial Dark Matter',
    subtitle: 'Deep Cartography Obsidian & Radiant Cyan Nodes',
    badge: 'Atlas Cartography',
    bgHex: '#02040A',
    cardHex: '#070E20',
    accentHex: '#06B6D4',
    borderHex: '#1E293B'
  },
  {
    id: 'pentecost-scarlet',
    name: 'Pentecost Upper Room Scarlet',
    subtitle: 'Mighty Rushing Wind, Holy Ghost Flame & Ruby',
    badge: 'Acts 2 Outpouring',
    bgHex: '#170404',
    cardHex: '#2A0808',
    accentHex: '#EF4444',
    borderHex: '#991B1B'
  },
  {
    id: 'royal-purple',
    name: 'Mount Zion Royal Purple',
    subtitle: 'Apostolic Royalty, King’s Robe & Amethyst',
    badge: 'Priestly Heritage',
    bgHex: '#0E0517',
    cardHex: '#1B0B2E',
    accentHex: '#A855F7',
    borderHex: '#6B21A8'
  },
  {
    id: 'living-water',
    name: 'Living Waters Turquoise',
    subtitle: 'Pure River of Life, Refreshing Stream & Teal',
    badge: 'Ezekiel 47 River',
    bgHex: '#021214',
    cardHex: '#062024',
    accentHex: '#14B8A6',
    borderHex: '#0F766E'
  },
  {
    id: 'olive-grove',
    name: 'Gethsemane Olive Grove Emerald',
    subtitle: 'Watch & Pray, Everlasting Green & Altar Peace',
    badge: 'Consecrated Garden',
    bgHex: '#04130A',
    cardHex: '#092415',
    accentHex: '#10B981',
    borderHex: '#065F46'
  },
  {
    id: 'desert-solace',
    name: 'Sinai Desert Solace & Sandstone',
    subtitle: 'Still Small Voice, Pillar of Fire & Warm Sand',
    badge: 'Horeb Encounter',
    bgHex: '#140E06',
    cardHex: '#24190C',
    accentHex: '#EAB308',
    borderHex: '#854D0E'
  }
];

export const APP_THEMES = DEFAULT_APP_THEMES;

export const THEMES_STORAGE_KEY = 'youngfire_app_themes_v2';

export function getStoredThemes(): AppTheme[] {
  try {
    const raw = localStorage.getItem(THEMES_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch {}
  return DEFAULT_APP_THEMES;
}

export function saveTheme(theme: AppTheme): AppTheme[] {
  const current = getStoredThemes();
  const existingIdx = current.findIndex(t => t.id === theme.id);
  let updated: AppTheme[];
  if (existingIdx >= 0) {
    updated = current.map(t => (t.id === theme.id ? theme : t));
  } else {
    updated = [...current, theme];
  }
  try {
    localStorage.setItem(THEMES_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('yf_themes_list_updated', { detail: { themes: updated } }));
  } catch {}
  return updated;
}

export function deleteTheme(themeId: string): AppTheme[] {
  const current = getStoredThemes();
  const updated = current.filter(t => t.id !== themeId);
  const finalThemes = updated.length > 0 ? updated : DEFAULT_APP_THEMES;
  try {
    localStorage.setItem(THEMES_STORAGE_KEY, JSON.stringify(finalThemes));
    window.dispatchEvent(new CustomEvent('yf_themes_list_updated', { detail: { themes: finalThemes } }));
  } catch {}
  return finalThemes;
}

export function resetThemes(): AppTheme[] {
  try {
    localStorage.setItem(THEMES_STORAGE_KEY, JSON.stringify(DEFAULT_APP_THEMES));
    window.dispatchEvent(new CustomEvent('yf_themes_list_updated', { detail: { themes: DEFAULT_APP_THEMES } }));
  } catch {}
  return DEFAULT_APP_THEMES;
}
