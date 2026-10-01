import React, { useState } from 'react';
import { useFanDeckPhotos } from '../data/appCoverAssets';
import { AppTheme } from '../data/appThemes';
import { AppStyleSwitcher } from './AppStyleSwitcher';
import { RotatingUCollageFanDeck } from './RotatingUCollageFanDeck';
import { 
  Flame, ArrowRight, Radio, ChevronDown, Download, ExternalLink, Calendar
} from 'lucide-react';

interface SpursSanctuaryHeroProps {
  onNavigate: (dest: string) => void;
  onOpenSettings: () => void;
  isRadioPlaying: boolean;
  onToggleRadio: () => void;
  onOpenRoster?: () => void;
  onOpenZoom?: () => void;
  onToggleRadioDock?: () => void;
  onToggleMusicDock?: () => void;
  onOpenWelcome?: () => void;
  onOpenThemeModal?: () => void;
  activeTheme?: AppTheme;
}

// Fellowship Gathering items for YoungFire Discipleship
interface SanctuaryGathering {
  id: string;
  title: string;
  category: string;
  emblem: string;
  dateStr: string;
  fullDate: string;
  timeStr: string;
  timeCST: string;
  location: string;
  shortLabel: string;
  badgeColor: string;
  zoomAvailable: boolean;
}

const UPCOMING_GATHERINGS: SanctuaryGathering[] = [
  { 
    id: 'monday_small_group', 
    title: 'YOUNGFIRE SMALL GROUP HUDDLE',
    category: 'Small Group Discipleship',
    emblem: '🔥', 
    dateStr: 'OCT 5',
    fullDate: 'Monday, Oct 5',
    timeStr: '7:00 pm',
    timeCST: '7:00 PM - 8:30 PM CST',
    location: 'Joshua House of Worship • San Antonio, TX',
    shortLabel: 'SMALL GROUP',
    badgeColor: 'from-amber-600 to-orange-600 border-amber-400',
    zoomAvailable: true
  },
  { 
    id: 'open_bible_thursday', 
    title: 'OPEN BIBLE THURSDAYS',
    category: 'All-Day Expository Study & Altar',
    emblem: '📖', 
    dateStr: 'OCT 8',
    fullDate: 'Thursday, Oct 8',
    timeStr: 'All Day',
    timeCST: 'All Day (No Set Time)',
    location: 'Sanctuary Main Hall • San Antonio, TX',
    shortLabel: 'OPEN BIBLE',
    badgeColor: 'from-blue-600 to-indigo-600 border-cyan-400',
    zoomAvailable: true
  },
  { 
    id: 'sunday_worship', 
    title: 'SUNDAY CORPORATE WORSHIP',
    category: 'Congregational Worship & Word',
    emblem: '🕊️', 
    dateStr: 'OCT 11',
    fullDate: 'Sunday, Oct 11',
    timeStr: '11:00 am',
    timeCST: '11:00 AM CST',
    location: 'Joshua House of Worship • San Antonio, TX',
    shortLabel: 'SUNDAY WORSHIP',
    badgeColor: 'from-purple-600 to-violet-600 border-purple-400',
    zoomAvailable: true
  }
];

