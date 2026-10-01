import React, { useState } from 'react';
import { 
  Calendar, Clock, MapPin, Video, Download, ExternalLink, 
  Flame, Shield, Heart, ArrowRight, CheckCircle2, ChevronRight,
  Sparkles, Bell
} from 'lucide-react';

export interface SanctuaryScheduleViewProps {
  onOpenZoom?: () => void;
  onNavigate?: (tab: string) => void;
}

interface CalendarEvent {
  id: string;
  title: string;
  category: 'Small Group' | 'Open Bible' | 'Sunday Worship';
  day: string;
  dateStr: string;
  timeCST: string;
  location: string;
  zoomAvailable: boolean;
  description: string;
  color: string;
}

const SANCTUARY_SCHEDULE: CalendarEvent[] = [
  {
    id: 'monday_small_group',
    title: 'YoungFire Small Group Huddle',
    category: 'Small Group',
    day: 'Bi-Weekly Monday',
    dateStr: 'Monday, Oct 5, 2026',
    timeCST: '7:00 PM - 8:30 PM CST',
    location: 'Joshua House of Worship & Zoom Bridge',
    zoomAvailable: true,
    description: 'Living room fellowship, discipleship cohort huddles, and dinner with Lead Facilitators Trent D. White & Whitney White.',
    color: 'border-orange-500/50 bg-orange-500/10 text-orange-400'
  },
  {
    id: 'open_bible_thursday',
    title: 'Open Bible Thursdays',
    category: 'Open Bible',
    day: 'Weekly Thursday',
    dateStr: 'Thursday, Oct 8, 2026',
    timeCST: 'All Day (No Set Time)',
    location: 'Sanctuary Main Hall & Zoom Bridge',
    zoomAvailable: true,
    description: 'All day open scripture encounter and spontaneous expository study across all 66 books. Open all day with no set time. Iron sharpens iron.',
    color: 'border-amber-500/50 bg-amber-500/10 text-amber-400'
  },
  {
    id: 'sunday_worship',
    title: 'Sunday Morning Corporate Worship',
    category: 'Sunday Worship',
    day: 'Weekly Sunday',
    dateStr: 'Sunday, Oct 11, 2026',
    timeCST: '11:00 AM CST',
    location: 'Joshua House of Worship (San Antonio, TX)',
    zoomAvailable: true,
    description: 'Corporate worship, anointed proclamation of the Word, and congregational altar call.',
    color: 'border-purple-500/50 bg-purple-500/10 text-purple-400'
  }
];

