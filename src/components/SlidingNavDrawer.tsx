import React from 'react';
import { 
  X, Layers, Video, Radio, Sparkles, BookMarked, 
  Compass, PenTool, Palette, Heart, Sliders, Users,
  Flame, ChevronRight, UserCheck, Shield, BookOpen
} from 'lucide-react';
import { CurrentUser } from './SettingsHUDModal';

export interface SlidingNavDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tab: string, subView?: 'bible' | 'atlas') => void;
  onOpenThemeModal: () => void;
  onOpenNotesModal: () => void;
  onOpenSettingsModal: () => void;
  onOpenWelcomeModal: () => void;
  currentUser?: CurrentUser | null;
}

export const SlidingNavDrawer: React.FC<SlidingNavDrawerProps> = ({
  isOpen,
  onClose,
  onNavigate,
  onOpenThemeModal,
  onOpenNotesModal,
  onOpenSettingsModal,
  onOpenWelcomeModal,
  currentUser
}) => {
  if (!isOpen) return null;

  const navItems = [
    {
      id: 'discipleship',
      label: 'My Discipleship Vault',
      sub: '12 Authentic Sessions & Sword Check-In',
      icon: BookOpen,
      color: 'text-amber-400 bg-amber-500/20 border-amber-400/30'
    },
    {
      id: 'prayer_dock',
      label: '24/7 Prayer Dock',
      sub: 'Sacred Intercession Watch & Requests',
      icon: Heart,
      color: 'text-orange-400 bg-orange-500/20 border-orange-400/30'
    },
    {
      id: 'fellowship',
      label: 'Fellowship Hubs (All 12 Centers)',
      sub: 'Men On Fire, Women Ignited, Community Outreach',
      icon: Layers,
      color: 'text-amber-400 bg-amber-500/20 border-amber-400/30'
    },
    {
      id: 'tv',
      label: 'Kingdom Video Vault & Worship TV',
      sub: '200+ JHOW Sermons, BibleProject & Praise',
      icon: Video,
      color: 'text-rose-400 bg-rose-500/20 border-rose-400/30'
    },
    {
      id: 'radio',
      label: '24/7 Gospel Radio Ecosystem',
      sub: '8 Global Broadcast Stations & Praise Anthems',
      icon: Radio,
      color: 'text-orange-400 bg-orange-500/20 border-orange-400/30'
    },
    {
      id: 'mentor',
      label: 'Ask AI Young Adult Mentor',
      sub: 'Scriptural Counseling, Guidance & Prayer',
      icon: Sparkles,
      color: 'text-purple-400 bg-purple-500/20 border-purple-400/30'
    },
    {
      id: 'bibletracker',
      label: 'Physical Bible Tracker',
      sub: 'Paper Sword Reading Plan & Streaks',
      icon: BookMarked,
      color: 'text-emerald-400 bg-emerald-500/20 border-emerald-400/30'
    },
    {
      id: 'atlas',
      label: '66-Book Imperial Scripture Atlas',
      sub: 'Comprehensive Geographic & Theological Mapping',
      icon: Compass,
      color: 'text-cyan-400 bg-cyan-500/20 border-cyan-400/30'
    }
  ];

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity animate-fadeIn cursor-pointer"
      />

      {/* Drawer Panel */}
      <div className="relative w-full max-w-sm sm:max-w-md bg-[#040711] border-l border-white/15 h-full overflow-y-auto shadow-2xl p-5 flex flex-col justify-between z-10 animate-slideInRight text-white select-none">
        
        {/* Top Header */}
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center text-slate-950 font-bold">
                <Flame className="w-4 h-4 fill-current" />
              </div>
              <div>
                <h3 className="text-sm font-black uppercase tracking-wider font-['Outfit'] text-white">
                  YOUNG<span className="text-amber-400">FIRE</span> DRAWER
                </h3>
                <p className="text-[10px] font-mono text-slate-400">Joshua House of Worship</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white cursor-pointer transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Current User Card */}
          {currentUser && (
            <div className="p-3.5 rounded-2xl bg-[#080E21] border border-amber-500/30 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-900 border border-amber-400 flex items-center justify-center text-amber-400 font-bold font-['Outfit'] overflow-hidden flex-shrink-0">
                {currentUser.avatar && currentUser.avatar.startsWith('data:') ? (
                  <img src={currentUser.avatar} alt={currentUser.name} className="w-full h-full object-cover" />
                ) : (
                  (currentUser.name || 'D').slice(0, 2).toUpperCase()
                )}
              </div>
              <div className="truncate flex-1">
                <div className="flex items-center gap-1.5">
                  <h4 className="text-xs font-bold text-white truncate font-['Outfit']">{currentUser.name}</h4>
                  {currentUser.isAdmin && (
                    <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 text-[9px] font-mono border border-amber-500/30">
                      Overseer
                    </span>
                  )}
                </div>
                <p className="text-[10px] text-amber-400 font-mono truncate">{currentUser.calling || 'Word Disciple'}</p>
                <p className="text-[9px] text-slate-400 font-mono truncate">{currentUser.email}</p>
              </div>
            </div>
          )}

          {/* Navigation Items List */}
          <div className="space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 block px-1">
              Sanctuary Pillars &amp; Media
            </span>

            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onClose();
                    if (item.id === 'atlas') {
                      onNavigate('word', 'atlas');
                    } else {
                      onNavigate(item.id);
                    }
                  }}
                  className="w-full p-3 rounded-2xl bg-[#080E21] hover:bg-[#0c1533] border border-white/10 hover:border-amber-500/40 flex items-center justify-between text-left transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-9 h-9 rounded-xl border flex items-center justify-center flex-shrink-0 ${item.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="truncate">
                      <h5 className="text-xs font-bold text-white group-hover:text-amber-300 font-['Outfit'] truncate">
                        {item.label}
                      </h5>
                      <p className="text-[10px] text-slate-400 font-mono truncate">
                        {item.sub}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                </button>
              );
            })}
          </div>

          {/* Quick HUD Triggers */}
          <div className="space-y-2 pt-2 border-t border-white/10">
            <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 block px-1">
              Discipleship Tools &amp; Appearance
            </span>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  onClose();
                  onOpenThemeModal();
                }}
                className="p-2.5 rounded-xl bg-[#080E21] hover:bg-slate-800 border border-white/10 flex items-center gap-2 text-xs font-mono text-slate-200 cursor-pointer"
              >
                <Palette className="w-3.5 h-3.5 text-amber-400" />
                <span>App Theme</span>
              </button>

              <button
                onClick={() => {
                  onClose();
                  onOpenNotesModal();
                }}
                className="p-2.5 rounded-xl bg-[#080E21] hover:bg-slate-800 border border-white/10 flex items-center gap-2 text-xs font-mono text-slate-200 cursor-pointer"
              >
                <PenTool className="w-3.5 h-3.5 text-amber-400" />
                <span>Study Notes</span>
              </button>

              <button
                onClick={() => {
                  onClose();
                  onOpenWelcomeModal();
                }}
                className="p-2.5 rounded-xl bg-[#080E21] hover:bg-slate-800 border border-white/10 flex items-center gap-2 text-xs font-mono text-slate-200 cursor-pointer"
              >
                <Heart className="w-3.5 h-3.5 text-rose-400" />
                <span>Welcome Hub</span>
              </button>

              <button
                onClick={() => {
                  onClose();
                  onOpenSettingsModal();
                }}
                className="p-2.5 rounded-xl bg-[#080E21] hover:bg-slate-800 border border-white/10 flex items-center gap-2 text-xs font-mono text-slate-200 cursor-pointer"
              >
                <Sliders className="w-3.5 h-3.5 text-cyan-400" />
                <span>Settings HUD</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-white/10 text-center space-y-1">
          <p className="text-[10px] font-mono text-amber-400 font-bold">
            Ephesians 4:16 &bull; Rebuilding Better Together
          </p>
          <p className="text-[9px] font-mono text-slate-500">
            YoungFire Ministry &bull; Joshua House of Worship
          </p>
        </div>

      </div>
    </div>
  );
};
