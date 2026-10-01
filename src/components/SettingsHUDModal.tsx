import React, { useState, useEffect } from 'react';
import { 
  X, Volume2, Music, Check, ShieldAlert, Sparkles, 
  BarChart3, LogOut, Sliders, ShieldCheck, UserCheck, 
  Bell, Mic, Palette, Radio, Globe, Calendar, Video, Flame, EyeOff, RotateCcw 
} from 'lucide-react';
import { AVAILABLE_LAUNCH_TRACKS, LaunchTrackOption } from '../data/launchTracks';
import { GOSPEL_STATIONS, RadioStation } from '../data/radioStations';
import { APP_THEMES } from './ThemeHUDModal';
import { getStoredThemes, AppTheme } from '../data/appThemes';
import { FirebaseStatusBadge } from './FirebaseStatusBadge';
import { MINISTRY_ROLES, ADMIN_SECURITY_PASSCODE, getRoleById } from '../data/ministryRoles';
import { 
  getBeaconMode, 
  setBeaconMode, 
  dismissBeaconBanner, 
  resetBeaconDismissal 
} from '../data/broadcastMeetingData';

export interface CurrentUser {
  id: string;
  name: string;
  email?: string;
  gender?: 'male' | 'female';
  avatar?: string;
  isAdmin: boolean;
  role?: string;
  accountType?: 'member' | 'administrator';
  ministryRoleId?: string;
  ministryRoleLabel?: string;
  calling?: string;
  birthday?: string; // MM-DD format
  [key: string]: any;
}

interface SettingsHUDModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: CurrentUser;
  selectedTrack: LaunchTrackOption;
  onSelectTrack: (track: LaunchTrackOption) => void;
  appVolume: number;
  onVolumeChange: (vol: number) => void;
  soundEnabled: boolean;
  onToggleSound: (enabled: boolean) => void;
  onOpenVoiceSanctuary: () => void;
  onOpenProgress: () => void;
  onOpenAdminCMS: () => void;
  onOpenWelcome?: () => void;
  onUpdateUser?: (updated: CurrentUser) => void;
  onLogout: () => void;
}