export const SpursSanctuaryHero: React.FC<SpursSanctuaryHeroProps> = ({
  onNavigate,
  onOpenSettings,
  isRadioPlaying,
  onToggleRadio,
  onOpenZoom,
  onToggleRadioDock,
  onToggleMusicDock,
  onOpenThemeModal,
  activeTheme
}) => {
  const [selectedGatheringId, setSelectedGatheringId] = useState<string>('monday_small_group');
  const [fanDeckPhotos] = useFanDeckPhotos();
  const photos = fanDeckPhotos && fanDeckPhotos.length > 0 
    ? fanDeckPhotos 
    : ['/image_4.png', '/image_6.png', '/image_5.png', '/image_7.png', '/image_8.png'];

  const currentGathering = UPCOMING_GATHERINGS.find(g => g.id === selectedGatheringId) || UPCOMING_GATHERINGS[0];

  // 1-Tap Calendar Subscription (.ics generation for selected gathering)
  const handleDownloadICS = (e: React.MouseEvent) => {
    e.stopPropagation();
    const isAllDay = currentGathering.id === 'open_bible_thursday';
    const dtStart = isAllDay ? 'DTSTART;VALUE=DATE:20261008' : (currentGathering.id === 'sunday_worship' ? 'DTSTART:20261011T110000' : 'DTSTART:20261005T190000');
    const dtEnd = isAllDay ? 'DTEND;VALUE=DATE:20261009' : (currentGathering.id === 'sunday_worship' ? 'DTEND:20261011T130000' : 'DTEND:20261005T203000');

    const icsData = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//YoungFire Ministry//Sanctuary Gathering//EN',
      'BEGIN:VEVENT',
      `SUMMARY:${currentGathering.title}`,
      `DESCRIPTION:${currentGathering.category}. ${currentGathering.timeCST}. YoungFire Sanctuary Fellowship.`,
      `LOCATION:${currentGathering.location}`,
      dtStart,
      dtEnd,
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${currentGathering.id}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Google Calendar direct 1-tap link
  const handleOpenGoogleCalendar = (e: React.MouseEvent) => {
    e.stopPropagation();
    const isAllDay = currentGathering.id === 'open_bible_thursday';
    const dates = isAllDay ? '20261008/20261009' : (currentGathering.id === 'sunday_worship' ? '20261011T110000/20261011T130000' : '20261005T190000/20261005T203000');
    const gCalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(currentGathering.title)}&dates=${dates}&details=${encodeURIComponent(currentGathering.category + ' • ' + currentGathering.timeCST)}&location=${encodeURIComponent(currentGathering.location)}`;
    window.open(gCalUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="min-h-screen bg-transparent text-white pb-32 select-none max-w-lg mx-auto relative">
      
      {/* 1. TOP SPURS-STYLE HEADER BAR (Clean, Centered Logo with Dropdown Chevron & Pill RADIO Button) */}
      <div className="relative z-10 px-4 pt-3 pb-2 flex items-center justify-between">
        
        {/* Left Spacer to keep logo perfectly centered */}
        <div className="w-16 flex items-center">
          <button
            onClick={onOpenSettings}
            className="text-[10px] font-mono text-slate-400 hover:text-white uppercase tracking-wider transition-colors cursor-pointer"
            title="Sanctuary Settings & Voice"
          >
            ⚙️
          </button>
        </div>

        {/* Center: YoungFire / Spurs Consecrated Emblem with Dropdown Chevron */}
        <div 
          onClick={onOpenThemeModal || onOpenSettings}
          className="flex flex-col items-center justify-center cursor-pointer group"
          title="San Antonio YoungFire Sanctuary"
        >
          <div className="flex items-center gap-1.5">
            <h1 className="font-pro-display text-lg sm:text-xl tracking-[0.18em] text-white flex items-center gap-1 group-hover:text-amber-300 transition-colors">
              <span>YOUNGFIRE</span>
            </h1>
            <ChevronDown className="w-4 h-4 text-slate-400 group-hover:translate-y-0.5 group-hover:text-amber-400 transition-all" />
          </div>
          
          {/* Subtitle brand matching "Frost" in reference */}
          <div className="flex items-center gap-1 text-[11px] font-mono tracking-widest text-slate-400 uppercase">
            <span>Joshua House</span>
          </div>
        </div>

        {/* Right: Pill RADIO button (1:1 with reference screenshot top-right [ RADIO ]) */}
        <div className="w-16 flex justify-end">
          <button
            onClick={() => {
              if (onToggleRadioDock) onToggleRadioDock();
              else onToggleRadio();
            }}
            className={`px-3 py-1 rounded-full text-[11px] font-pro-mono font-bold tracking-widest transition-all cursor-pointer border flex items-center gap-1.5 ${
              isRadioPlaying
                ? 'bg-amber-500/25 border-amber-400 text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.4)] animate-pulse'
                : 'bg-black/60 border-white/35 text-slate-200 hover:border-white hover:text-white'
            }`}
            title="24/7 Gospel Radio Live"
            aria-label="Toggle 24/7 Gospel Radio"
          >
            <Radio className={`w-3 h-3 ${isRadioPlaying ? 'text-amber-400' : 'text-slate-400'}`} />
            <span>RADIO</span>
          </button>
        </div>
      </div>

      {/* 2. "SWITCH YOUR APP STYLE" BANNER */}
      <div className="relative z-10 px-4 pt-1 pb-2">
        <AppStyleSwitcher 
          onOpenThemeModal={onOpenThemeModal || onOpenSettings} 
          activeTheme={activeTheme} 
        />
      </div>

      {/* 3. MINI HORIZONTAL GATHERINGS & COHORTS ROW */}
      <div className="relative z-10 w-full px-3 py-2 overflow-x-auto no-scrollbar flex items-center gap-2">
        {UPCOMING_GATHERINGS.map((gathering) => {
          const isSelected = gathering.id === selectedGatheringId;
          return (
            <button
              key={gathering.id}
              onClick={() => setSelectedGatheringId(gathering.id)}
              className={`flex-shrink-0 flex items-center gap-2 px-3 py-1.5 rounded-full transition-all cursor-pointer border text-left ${
                isSelected 
                  ? 'bg-amber-500/25 border-amber-400 text-white shadow-[0_0_12px_rgba(245,158,11,0.3)] ring-1 ring-amber-400/50' 
                  : 'bg-black/60 border-white/20 text-slate-300 hover:border-white/40 hover:text-white'
              }`}
              title={gathering.title}
            >
              <span className="text-xs">{gathering.emblem}</span>
              <span className="font-pro-mono text-[10px] tracking-wider text-amber-300 font-bold">{gathering.dateStr}</span>
              <span className="font-pro-display text-[11px] tracking-wider text-white uppercase font-semibold">{gathering.shortLabel}</span>
            </button>
          );
        })}
      </div>

      {/* 4. U-SHAPED ROTATING COLLAGE FAN DECK (Clock formation every 2s, smaller photos) */}
      <div className="relative z-10 -my-2">
        <RotatingUCollageFanDeck 
          photos={photos} 
          autoRotateIntervalMs={2000}
        />
      </div>

      {/* 5. FRAMELESS, FLOATING FELLOWSHIP GATHERING ANNOUNCEMENT */}
      {/* Sits completely open, borderless & frameless directly on top of the black-and-white street grid */}
      <div className="w-full pt-2 pb-6 px-4 flex flex-col items-center justify-center text-center select-none relative z-10">
        
        {/* Line 1 (Top): Date in crisp .font-pro-mono text-xs tracking-[0.2em] text-slate-300 */}
        <span className="font-pro-mono text-xs tracking-[0.2em] text-slate-300 mb-1 drop-shadow uppercase">
          {currentGathering.fullDate}
        </span>

        {/* Line 2: Gathering Title in .font-pro-display text-sm sm:text-base tracking-wider text-white */}
        <h3 className="font-pro-display text-sm sm:text-base tracking-wider text-white mb-3 drop-shadow-md">
          {currentGathering.title}
        </h3>

        {/* Line 3 (Centered Row): Sanctuary Crest, Large Gathering Time, YoungFire Flame */}
        <div className="w-full max-w-sm mx-auto flex items-center justify-between px-3 sm:px-6">
          
          {/* Left: Joshua House Sanctuary seal + SANCTUARY label beneath */}
          <div className="flex flex-col items-center">
            <div 
              onClick={() => onNavigate('team')}
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-slate-800 via-slate-900 to-black border-2 border-slate-300/70 flex items-center justify-center shadow-2xl ring-2 ring-white/10 hover:border-white transition-all cursor-pointer group"
              title="Joshua House Sanctuary"
            >
              <span className="font-pro-display text-sm sm:text-base tracking-wider text-white group-hover:scale-110 transition-transform">
                JHOW
              </span>
            </div>
            {/* Sanctuary label beneath */}
            <span className="font-pro-mono text-[10px] tracking-wider text-slate-400 mt-1.5 uppercase font-medium">
              SANCTUARY
            </span>
          </div>

          {/* Center: Large gathering time e.g. 7:00 pm in .font-pro-display text-3xl sm:text-4xl text-white tracking-normal */}
          <div className="flex flex-col items-center px-2">
            <div className="font-pro-display text-3xl sm:text-4xl text-white tracking-normal drop-shadow-lg leading-none">
              {currentGathering.timeStr}
            </div>
            {/* Line 4: Venue location in .font-pro-mono text-[10px] text-slate-400 mt-1 */}
            <p className="font-pro-mono text-[10px] text-slate-400 mt-1 max-w-[200px] leading-tight text-center">
              {currentGathering.location}
            </p>
            {/* Line 5: Preview button in .font-pro-display text-xs tracking-[0.25em] text-white underline underline-offset-4 hover:text-amber-400 */}
            <button
              onClick={() => {
                if (currentGathering.zoomAvailable) {
                  if (onOpenZoom) onOpenZoom();
                  else window.dispatchEvent(new CustomEvent('yf_open_zoom'));
                } else {
                  onNavigate('schedule');
                }
              }}
              className="mt-2.5 font-pro-display text-xs tracking-[0.25em] text-white underline underline-offset-4 hover:text-amber-400 transition-colors cursor-pointer py-1 px-2"
              title="Preview Gathering Agenda & Details"
            >
              PREVIEW
            </button>
          </div>

          {/* Right: YoungFire Flame seal + FELLOWSHIP label beneath */}
          <div className="flex flex-col items-center">
            <div 
              onClick={() => onNavigate('team')}
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-slate-800 via-slate-900 to-black border-2 border-amber-400/80 flex items-center justify-center shadow-2xl ring-2 ring-amber-500/20 hover:border-amber-400 transition-all cursor-pointer group"
              title="YoungFire Discipleship"
            >
              <Flame className="w-7 h-7 sm:w-8 sm:h-8 text-amber-400 fill-amber-500/30 group-hover:scale-110 transition-transform" />
            </div>
            {/* Fellowship label beneath */}
            <span className="font-pro-mono text-[10px] tracking-wider text-amber-400/90 mt-1.5 uppercase font-medium">
              FELLOWSHIP
            </span>
          </div>
        </div>

        {/* 1-Tap Calendar Reminder actions */}
        <div className="flex items-center justify-center gap-3 mt-3 pt-1 text-[10px] font-pro-mono text-slate-400">
          <button
            onClick={handleOpenGoogleCalendar}
            className="hover:text-cyan-300 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <ExternalLink className="w-3 h-3 text-cyan-400" />
            <span>Google Cal</span>
          </button>
          <span className="text-white/20">&bull;</span>
          <button
            onClick={handleDownloadICS}
            className="hover:text-amber-300 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <Download className="w-3 h-3 text-amber-400" />
            <span>Apple/iCal (.ics)</span>
          </button>
        </div>
      </div>

      {/* 6. DUAL ACTION TILES (1:1 with MANAGE YOUR TICKETS / GET YOUR TICKETS in reference screenshot) */}
      <div className="px-4 space-y-4 relative z-10">
        <div className="grid grid-cols-2 gap-3">
          
          {/* Tile 1: MY DISCIPLESHIP • TRACK SWORD */}
          <button
            onClick={() => onNavigate('bibletracker')}
            className="p-4 rounded-2xl bg-[#080E1F]/95 backdrop-blur-xl border border-white/20 hover:border-amber-400/60 transition-all group flex items-center justify-between text-left shadow-2xl shadow-black/90 hover:shadow-amber-500/10 cursor-pointer active:scale-98"
            title="My Discipleship • Track Sword"
          >
            <div className="flex flex-col gap-1 pr-2">
              <span className="font-pro-display text-base sm:text-lg leading-tight text-white group-hover:text-amber-300 transition-colors">
                MY DISCIPLESHIP
              </span>
              <span className="font-pro-display text-xs sm:text-sm leading-tight text-slate-400 group-hover:text-slate-300 transition-colors">
                TRACK SWORD
              </span>
            </div>
            <div className="w-8 h-8 rounded-full bg-white/10 group-hover:bg-amber-400 group-hover:text-black border border-white/20 flex items-center justify-center text-white transition-all flex-shrink-0">
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </button>

          {/* Tile 2: PRAYER DOCK • ENTER INTERCESSION */}
          <button
            onClick={() => onNavigate('prayer_dock')}
            className="p-4 rounded-2xl bg-[#080E1F]/95 backdrop-blur-xl border border-white/20 hover:border-orange-400/60 transition-all group flex items-center justify-between text-left shadow-2xl shadow-black/90 hover:shadow-orange-500/10 cursor-pointer active:scale-98"
            title="Prayer Dock • Enter Intercession"
          >
            <div className="flex flex-col gap-1 pr-2">
              <span className="font-pro-display text-base sm:text-lg leading-tight text-white group-hover:text-orange-300 transition-colors">
                PRAYER DOCK
              </span>
              <span className="font-pro-display text-xs sm:text-sm leading-tight text-slate-400 group-hover:text-slate-300 transition-colors">
                ENTER INTERCESSION
              </span>
            </div>
            <div className="w-8 h-8 rounded-full bg-white/10 group-hover:bg-orange-400 group-hover:text-black border border-white/20 flex items-center justify-center text-white transition-all flex-shrink-0">
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </button>
        </div>
      </div>

    </div>
  );
};

export default SpursSanctuaryHero;