export const SanctuaryScheduleView: React.FC<SanctuaryScheduleViewProps> = ({
  onOpenZoom,
  onNavigate
}) => {
  const [filter, setFilter] = useState<string>('all');

  const filteredEvents = filter === 'all'
    ? SANCTUARY_SCHEDULE
    : SANCTUARY_SCHEDULE.filter(e => e.category === filter);

  // 1-Tap Google Calendar direct link
  const handleOpenGoogleCal = (event: CalendarEvent) => {
    const gCalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&details=${encodeURIComponent(event.description)}&location=${encodeURIComponent(event.location)}`;
    window.open(gCalUrl, '_blank', 'noopener,noreferrer');
  };

  // 1-Tap .ics generation
  const handleDownloadICS = (event: CalendarEvent) => {
    const icsData = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//YoungFire Ministry//Sanctuary Fellowship//EN',
      'BEGIN:VEVENT',
      `SUMMARY:${event.title}`,
      `DESCRIPTION:${event.description}`,
      `LOCATION:${event.location}`,
      'DTSTART:20261005T190000',
      'DTEND:20261005T203000',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${event.id}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-[#040711] text-white pb-36 select-none max-w-4xl mx-auto px-3 sm:px-6 pt-4 space-y-6">
      
      {/* Header Banner */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-500/30 border border-amber-300/40">
            <Calendar className="w-5 h-5 text-slate-950" />
          </div>
          <div>
            <span className="text-[10px] font-mono tracking-widest uppercase text-amber-400 font-bold block">
              FELLOWSHIP GATHERINGS
            </span>
            <h1 className="text-lg sm:text-2xl font-black uppercase font-['Outfit'] tracking-wide text-white">
              SANCTUARY <span className="text-amber-400">CALENDAR</span>
            </h1>
          </div>
        </div>

        <button
          onClick={() => {
            if (onOpenZoom) onOpenZoom();
            else window.dispatchEvent(new CustomEvent('yf_open_zoom'));
          }}
          className="px-3 py-1.5 rounded-xl bg-blue-500/20 hover:bg-blue-500/30 border border-blue-400/40 text-blue-300 text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-md"
        >
          <Video className="w-3.5 h-3.5 text-blue-400" />
          <span>Zoom Bridge</span>
        </button>
      </div>

      {/* Next Imminent Gathering Spotlight Card */}
      <div className="bg-[#080E21] border-2 border-amber-500/60 rounded-3xl p-5 sm:p-6 shadow-2xl relative overflow-hidden space-y-3">
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400 text-amber-300 text-xs font-mono font-bold">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Next Immediate Gathering</span>
          </div>
          <span className="text-xs font-mono font-bold text-orange-400">
            Bi-Weekly Mondays
          </span>
        </div>

        <h2 className="text-xl sm:text-2xl font-black uppercase font-['Outfit'] text-white">
          YoungFire Small Group Huddle
        </h2>

        <p className="text-xs sm:text-sm text-slate-300 font-serif leading-relaxed max-w-2xl">
          Living room fellowship, discipleship cohort huddles, and dinner with Lead Facilitators Trent D. White &amp; Whitney White.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono pt-1 text-slate-300">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-400" />
            <span>Monday, Oct 5 @ 7:00 PM CST</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-amber-400" />
            <span>Joshua House of Worship &amp; Zoom</span>
          </div>
        </div>

        <div className="pt-2 flex items-center gap-2 flex-wrap">
          <button
            onClick={() => handleOpenGoogleCal(SANCTUARY_SCHEDULE[0])}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer shadow-md"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Add to Google Cal</span>
          </button>
          <button
            onClick={() => handleDownloadICS(SANCTUARY_SCHEDULE[0])}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-white/20 text-white font-bold text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-amber-400" />
            <span>Apple / iCal (.ics)</span>
          </button>
        </div>
      </div>

      {/* Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        {[
          { id: 'all', label: 'All Gatherings' },
          { id: 'Small Group', label: 'Small Groups' },
          { id: 'Open Bible', label: 'Open Bible' },
          { id: 'Sunday Worship', label: 'Sunday Worship' }
        ].map((chip) => (
          <button
            key={chip.id}
            onClick={() => setFilter(chip.id)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold whitespace-nowrap cursor-pointer transition-all ${
              filter === chip.id
                ? 'bg-amber-500/20 text-amber-300 border border-amber-400'
                : 'bg-[#080E21] text-slate-400 border border-white/10 hover:text-white'
            }`}
          >
            {chip.label}
          </button>
        ))}
      </div>

      {/* Full Schedule List */}
      <div className="space-y-3">
        {filteredEvents.map((evt) => (
          <div
            key={evt.id}
            className="p-4 sm:p-5 rounded-3xl bg-[#080E21]/95 backdrop-blur-xl border border-white/20 hover:border-amber-500/50 shadow-2xl space-y-2.5 transition-all"
          >
            <div className="flex items-center justify-between">
              <span className={`px-2.5 py-0.5 rounded-full border text-[10px] font-mono font-bold ${evt.color}`}>
                {evt.day}
              </span>
              <span className="text-xs font-mono font-bold text-slate-300">
                {evt.timeCST}
              </span>
            </div>

            <div>
              <h3 className="text-base font-black uppercase text-white font-['Outfit']">
                {evt.title}
              </h3>
              <p className="text-xs text-slate-300 font-serif leading-relaxed mt-1">
                {evt.description}
              </p>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-white/5 text-xs font-mono">
              <div className="flex items-center gap-1.5 text-slate-400 truncate mr-2">
                <MapPin className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                <span className="truncate">{evt.location}</span>
              </div>

              <div className="flex items-center gap-1.5 flex-shrink-0">
                <button
                  onClick={() => handleOpenGoogleCal(evt)}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-cyan-400 cursor-pointer"
                  title="Google Calendar"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDownloadICS(evt)}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-amber-400 cursor-pointer"
                  title="Download .ics"
                >
                  <Download className="w-3.5 h-3.5" />
                </button>
                {evt.zoomAvailable && (
                  <button
                    onClick={() => {
                      if (onOpenZoom) onOpenZoom();
                      else window.dispatchEvent(new CustomEvent('yf_open_zoom'));
                    }}
                    className="p-1.5 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 cursor-pointer"
                    title="Zoom Bridge"
                  >
                    <Video className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Cohorts Notice for Men On Fire & Women Ignited */}
      <div className="p-4 rounded-2xl bg-[#080E21]/80 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div>
          <span className="font-mono text-amber-400 font-bold uppercase tracking-wider block mb-0.5">
            🛡️ MEN ON FIRE &amp; 👑 WOMEN IGNITED COHORTS
          </span>
          <p className="text-slate-300 font-mono text-[11px]">
            Men On Fire and Women Ignited operate through dedicated consecrated Fellowship Hubs.
          </p>
        </div>
        <button
          onClick={() => {
            if (onNavigate) onNavigate('fellowship');
          }}
          className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/40 text-amber-300 font-mono font-bold text-xs whitespace-nowrap cursor-pointer transition-colors self-start sm:self-auto"
        >
          Open Fellowship Hubs &rarr;
        </button>
      </div>

    </div>
  );
};