export const SettingsHUDModal: React.FC<SettingsHUDModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  selectedTrack,
  onSelectTrack,
  appVolume,
  onVolumeChange,
  soundEnabled,
  onToggleSound,
  onOpenVoiceSanctuary,
  onOpenProgress,
  onOpenAdminCMS,
  onOpenWelcome,
  onUpdateUser,
  onLogout,
}) => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(() => {
    return localStorage.getItem('youngfire_notifications_enabled') !== 'false';
  });
  const [dailyReminders, setDailyReminders] = useState(() => {
    return localStorage.getItem('youngfire_daily_reminders') !== 'false';
  });
  const [voiceSensitivity, setVoiceSensitivity] = useState(0.8);
  const [currentTheme, setCurrentTheme] = useState(() => {
    return localStorage.getItem('youngfire_theme_id') || 'spurs-silver';
  });
  const [themes, setThemes] = useState<AppTheme[]>(() => getStoredThemes());

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

  // Broadcast Beacon Display Mode State
  const [beaconModeState, setBeaconModeState] = useState<'auto' | 'always' | 'disabled'>(() => getBeaconMode());

  // Ministry Role & Account Type State
  const [profileRole, setProfileRole] = useState<string>(() => currentUser.ministryRoleId || 'disciple');
  const [profileAccountType, setProfileAccountType] = useState<'member' | 'administrator'>(() => {
    return currentUser.accountType || (currentUser.isAdmin ? 'administrator' : 'member');
  });
  const [adminPasscode, setAdminPasscode] = useState('');
  const [profileSaveSuccess, setProfileSaveSuccess] = useState('');

  if (!isOpen) return null;

  const handleSaveProfileRole = () => {
    let makeAdmin = currentUser.isAdmin;
    if (profileAccountType === 'administrator') {
      if (!currentUser.isAdmin) {
        if (adminPasscode.trim() !== ADMIN_SECURITY_PASSCODE && 
            !currentUser.email?.toLowerCase().includes('trent') && 
            !currentUser.email?.toLowerCase().includes('whitney')) {
          alert(`Invalid Administrator Passcode. Use ${ADMIN_SECURITY_PASSCODE} to authorize administrator elevation.`);
          return;
        }
      }
      makeAdmin = true;
    } else {
      if (!currentUser.email?.toLowerCase().includes('trent') && !currentUser.email?.toLowerCase().includes('whitney')) {
        makeAdmin = false;
      }
    }

    const roleObj = getRoleById(profileRole);
    const updated: CurrentUser = {
      ...currentUser,
      isAdmin: makeAdmin,
      accountType: profileAccountType,
      role: roleObj.label,
      ministryRoleId: roleObj.id,
      ministryRoleLabel: roleObj.label,
      calling: roleObj.defaultCalling
    };

    if (onUpdateUser) {
      onUpdateUser(updated);
    }

    try {
      localStorage.setItem('youngfire_device_session_v1', JSON.stringify(updated));
      localStorage.setItem('youngfire_user_session', JSON.stringify(updated));

      const rosterRaw = localStorage.getItem('youngfire_member_roster_v2');
      if (rosterRaw) {
        const roster = JSON.parse(rosterRaw);
        const idx = roster.findIndex((m: any) => m.id === currentUser.id || m.email === currentUser.email);
        if (idx >= 0) {
          roster[idx] = {
            ...roster[idx],
            role: `${roleObj.label} • ${profileAccountType === 'administrator' ? 'Administrator' : 'Member'}`,
            calling: roleObj.defaultCalling,
            isAdmin: makeAdmin,
            accountType: profileAccountType
          };
          localStorage.setItem('youngfire_member_roster_v2', JSON.stringify(roster));
        }
      }
    } catch {}

    setProfileSaveSuccess('Role and Account Designation Synchronized!');
    setTimeout(() => setProfileSaveSuccess(''), 2500);
  };

  const handleToggleNotifications = (val: boolean) => {
    setNotificationsEnabled(val);
    localStorage.setItem('youngfire_notifications_enabled', String(val));
  };

  const handleToggleDaily = (val: boolean) => {
    setDailyReminders(val);
    localStorage.setItem('youngfire_daily_reminders', String(val));
  };

  const handleSelectTheme = (id: string) => {
    setCurrentTheme(id);
    localStorage.setItem('youngfire_theme_id', id);
    const targetTheme = themes.find(t => t.id === id) || APP_THEMES.find(t => t.id === id);
    if (targetTheme) {
      document.documentElement.style.setProperty('--theme-bg', targetTheme.bgHex);
      document.documentElement.style.setProperty('--theme-card', targetTheme.cardHex);
      document.documentElement.style.setProperty('--theme-accent', targetTheme.accentHex);
      document.documentElement.style.setProperty('--theme-border', targetTheme.borderHex);
      document.body.style.backgroundColor = targetTheme.bgHex;
    }
    window.dispatchEvent(new CustomEvent('yf_theme_applied', { detail: { themeId: id } }));
  };

  return (
    <div 
      className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 select-none animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-lg bg-[#0B1329] border border-amber-500/40 rounded-3xl p-6 shadow-2xl space-y-5 text-white max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold font-['Outfit'] uppercase text-white tracking-wide">
                SANCTUARY PREFERENCES & HUD
              </h2>
              <p className="text-[10px] font-mono text-slate-400">
                Spurs Heritage &bull; Liturgical Settings &bull; Audio Routing
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white cursor-pointer transition-colors"
            aria-label="Close Settings"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Global Real-Time Cloud Sync Diagnostic Badge */}
        <FirebaseStatusBadge variant="compact" showDetails={true} />

        {/* SECTION 1: STARTUP AUDIO & RADIO */}
        <div className="p-4 bg-[#070C1C] rounded-2xl border border-white/10 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">
              <Music className="w-4 h-4" />
              <span>1. Startup Audio & Gospel Radio</span>
            </div>
            <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold">
              Background Auto-Stream
            </span>
          </div>
          
          <p className="text-[11px] text-slate-300 font-mono">
            Default stream plays upon entering Sanctuary until manually paused:
          </p>

          <div className="space-y-2">
            {AVAILABLE_LAUNCH_TRACKS.map((track) => {
              const isSelected = track.id === selectedTrack.id;
              return (
                <div
                  key={track.id}
                  onClick={() => onSelectTrack(track)}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? 'bg-amber-500/20 border-amber-400 text-white shadow-lg shadow-amber-500/10'
                      : 'bg-black/40 border-white/10 text-slate-300 hover:border-white/25 hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <div className="w-7 h-7 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-400 flex-shrink-0">
                      {track.type === 'radio' ? <Radio className="w-3.5 h-3.5" /> : <Music className="w-3.5 h-3.5" />}
                    </div>
                    <div className="truncate">
                      <h4 className="text-xs font-bold text-white truncate">{track.title}</h4>
                      <p className="text-[10px] text-slate-400 font-mono truncate">{track.artist}</p>
                    </div>
                  </div>
                  {isSelected && (
                    <div className="w-5 h-5 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center text-[10px] font-bold flex-shrink-0">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Master Sound Volume */}
          <div className="space-y-1 pt-2 border-t border-white/5">
            <div className="flex justify-between text-[11px] font-mono text-slate-300">
              <span className="flex items-center gap-1.5">
                <Volume2 className="w-3.5 h-3.5 text-amber-400" />
                <span>Master Sanctuary Volume</span>
              </span>
              <span className="text-amber-400 font-bold">{Math.round(appVolume * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={appVolume}
              onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
            />
          </div>
        </div>

        {/* SECTION 2: NOTIFICATIONS & ALERTS */}
        <div className="p-4 bg-[#070C1C] rounded-2xl border border-white/10 space-y-3">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">
            <Bell className="w-4 h-4" />
            <span>2. Notifications & Gathering Alerts</span>
          </div>

          <div className="flex items-center justify-between text-xs font-mono">
            <span>Small Group & Event Reminders</span>
            <button
              onClick={() => handleToggleNotifications(!notificationsEnabled)}
              className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                notificationsEnabled ? 'bg-amber-500' : 'bg-slate-800'
              }`}
            >
              <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                notificationsEnabled ? 'left-6' : 'left-1'
              }`} />
            </button>
          </div>

          <div className="flex items-center justify-between text-xs font-mono pt-2 border-t border-white/5">
            <span>Daily Bread (Morning & Evening Alerts)</span>
            <button
              onClick={() => handleToggleDaily(!dailyReminders)}
              className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                dailyReminders ? 'bg-amber-500' : 'bg-slate-800'
              }`}
            >
              <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                dailyReminders ? 'left-6' : 'left-1'
              }`} />
            </button>
          </div>
        </div>

        {/* SECTION 2.5: BROADCAST & MEETING BEACON BANNER (Auto-Hide When Over) */}
        <div className="p-4 bg-[#070C1C] rounded-2xl border border-white/10 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">
              <Flame className="w-4 h-4 text-amber-400" />
              <span>Broadcast & Meeting Beacon Banner</span>
            </div>
            <span className="text-[10px] font-mono text-slate-400">Auto-Expire Controls</span>
          </div>

          <p className="text-[11px] font-serif text-slate-300 leading-relaxed">
            Configure the top broadcast banner. When set to <strong>Auto</strong>, the banner will automatically display when a meeting is upcoming & active, and automatically disappear whenever the meeting is over!
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
            <button
              type="button"
              onClick={() => {
                setBeaconMode('auto');
                setBeaconModeState('auto');
              }}
              className={`py-2 px-2 rounded-xl text-center text-xs font-mono font-bold border transition-colors cursor-pointer ${
                beaconModeState === 'auto'
                  ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md'
                  : 'bg-black/40 border-white/10 text-slate-400 hover:text-white'
              }`}
            >
              Auto (Hide When Over)
            </button>
            <button
              type="button"
              onClick={() => {
                setBeaconMode('always');
                setBeaconModeState('always');
              }}
              className={`py-2 px-2 rounded-xl text-center text-xs font-mono font-bold border transition-colors cursor-pointer ${
                beaconModeState === 'always'
                  ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md'
                  : 'bg-black/40 border-white/10 text-slate-400 hover:text-white'
              }`}
            >
              Always Display
            </button>
            <button
              type="button"
              onClick={() => {
                setBeaconMode('disabled');
                setBeaconModeState('disabled');
              }}
              className={`py-2 px-2 rounded-xl text-center text-xs font-mono font-bold border transition-colors cursor-pointer ${
                beaconModeState === 'disabled'
                  ? 'bg-rose-500 text-white border-rose-400 shadow-md'
                  : 'bg-black/40 border-white/10 text-slate-400 hover:text-white'
              }`}
            >
              Turn Off / Hide
            </button>
          </div>

          <div className="flex items-center gap-2 pt-1 border-t border-white/5 flex-wrap">
            <button
              type="button"
              onClick={() => {
                dismissBeaconBanner();
                alert("Meeting beacon banner has been dismissed and hidden.");
              }}
              className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-[11px] font-mono flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <EyeOff className="w-3.5 h-3.5 text-rose-400" />
              <span>Dismiss Banner Now</span>
            </button>
            <button
              type="button"
              onClick={() => {
                resetBeaconDismissal();
                alert("Beacon banner dismissal reset. Banner will show if meeting is active.");
              }}
              className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-[11px] font-mono flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
              <span>Reset Banner Visibility</span>
            </button>
          </div>
        </div>

        {/* SECTION 3: LIVE VOICE SANCTUARY MIC & AUDIO PREFERENCES */}
        <div className="p-4 bg-[#070C1C] rounded-2xl border border-white/10 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
              <Mic className="w-4 h-4" />
              <span>3. Live Voice Sanctuary & Mic Sensitivity</span>
            </div>
            <button
              onClick={() => { onClose(); onOpenVoiceSanctuary(); }}
              className="text-[10px] font-mono text-cyan-300 hover:underline"
            >
              Open Live Mic &rarr;
            </button>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-[11px] font-mono text-slate-300">
              <span>Mic Gain / Voice Sensitivity</span>
              <span className="text-cyan-400 font-bold">{Math.round(voiceSensitivity * 100)}%</span>
            </div>
            <input
              type="range"
              min="0.2"
              max="1"
              step="0.05"
              value={voiceSensitivity}
              onChange={(e) => setVoiceSensitivity(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
          </div>

          <button
            onClick={() => { onClose(); onOpenProgress(); }}
            className="w-full py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-slate-300 flex items-center justify-between cursor-pointer"
          >
            <span className="flex items-center gap-2 text-emerald-300">
              <BarChart3 className="w-4 h-4" />
              <span>View 66-Book Reading Progress Tracker</span>
            </span>
            <span className="text-slate-400">&rarr;</span>
          </button>
        </div>

        {/* SECTION 4: THEME & PALETTES */}
        <div className="p-4 bg-[#070C1C] rounded-2xl border border-white/10 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">
              <Palette className="w-4 h-4" />
              <span>4. Liturgical Palettes ({themes.length})</span>
            </div>
            <span className="text-[10px] font-mono text-slate-400">Instant Theme Switch</span>
          </div>

          <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto pr-1">
            {themes.map((theme) => {
              const isSelected = currentTheme === theme.id;
              return (
                <div
                  key={theme.id}
                  onClick={() => handleSelectTheme(theme.id)}
                  className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                    isSelected
                      ? 'border-amber-400 bg-white/10 shadow-sm'
                      : 'border-white/5 bg-black/40 hover:border-white/15'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3.5 h-3.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: theme.accentHex }}
                    />
                    <span className="text-xs font-bold text-white truncate font-['Outfit']">
                      {theme.name.split(' ')[0]} {theme.name.split(' ')[1] || ''}
                    </span>
                  </div>
                  <span className="text-[9px] font-mono text-slate-400 block truncate mt-0.5">
                    {theme.badge}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* SECTION 5: MINISTRY ROLE & ACCOUNT DESIGNATION */}
        <div className="p-4 bg-[#070C1C] rounded-2xl border border-white/10 space-y-3.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>5. Ministry Role & Account Designation</span>
            </div>
            <span className={`text-[9px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
              profileAccountType === 'administrator' 
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' 
                : 'bg-slate-500/20 text-slate-300'
            }`}>
              {profileAccountType === 'administrator' ? 'Administrator Account' : 'Member Account'}
            </span>
          </div>

          {profileSaveSuccess && (
            <div className="p-2.5 bg-emerald-500/20 border border-emerald-400 rounded-xl text-emerald-300 text-xs font-mono font-bold flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>{profileSaveSuccess}</span>
            </div>
          )}

          {/* Account Type Selector (Member vs Administrator) */}
          <div>
            <label className="text-[11px] font-mono text-slate-400 block mb-1.5">
              Account Access Level
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setProfileAccountType('member')}
                className={`py-2 px-3 rounded-xl text-xs font-mono font-bold border transition-colors cursor-pointer text-center ${
                  profileAccountType === 'member'
                    ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md'
                    : 'bg-black/40 border-white/10 text-slate-400 hover:text-white'
                }`}
              >
                YoungFire Member
              </button>
              <button
                type="button"
                onClick={() => setProfileAccountType('administrator')}
                className={`py-2 px-3 rounded-xl text-xs font-mono font-bold border transition-colors cursor-pointer text-center ${
                  profileAccountType === 'administrator'
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 border-amber-400 shadow-md'
                    : 'bg-black/40 border-white/10 text-slate-400 hover:text-white'
                }`}
              >
                Administrator
              </button>
            </div>
          </div>

          {/* Passcode field if choosing Administrator when not already admin */}
          {profileAccountType === 'administrator' && !currentUser.isAdmin && (
            <div className="p-3 bg-amber-950/40 rounded-xl border border-amber-500/40 space-y-1">
              <label className="text-[11px] font-mono text-amber-300 block">
                Admin Authorization Key (Passcode)
              </label>
              <input
                type="password"
                placeholder="Enter FIRE2026"
                value={adminPasscode}
                onChange={(e) => setAdminPasscode(e.target.value)}
                className="w-full bg-[#050A18] border border-amber-500/40 rounded-xl px-3 py-1.5 text-xs text-white font-mono"
              />
              <span className="text-[9px] font-mono text-slate-400">
                Authorized for sanctuary facilitators (Passcode: FIRE2026).
              </span>
            </div>
          )}

          {/* Ministry Role Selector */}
          <div>
            <label className="text-[11px] font-mono text-slate-400 block mb-1.5">
              Active Ministry Role
            </label>
            <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto pr-1">
              {MINISTRY_ROLES.map((r) => {
                const isSelected = profileRole === r.id;
                return (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setProfileRole(r.id)}
                    className={`p-2 rounded-xl border text-left cursor-pointer transition-all flex flex-col justify-between ${
                      isSelected
                        ? `${r.badgeBg} ${r.borderColor} ring-1 ring-amber-400 shadow-md`
                        : 'bg-black/40 border-white/10 text-slate-400 hover:text-white hover:border-white/20'
                    }`}
                  >
                    <span className={`text-[10px] font-mono font-bold ${r.badgeText} truncate`}>
                      {r.label}
                    </span>
                    <span className="text-[8px] text-slate-400 truncate mt-0.5">
                      {r.defaultCalling}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Save Profile Button */}
          <button
            type="button"
            onClick={handleSaveProfileRole}
            className="w-full py-2.5 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs font-mono shadow-md flex items-center justify-center gap-1.5 cursor-pointer transition-all active:scale-[0.98]"
          >
            <Check className="w-4 h-4 stroke-[3]" />
            <span>Update Ministry Role & Account</span>
          </button>
        </div>

        {/* SECTION 6: ADMIN CMS (VISIBLE FOR ADMINISTRATORS ONLY) */}
        {currentUser.isAdmin && (
          <div className="p-4 bg-amber-950/30 rounded-2xl border border-amber-500/40 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-300 uppercase tracking-wider">
                <ShieldAlert className="w-4 h-4 text-amber-400" />
                <span>6. Executive Leadership Controls</span>
              </div>
              <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                For Administrators Only
              </span>
            </div>

            <p className="text-[11px] text-slate-300 font-mono">
              Annual Theme: <strong className="text-white">"Rebuilding Better Together" &bull; Eph 4:16</strong>
            </p>

            <button
              onClick={() => { onClose(); onOpenAdminCMS(); }}
              className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              <span>Open Admin CMS (Theme, Zoom Sync & Roster) &rarr;</span>
            </button>
          </div>
        )}

        {/* SECTION 6: USER PROFILE & LOGOUT */}
        <div className="pt-2 border-t border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            {currentUser.avatar ? (
              <img 
                src={currentUser.avatar} 
                alt={currentUser.name} 
                className="w-9 h-9 rounded-full object-cover border border-amber-500/40"
              />
            ) : (
              <div className="w-9 h-9 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-bold text-xs">
                {currentUser.name.slice(0, 2).toUpperCase()}
              </div>
            )}
            <div>
              <div className="text-xs font-bold text-white font-['Outfit']">{currentUser.name}</div>
              <div className="text-[10px] font-mono text-slate-400">
                {currentUser.isAdmin ? 'App Administrator / Facilitator' : 'YoungFire Disciple'}
              </div>
            </div>
          </div>

          <button
            onClick={onLogout}
            className="px-3.5 py-1.5 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 border border-rose-500/40 text-rose-300 text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>

      </div>
    </div>
  );
};
