import React, { useState, useEffect } from 'react';
import { 
  X, Video, Calendar, Clock, Download, ExternalLink, 
  Copy, Check, ShieldCheck, Flame, Bell, Sparkles, Users
} from 'lucide-react';
import { 
  BroadcastMeetingPayload, 
  getBroadcastMeeting, 
  getActiveFlyerUrl, 
  downloadCalendarIcs, 
  downloadFlyer 
} from '../data/broadcastMeetingData';

interface MinistryBroadcastModalProps {
  isOpen: boolean;
  onClose: () => void;
  meeting?: BroadcastMeetingPayload | null;
}

export const MinistryBroadcastModal: React.FC<MinistryBroadcastModalProps> = ({
  isOpen,
  onClose,
  meeting: propMeeting
}) => {
  const [meeting, setMeeting] = useState<BroadcastMeetingPayload>(() => propMeeting || getBroadcastMeeting());
  const [flyerUrl, setFlyerUrl] = useState<string>(() => meeting.flyerUrl || getActiveFlyerUrl());
  const [copiedField, setCopiedField] = useState<'id' | 'passcode' | 'link' | null>(null);

  // Countdown timer state
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    isPast: boolean;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0, isPast: false });

  // Sync state on prop changes or storage events
  useEffect(() => {
    if (propMeeting) {
      setMeeting(propMeeting);
      setFlyerUrl(propMeeting.flyerUrl || getActiveFlyerUrl());
    } else {
      const current = getBroadcastMeeting();
      setMeeting(current);
      setFlyerUrl(current.flyerUrl || getActiveFlyerUrl());
    }
  }, [propMeeting, isOpen]);

  // Listen for broadcast & flyer update events
  useEffect(() => {
    const handleMeetingUpdate = (e: Event) => {
      const customEv = e as CustomEvent<BroadcastMeetingPayload>;
      if (customEv.detail) {
        setMeeting(customEv.detail);
        if (customEv.detail.flyerUrl) {
          setFlyerUrl(customEv.detail.flyerUrl);
        }
      }
    };

    const handleFlyerUpdate = (e: Event) => {
      const customEv = e as CustomEvent<{ flyerUrl: string }>;
      if (customEv.detail?.flyerUrl) {
        setFlyerUrl(customEv.detail.flyerUrl);
      }
    };

    window.addEventListener('yf_broadcast_meeting_updated', handleMeetingUpdate);
    window.addEventListener('yf_active_flyer_updated', handleFlyerUpdate);

    return () => {
      window.removeEventListener('yf_broadcast_meeting_updated', handleMeetingUpdate);
      window.removeEventListener('yf_active_flyer_updated', handleFlyerUpdate);
    };
  }, []);

  // Compute countdown timer
  useEffect(() => {
    const calculateTime = () => {
      let targetDate: Date | null = null;
      if (meeting.isoDateTime) {
        const parsed = new Date(meeting.isoDateTime);
        if (!isNaN(parsed.getTime())) targetDate = parsed;
      }

      if (!targetDate && meeting.dateTime) {
        // Try parsing string date
        const cleaned = meeting.dateTime.replace('@', '').replace('CST', '').replace('CDT', '').trim();
        const parsed = new Date(cleaned);
        if (!isNaN(parsed.getTime())) targetDate = parsed;
      }

      // Default fallback if no parseable date: 24 hours from now
      if (!targetDate) {
        targetDate = new Date(Date.now() + 24 * 3600 * 1000);
      }

      const diff = targetDate.getTime() - Date.now();
      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true });
      } else {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / 1000 / 60) % 60);
        const seconds = Math.floor((diff / 1000) % 60);
        setTimeLeft({ days, hours, minutes, seconds, isPast: false });
      }
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [meeting]);

  if (!isOpen) return null;

  const handleCopy = (text: string, field: 'id' | 'passcode' | 'link') => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleLaunchZoom = () => {
    if (meeting.zoomUrl) {
      window.open(meeting.zoomUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div 
      className="fixed inset-0 z-[120] bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 select-none overflow-y-auto"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-4xl bg-[#090F24] border-2 border-amber-500/60 rounded-3xl p-5 sm:p-7 shadow-[0_0_50px_rgba(245,158,11,0.25)] space-y-6 text-white my-auto max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex items-start justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-500/30 border border-amber-300">
              <Flame className="w-5 h-5 text-slate-950 fill-current" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-mono font-bold uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  Official Ministry Broadcast
                </span>
                <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 text-[10px] font-mono font-bold uppercase tracking-wider flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  {meeting.targetAudience}
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-black font-['Outfit'] uppercase tracking-wide text-white mt-1">
                {meeting.title}
              </h2>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-2 rounded-full bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white transition-colors cursor-pointer"
            aria-label="Close Broadcast"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Status / Countdown Timer Bar */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-950/80 via-slate-900 to-indigo-950/80 border border-amber-500/30 shadow-inner flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={`w-3.5 h-3.5 rounded-full ${timeLeft.isPast ? 'bg-emerald-400 animate-ping' : 'bg-amber-400 animate-pulse'}`} />
            <div>
              <span className="text-[10px] font-mono text-amber-300 uppercase tracking-widest font-bold block">
                {timeLeft.isPast ? '🔥 GATHERING IS LIVE NOW' : '⏳ ASSEMBLY COUNTDOWN'}
              </span>
              <p className="text-xs sm:text-sm font-semibold text-slate-200">
                {meeting.dateTime}
              </p>
            </div>
          </div>

          {/* Countdown Clock Units */}
          {!timeLeft.isPast ? (
            <div className="flex items-center gap-2 text-center font-mono">
              <div className="px-2.5 py-1.5 rounded-xl bg-black/60 border border-amber-500/30 min-w-[50px]">
                <span className="text-base sm:text-lg font-black text-amber-400 block">{timeLeft.days}</span>
                <span className="text-[9px] text-slate-400 uppercase">Days</span>
              </div>
              <span className="text-amber-400 font-bold">:</span>
              <div className="px-2.5 py-1.5 rounded-xl bg-black/60 border border-amber-500/30 min-w-[50px]">
                <span className="text-base sm:text-lg font-black text-amber-400 block">{String(timeLeft.hours).padStart(2, '0')}</span>
                <span className="text-[9px] text-slate-400 uppercase">Hours</span>
              </div>
              <span className="text-amber-400 font-bold">:</span>
              <div className="px-2.5 py-1.5 rounded-xl bg-black/60 border border-amber-500/30 min-w-[50px]">
                <span className="text-base sm:text-lg font-black text-amber-400 block">{String(timeLeft.minutes).padStart(2, '0')}</span>
                <span className="text-[9px] text-slate-400 uppercase">Mins</span>
              </div>
              <span className="text-amber-400 font-bold">:</span>
              <div className="px-2.5 py-1.5 rounded-xl bg-black/60 border border-amber-500/30 min-w-[50px]">
                <span className="text-base sm:text-lg font-black text-amber-400 block">{String(timeLeft.seconds).padStart(2, '0')}</span>
                <span className="text-[9px] text-slate-400 uppercase">Secs</span>
              </div>
            </div>
          ) : (
            <div className="px-4 py-2 rounded-xl bg-emerald-500/20 border border-emerald-400 text-emerald-300 text-xs font-mono font-bold animate-pulse">
              Zoom Room Open &bull; Join Promptly
            </div>
          )}
        </div>

        {/* Main Content Grid: Flyer Showcase (Left) + Meeting Credentials & Actions (Right) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          {/* Official Flyer Preview Card */}
          <div className="md:col-span-7 flex flex-col items-center">
            <div className="w-full relative group rounded-2xl overflow-hidden border-2 border-amber-500/60 shadow-[0_0_35px_rgba(245,158,11,0.3)] bg-black/80 aspect-[3/4] flex items-center justify-center">
              <img 
                src={flyerUrl} 
                alt="YoungFire Ministry Zoom Assembly Flyer" 
                className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-[1.02]"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  // Fallback to default public flyer if custom fails
                  const img = e.currentTarget;
                  if (img.src !== window.location.origin + '/youngfire_zoom_flyer.png') {
                    img.src = '/youngfire_zoom_flyer.png';
                  }
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-4 pointer-events-none">
                <span className="text-xs font-mono font-bold text-amber-300">
                  YoungFire Official Flyer &bull; Full Resolution
                </span>
              </div>
            </div>

            {/* Quick Flyer Download Button */}
            <button
              onClick={() => downloadFlyer(flyerUrl, 'youngfire_zoom_assembly_flyer.png')}
              className="mt-3 w-full py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/15 border border-white/15 text-slate-200 hover:text-white text-xs font-mono font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              <Download className="w-4 h-4 text-amber-400" />
              <span>Download Official Flyer (HD Image)</span>
            </button>
          </div>

          {/* Meeting Credentials & Direct Launch Action Card */}
          <div className="md:col-span-5 space-y-4">
            {/* Credentials Card */}
            <div className="p-4 rounded-2xl bg-black/50 border border-white/10 space-y-3.5 shadow-lg">
              <h3 className="text-xs font-mono font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                <Video className="w-3.5 h-3.5 text-amber-400" />
                Zoom Assembly Credentials
              </h3>

              {/* Meeting ID */}
              <div>
                <label className="text-[10px] font-mono text-slate-400 uppercase block mb-1">
                  Meeting ID
                </label>
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#070C1C] border border-white/10 text-white font-mono text-sm font-bold">
                  <span>{meeting.meetingId}</span>
                  <button 
                    onClick={() => handleCopy(meeting.meetingId, 'id')}
                    className="p-1 hover:text-amber-400 transition-colors cursor-pointer"
                    title="Copy Meeting ID"
                  >
                    {copiedField === 'id' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-slate-400" />}
                  </button>
                </div>
              </div>

              {/* Passcode */}
              <div>
                <label className="text-[10px] font-mono text-slate-400 uppercase block mb-1">
                  Passcode
                </label>
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#070C1C] border border-white/10 text-amber-300 font-mono text-sm font-bold">
                  <span>{meeting.passcode}</span>
                  <button 
                    onClick={() => handleCopy(meeting.passcode, 'passcode')}
                    className="p-1 hover:text-amber-400 transition-colors cursor-pointer"
                    title="Copy Passcode"
                  >
                    {copiedField === 'passcode' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-slate-400" />}
                  </button>
                </div>
              </div>

              {/* Target Audience Notice */}
              <div className="p-2.5 rounded-xl bg-indigo-950/40 border border-indigo-500/30 text-[11px] text-slate-300 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                <span>Sanctuary Overseers: Lead Facilitator Trent D. White &amp; Lead Facilitator Whitney White</span>
              </div>
            </div>

            {/* Direct High-Contrast Action Buttons */}
            <div className="space-y-2.5 pt-2">
              {/* 1. Launch Zoom Button */}
              <button
                onClick={handleLaunchZoom}
                className="w-full py-4 px-5 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-black text-sm uppercase tracking-wider font-mono shadow-[0_0_25px_rgba(245,158,11,0.4)] flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.98]"
              >
                <Video className="w-5 h-5 text-slate-950" />
                <span>🔥 Join Ministry Zoom</span>
                <ExternalLink className="w-4 h-4 ml-1 text-slate-950" />
              </button>

              {/* 2. Add to Calendar Button */}
              <button
                onClick={() => downloadCalendarIcs(meeting)}
                className="w-full py-3.5 px-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 border border-indigo-400/50 text-white font-bold text-xs uppercase tracking-wider font-mono shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.98]"
              >
                <Calendar className="w-4 h-4 text-indigo-200" />
                <span>Add to Device Calendar (.ics)</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-slate-400 flex-wrap gap-2">
          <span>Joshua House of Worship &bull; YoungFire Ministry San Antonio, TX</span>
          <span>Ephesians 4:16 &bull; Rebuilding Better Together</span>
        </div>
      </div>
    </div>
  );
};
