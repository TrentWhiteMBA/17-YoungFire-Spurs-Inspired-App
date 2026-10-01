import React, { useState, useEffect } from 'react';
import { 
  X, Palette, Check, Sparkles, Edit3, Trash2, Plus, 
  RotateCcw, Shield, CheckCircle2, AlertTriangle, Save 
} from 'lucide-react';
import { 
  AppTheme, 
  DEFAULT_APP_THEMES, 
  APP_THEMES, 
  getStoredThemes, 
  saveTheme, 
  deleteTheme, 
  resetThemes 
} from '../data/appThemes';
import { CurrentUser } from './SettingsHUDModal';

export type { AppTheme };
export { APP_THEMES };

interface ThemeHUDModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentThemeId?: string;
  onSelectTheme?: (themeId: string) => void;
  currentUser?: CurrentUser | null;
}

export const ThemeHUDModal: React.FC<ThemeHUDModalProps> = ({
  isOpen,
  onClose,
  currentThemeId = 'spurs-silver',
  onSelectTheme,
  currentUser
}) => {
  const [themes, setThemes] = useState<AppTheme[]>(() => getStoredThemes());
  const [selectedId, setSelectedId] = useState(currentThemeId);
  const [toastMsg, setToastMsg] = useState('');

  // Editing / Creating Theme State
  const [isEditingTheme, setIsEditingTheme] = useState(false);
  const [editingThemeId, setEditingThemeId] = useState<string | null>(null);
  const [themeName, setThemeName] = useState('');
  const [themeSubtitle, setThemeSubtitle] = useState('');
  const [themeBadge, setThemeBadge] = useState('');
  const [bgHex, setBgHex] = useState('#040711');
  const [cardHex, setCardHex] = useState('#0B1329');
  const [accentHex, setAccentHex] = useState('#F59E0B');
  const [borderHex, setBorderHex] = useState('#334155');

  // Check if current user is an administrator
  const isAdmin = Boolean(
    currentUser?.isAdmin ||
    currentUser?.accountType === 'administrator' ||
    (currentUser?.role || '').toLowerCase().includes('facilitator') ||
    (currentUser?.role || '').toLowerCase().includes('admin') ||
    (currentUser?.email || '').toLowerCase().includes('trent') ||
    (currentUser?.email || '').toLowerCase().includes('admin')
  );

  useEffect(() => {
    setSelectedId(currentThemeId);
  }, [currentThemeId]);

  useEffect(() => {
    const handleThemesUpdate = (e: Event) => {
      const customEv = e as CustomEvent<{ themes: AppTheme[] }>;
      if (customEv?.detail?.themes) {
        setThemes(customEv.detail.themes);
      } else {
        setThemes(getStoredThemes());
      }
    };
    window.addEventListener('yf_themes_list_updated', handleThemesUpdate);
    return () => window.removeEventListener('yf_themes_list_updated', handleThemesUpdate);
  }, []);

  if (!isOpen) return null;

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 2500);
  };

  const handleApplyTheme = (id: string) => {
    setSelectedId(id);
    if (onSelectTheme) onSelectTheme(id);
    try {
      localStorage.setItem('youngfire_theme_id', id);
      const targetTheme = themes.find(t => t.id === id);
      if (targetTheme) {
        document.documentElement.style.setProperty('--theme-bg', targetTheme.bgHex);
        document.documentElement.style.setProperty('--theme-card', targetTheme.cardHex);
        document.documentElement.style.setProperty('--theme-accent', targetTheme.accentHex);
        document.documentElement.style.setProperty('--theme-border', targetTheme.borderHex);
        document.body.style.backgroundColor = targetTheme.bgHex;
      }
      window.dispatchEvent(new CustomEvent('yf_theme_applied', { detail: { themeId: id } }));
    } catch {}
  };

  const handleOpenEdit = (theme: AppTheme, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingThemeId(theme.id);
    setThemeName(theme.name);
    setThemeSubtitle(theme.subtitle);
    setThemeBadge(theme.badge);
    setBgHex(theme.bgHex);
    setCardHex(theme.cardHex);
    setAccentHex(theme.accentHex);
    setBorderHex(theme.borderHex);
    setIsEditingTheme(true);
  };

  const handleOpenCreate = () => {
    setEditingThemeId(null);
    setThemeName('New Sanctuary Hue');
    setThemeSubtitle('Custom Apostolic & Prophetic Color Scheme');
    setThemeBadge('Custom Palette');
    setBgHex('#070C1C');
    setCardHex('#0F172A');
    setAccentHex('#F59E0B');
    setBorderHex('#38BDF8');
    setIsEditingTheme(true);
  };

  const handleSaveThemeForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!themeName.trim()) return;

    const themeId = editingThemeId || `custom-hue-${Date.now()}`;
    const newTheme: AppTheme = {
      id: themeId,
      name: themeName.trim(),
      subtitle: themeSubtitle.trim() || 'Custom sanctuary color scheme',
      badge: themeBadge.trim() || 'Custom Hue',
      bgHex: bgHex.trim(),
      cardHex: cardHex.trim(),
      accentHex: accentHex.trim(),
      borderHex: borderHex.trim(),
      isCustom: true
    };

    const updated = saveTheme(newTheme);
    setThemes(updated);
    setIsEditingTheme(false);
    showToast(editingThemeId ? 'Theme Hue Updated Successfully' : 'New Theme Hue Created');

    // If currently selected or just created, apply right away
    if (selectedId === themeId || !editingThemeId) {
      handleApplyTheme(themeId);
    }
  };

  const handleDeleteTheme = (themeId: string, themeTitle: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(`Delete the "${themeTitle}" theme hue from the sanctuary?`)) {
      const updated = deleteTheme(themeId);
      setThemes(updated);
      if (selectedId === themeId) {
        handleApplyTheme(updated[0]?.id || 'spurs-silver');
      }
      showToast(`Deleted "${themeTitle}"`);
    }
  };

  const handleResetDefaults = () => {
    if (confirm('Reset all sanctuary theme hues back to default 10 liturgical palettes?')) {
      const restored = resetThemes();
      setThemes(restored);
      handleApplyTheme('spurs-silver');
      showToast('All Liturgical Hues Reset to Defaults');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 select-none animate-fadeIn">
      <div className="bg-[#0B1329] border border-amber-500/40 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-[#070C1C] px-5 py-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black uppercase font-['Outfit'] text-white">
                  Liturgical Palettes & Hues ({themes.length})
                </h3>
                {isAdmin && (
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                    <Shield className="w-2.5 h-2.5" />
                    Admin Editable
                  </span>
                )}
              </div>
              <p className="text-[11px] font-mono text-slate-400">
                Spurs Heritage, Liturgical Seasons & Custom Sanctuary Themes
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Toast */}
        {toastMsg && (
          <div className="mx-4 mt-3 p-2.5 bg-emerald-500/20 border border-emerald-400 rounded-xl text-emerald-300 text-xs font-mono font-bold flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>{toastMsg}</span>
          </div>
        )}

        {/* Administrator Controls Bar */}
        {isAdmin && !isEditingTheme && (
          <div className="px-5 pt-3 pb-1 flex items-center justify-between gap-2 border-b border-white/5">
            <button
              onClick={handleOpenCreate}
              className="py-1.5 px-3 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Add New Hue</span>
            </button>
            <button
              onClick={handleResetDefaults}
              className="py-1.5 px-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white text-[11px] font-mono flex items-center gap-1 cursor-pointer transition-colors"
              title="Reset themes to default"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Defaults</span>
            </button>
          </div>
        )}

        {/* Editing or Creating Modal / Form */}
        {isEditingTheme ? (
          <form onSubmit={handleSaveThemeForm} className="p-5 space-y-4 overflow-y-auto flex-1">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase font-mono text-amber-400 flex items-center gap-1.5">
                <Edit3 className="w-3.5 h-3.5" />
                <span>{editingThemeId ? 'Edit Theme Hue' : 'Create New Theme Hue'}</span>
              </h4>
              <button
                type="button"
                onClick={() => setIsEditingTheme(false)}
                className="text-xs text-slate-400 hover:text-white font-mono cursor-pointer"
              >
                Cancel
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-[10px] font-mono uppercase text-slate-400 block mb-1">Theme Name</label>
                <input
                  type="text"
                  value={themeName}
                  onChange={(e) => setThemeName(e.target.value)}
                  placeholder="e.g. Damascus Road Amber"
                  required
                  className="w-full bg-[#070C1C] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="text-[10px] font-mono uppercase text-slate-400 block mb-1">Subtitle / Meaning</label>
                <input
                  type="text"
                  value={themeSubtitle}
                  onChange={(e) => setThemeSubtitle(e.target.value)}
                  placeholder="e.g. Prophetic Fire, Iron Sharpens Iron & Glory"
                  className="w-full bg-[#070C1C] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="text-[10px] font-mono uppercase text-slate-400 block mb-1">Badge Tag</label>
                <input
                  type="text"
                  value={themeBadge}
                  onChange={(e) => setThemeBadge(e.target.value)}
                  placeholder="e.g. Pentecost Season"
                  className="w-full bg-[#070C1C] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Color Pickers Grid */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="text-[10px] font-mono uppercase text-slate-400 block mb-1">Background Hex</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={bgHex}
                      onChange={(e) => setBgHex(e.target.value)}
                      className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                    />
                    <input
                      type="text"
                      value={bgHex}
                      onChange={(e) => setBgHex(e.target.value)}
                      className="w-full bg-[#070C1C] border border-white/10 rounded-xl px-2 py-1 text-xs text-white font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-mono uppercase text-slate-400 block mb-1">Card Hex</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={cardHex}
                      onChange={(e) => setCardHex(e.target.value)}
                      className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                    />
                    <input
                      type="text"
                      value={cardHex}
                      onChange={(e) => setCardHex(e.target.value)}
                      className="w-full bg-[#070C1C] border border-white/10 rounded-xl px-2 py-1 text-xs text-white font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-mono uppercase text-slate-400 block mb-1">Accent Hex</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={accentHex}
                      onChange={(e) => setAccentHex(e.target.value)}
                      className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                    />
                    <input
                      type="text"
                      value={accentHex}
                      onChange={(e) => setAccentHex(e.target.value)}
                      className="w-full bg-[#070C1C] border border-white/10 rounded-xl px-2 py-1 text-xs text-white font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-mono uppercase text-slate-400 block mb-1">Border Hex</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={borderHex}
                      onChange={(e) => setBorderHex(e.target.value)}
                      className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                    />
                    <input
                      type="text"
                      value={borderHex}
                      onChange={(e) => setBorderHex(e.target.value)}
                      className="w-full bg-[#070C1C] border border-white/10 rounded-xl px-2 py-1 text-xs text-white font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Live Preview Card */}
              <div 
                className="p-3.5 rounded-2xl border transition-all mt-2 space-y-1"
                style={{
                  backgroundColor: cardHex,
                  borderColor: borderHex,
                  color: '#ffffff'
                }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold font-['Outfit']">{themeName || 'Theme Preview'}</span>
                  <span 
                    className="text-[9px] font-mono px-2 py-0.5 rounded font-bold"
                    style={{ backgroundColor: accentHex, color: '#000000' }}
                  >
                    {themeBadge || 'Preview'}
                  </span>
                </div>
                <p className="text-[10px] text-slate-300 font-mono">{themeSubtitle || 'Previewing palette hues and contrast.'}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold text-xs uppercase tracking-wider font-['Outfit'] cursor-pointer shadow-md flex items-center justify-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Theme Hue</span>
              </button>
              <button
                type="button"
                onClick={() => setIsEditingTheme(false)}
                className="py-2.5 px-4 rounded-xl bg-white/10 text-slate-300 hover:text-white font-mono text-xs cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          /* Theme List */
          <div className="p-5 space-y-2.5 overflow-y-auto flex-1">
            {themes.map((theme) => {
              const isSelected = selectedId === theme.id;
              return (
                <div
                  key={theme.id}
                  onClick={() => handleApplyTheme(theme.id)}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    isSelected
                      ? 'border-amber-400 bg-white/10 shadow-lg scale-[1.01]'
                      : 'border-white/10 bg-[#070C1C] hover:border-white/20'
                  }`}
                  style={{
                    boxShadow: isSelected ? `0 0 20px ${theme.accentHex}40` : undefined
                  }}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className="w-9 h-9 rounded-xl border flex items-center justify-center flex-shrink-0"
                      style={{
                        backgroundColor: theme.bgHex,
                        borderColor: theme.accentHex
                      }}
                    >
                      <div 
                        className="w-3.5 h-3.5 rounded-full"
                        style={{ backgroundColor: theme.accentHex }}
                      />
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-xs font-bold text-white font-['Outfit'] truncate">{theme.name}</h4>
                        <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-white/10 text-slate-300">
                          {theme.badge}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 font-mono mt-0.5 truncate">{theme.subtitle}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    {/* Admin Edit & Delete buttons */}
                    {isAdmin && (
                      <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={(e) => handleOpenEdit(theme, e)}
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-amber-500/20 text-slate-400 hover:text-amber-300 transition-colors cursor-pointer"
                          title="Edit this theme hue"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={(e) => handleDeleteTheme(theme.id, theme.name, e)}
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
                          title="Delete this theme hue"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}

                    {isSelected && (
                      <div className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Footer */}
        <div className="bg-[#070C1C] px-5 py-3 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-slate-400">
          <span>Theme applies across all tabs seamlessly</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs cursor-pointer shadow-md"
          >
            Apply & Close
          </button>
        </div>

      </div>
    </div>
  );
};
