import React, { useState, useRef, useEffect } from 'react';
import { 
  ChevronDown, Globe, Flame, Video, Heart, 
  MapPin, ExternalLink, Sparkles, Building2 
} from 'lucide-react';

export interface JhowMinistryDropdownProps {
  className?: string;
  onNavigateTab?: (tab: string) => void;
}

export const JhowMinistryDropdown: React.FC<JhowMinistryDropdownProps> = ({
  className = '',
  onNavigateTab
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const links = [
    {
      title: 'Official JHOW Website',
      subtitle: 'joshuahouseofworship.org',
      url: 'https://joshuahouseofworship.org/',
      icon: Globe,
      color: 'text-amber-400',
      badge: 'Main Sanctuary'
    },
    {
      title: 'YoungFire Discipleship Hub',
      subtitle: 'Youth & Young Adult Ministry',
      url: 'https://joshuahouseofworship.org/young-fire',
      icon: Flame,
      color: 'text-orange-400',
      badge: 'YoungFire',
      isInternalTab: false
    },
    {
      title: 'Watch Live Sermons (YouTube)',
      subtitle: '@JoshuaHouseOfWorshipSanAntonio',
      url: 'https://www.youtube.com/@JoshuaHouseOfWorshipSanAntonio',
      icon: Video,
      color: 'text-rose-400',
      badge: 'Live & Replays'
    },
    {
      title: 'Sanctuary Giving & Seed',
      subtitle: 'Tithes, Offerings & Missions Seed',
      url: 'https://joshuahouseofworship.org/give',
      icon: Heart,
      color: 'text-emerald-400',
      badge: 'Kingdom Seed'
    },
    {
      title: 'Directions to Sanctuary',
      subtitle: 'San Antonio, TX Coordinates',
      url: 'https://maps.google.com/?q=Joshua+House+of+Worship+San+Antonio+TX',
      icon: MapPin,
      color: 'text-cyan-400',
      badge: 'San Antonio'
    }
  ];

  return (
    <div ref={containerRef} className={`relative inline-block ${className}`}>
      {/* Athletic Pill Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/90 hover:bg-slate-800 border border-amber-500/40 text-amber-300 hover:text-white transition-all text-[10px] font-mono font-black tracking-wider uppercase shadow-md cursor-pointer group"
      >
        <Building2 className="w-3 h-3 text-amber-400 group-hover:scale-110 transition-transform" />
        <span>JOSHUA HOUSE OF WORSHIP</span>
        <ChevronDown className={`w-3 h-3 text-amber-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Obsidian Glassmorphism Popover Menu */}
      {isOpen && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-72 sm:w-80 bg-[#070D1E]/95 backdrop-blur-xl border border-amber-500/40 rounded-2xl p-2 shadow-[0_20px_50px_rgba(0,0,0,0.95)] z-[100] animate-fadeIn space-y-1">
          <div className="px-3 py-2 border-b border-white/10 flex items-center justify-between">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest font-bold">
              SANCTUARY MINISTRIES
            </span>
            <span className="text-[9px] font-mono text-amber-400 px-1.5 py-0.2 rounded bg-amber-500/10 border border-amber-500/30">
              San Antonio, TX
            </span>
          </div>

          <div className="space-y-1 pt-1">
            {links.map((item, idx) => {
              const Icon = item.icon;
              return (
                <a
                  key={idx}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-white/5 border border-transparent hover:border-white/10 transition-all group"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-slate-900 border border-white/10 flex items-center justify-center flex-shrink-0 group-hover:border-amber-400/50 transition-colors">
                      <Icon className={`w-4 h-4 ${item.color}`} />
                    </div>
                    <div className="truncate text-left">
                      <div className="text-xs font-bold text-white font-['Outfit'] truncate flex items-center gap-1.5">
                        <span>{item.title}</span>
                      </div>
                      <span className="text-[10px] font-mono text-slate-400 truncate block">
                        {item.subtitle}
                      </span>
                    </div>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-amber-400 flex-shrink-0 ml-1.5 transition-colors" />
                </a>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default JhowMinistryDropdown;
