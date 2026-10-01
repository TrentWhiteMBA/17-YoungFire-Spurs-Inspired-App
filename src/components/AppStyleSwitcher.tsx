import React from 'react';
import { Palette, Sparkles, ChevronRight } from 'lucide-react';
import { AppTheme } from '../data/appThemes';

interface AppStyleSwitcherProps {
  onOpenThemeModal: () => void;
  activeTheme?: AppTheme;
  className?: string;
}

export const AppStyleSwitcher: React.FC<AppStyleSwitcherProps> = ({
  onOpenThemeModal,
  activeTheme,
  className = ''
}) => {
  // Extract theme badge or fallback name
  const themeBadge = activeTheme?.badge 
    ? activeTheme.badge.toUpperCase() 
    : (activeTheme?.name ? activeTheme.name.toUpperCase() : 'SPURS HERITAGE');

  const accentColor = activeTheme?.accentHex || '#F59E0B';

  return (
    <div 
      onClick={onOpenThemeModal}
      className={`w-full py-2 px-3 sm:px-4 rounded-xl bg-black/60 hover:bg-black/80 border border-white/10 hover:border-white/20 transition-all cursor-pointer flex items-center justify-between gap-3 shadow-lg shadow-black/50 group select-none ${className}`}
      title="Switch Sanctuary App Style & Color Theme"
    >
      {/* Left Text: SWITCH YOUR APP STYLE */}
      <div className="flex items-center gap-2">
        <Palette className="w-3.5 h-3.5 text-amber-400 group-hover:rotate-12 transition-transform" />
        <span className="font-pro-display tracking-[0.18em] text-xs sm:text-sm text-white group-hover:text-amber-300 transition-colors">
          SWITCH YOUR APP STYLE
        </span>
      </div>

      {/* Right Pill Badge: Contained inside a thin 1px rounded rectangular pill with glowing outline */}
      <div 
        className="px-2.5 py-1 rounded-md text-[10px] sm:text-[11px] font-condensed font-black tracking-widest uppercase transition-all flex items-center gap-1.5"
        style={{
          border: `1px solid ${accentColor}`,
          backgroundColor: `${accentColor}18`,
          color: accentColor,
          boxShadow: `0 0 10px ${accentColor}33`
        }}
      >
        <span>[ {themeBadge} ]</span>
        <ChevronRight className="w-3 h-3 opacity-70 group-hover:translate-x-0.5 transition-transform" />
      </div>
    </div>
  );
};

export default AppStyleSwitcher;
