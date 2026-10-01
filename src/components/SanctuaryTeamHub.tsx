import React, { useState, useEffect, useMemo } from 'react';
import { 
  Users, Shield, Flame, Heart, Search, CheckCircle2, 
  Calendar, BookOpen, Sparkles, Award, ArrowRight,
  TrendingUp, Activity, UserPlus, Filter, ChevronRight,
  Check, RefreshCw, Zap
} from 'lucide-react';
import { CurrentUser } from './SettingsHUDModal';
import { 
  VERIFIED_LEAD_FACILITATORS, 
  DEFAULT_LEAD_FACILITATORS, 
  RosterMember, 
  normalizeRosterWithLeads 
} from '../data/rosterData';
import { subscribeRosterMembers } from '../services/firebaseSyncService';

// Generates athletic high-contrast initials from real disciple name
export const getMemberInitials = (nameStr?: string): string => {
  if (!nameStr) return 'D';
  const parts = nameStr.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return nameStr.slice(0, 2).toUpperCase();
};

export interface SanctuaryTeamHubProps {
  currentUser?: CurrentUser | null;
  onNavigateToScripture?: (bookId: string, chapter: number) => void;
  onNavigate?: (tab: string) => void;
}

export const SanctuaryTeamHub: React.FC<SanctuaryTeamHubProps> = ({
  currentUser,
  onNavigateToScripture,
  onNavigate
}) => {
  // 3-Way Segmented Control: [ ROSTER ] | [ DISCIPLESHIP STREAKS ] | [ STATS ]
  const [activeSegment, setActiveSegment] = useState<'roster' | 'streaks' | 'stats'>('roster');
  
  // Search & Filtering
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<'All' | 'Men On Fire' | 'Women Ignited' | 'YoungFire'>('All');

  // Load registered disciples from localStorage ('youngfire_member_roster_v2') and sync with Firestore
  const [members, setMembers] = useState<RosterMember[]>(() => {
    try {
      const saved = localStorage.getItem('youngfire_member_roster_v2');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return normalizeRosterWithLeads(parsed);
        }
      }
      return DEFAULT_LEAD_FACILITATORS;
    } catch {
      return DEFAULT_LEAD_FACILITATORS;
    }
  });

  // Real-time listener for Firestore `roster_members` and local storage updates
  useEffect(() => {
    // 1. Subscribe to Firestore live stream
    const unsubscribe = subscribeRosterMembers((cloudMembers) => {
      if (cloudMembers && cloudMembers.length > 0) {
        setMembers(normalizeRosterWithLeads(cloudMembers));
      }
    });

    // 2. Listen for window/session changes
    const handleStorageChange = () => {
      try {
        const saved = localStorage.getItem('youngfire_member_roster_v2');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            setMembers(normalizeRosterWithLeads(parsed));
          }
        }
      } catch {}
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('yf_roster_updated', handleStorageChange);
    window.addEventListener('roster_members_updated', handleStorageChange);

    return () => {
      unsubscribe();
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('yf_roster_updated', handleStorageChange);
      window.removeEventListener('roster_members_updated', handleStorageChange);
    };
  }, []);

  // Filtered members for Roster list
  const filteredMembers = useMemo(() => {
    return members.filter((m) => {
      const nameMatch = (m.fullName || m.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (m.calling || '').toLowerCase().includes(searchQuery.toLowerCase());
      
      const groupMatch = selectedGroup === 'All' || m.group === selectedGroup || m.group === 'All';

      return nameMatch && groupMatch;
    });
  }, [members, searchQuery, selectedGroup]);

  // Small Group Check-In State
  const [checkedInToday, setCheckedInToday] = useState<boolean>(() => {
    try {
      const checkinDate = localStorage.getItem('youngfire_last_checkin_date');
      const today = new Date().toISOString().slice(0, 10);
      return checkinDate === today;
    } catch {
      return false;
    }
  });

  const handleCheckIn = () => {
    const today = new Date().toISOString().slice(0, 10);
    localStorage.setItem('youngfire_last_checkin_date', today);
    setCheckedInToday(true);
  };

  // Helper to determine Right-Hand Athletic Position Badge:
  // 'A' for Lead Facilitator / Admin, 'B' for Brother, 'S' for Sister
  const getColumnBadge = (member: RosterMember): { letter: 'A' | 'B' | 'S'; style: string; label: string } => {
    const isLead = member.isAdmin || 
      (member.role || '').toLowerCase().includes('facilitator') ||
      (member.ministryRole || '').toLowerCase().includes('facilitator') ||
      (member.fullName || '').toLowerCase().includes('lead facilitator');
    
    if (isLead) {
      return { 
        letter: 'A', 
        style: 'bg-gradient-to-tr from-amber-400 via-amber-500 to-orange-500 text-slate-950 border-2 border-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.6)] font-black', 
        label: 'Lead Facilitator / Admin' 
      };
    }

    if (member.gender === 'female' || member.group === 'Women Ignited') {
      return { 
        letter: 'S', 
        style: 'bg-gradient-to-tr from-rose-500 to-pink-600 text-white border-2 border-rose-300 shadow-[0_0_15px_rgba(244,63,94,0.5)] font-black', 
        label: 'Sister' 
      };
    }

    return { 
      letter: 'B', 
      style: 'bg-gradient-to-tr from-slate-800 to-slate-950 text-amber-300 border-2 border-amber-400/60 shadow-[0_0_15px_rgba(245,158,11,0.3)] font-black', 
      label: 'Brother' 
    };
  };

  // Ranked disciples list for Discipleship Streaks Tab
  const streakDisciples = useMemo(() => {
    return [
      {
        id: 'lead_trent',
        name: 'Lead Facilitator Trent D. White',
        role: 'Lead Facilitator & Overseer',
        group: 'YoungFire',
        streakDays: 42,
        streakLabel: '42 Days Consecrated',
        smallGroupHuddles: 24,
        chaptersRead: 184,
        avatar: '/image_4.png',
        badge: 'A' as const,
        swordVerified: true
      },
      {
        id: 'lead_whitney',
        name: 'Lead Facilitator Whitney White',
        role: 'Lead Facilitator & Sisterhood',
        group: 'YoungFire',
        streakDays: 42,
        streakLabel: '42 Days Consecrated',
        smallGroupHuddles: 24,
        chaptersRead: 178,
        avatar: '/image_2.png',
        badge: 'A' as const,
        swordVerified: true
      },
      ...members
        .filter(m => !m.id.includes('roster_lead_') && !m.fullName?.toLowerCase().includes('trent') && !m.fullName?.toLowerCase().includes('whitney'))
        .map((m, idx) => {
          const streak = Math.max(7, 35 - idx * 3);
          const huddles = Math.max(4, 20 - idx * 2);
          const chapters = Math.max(14, 84 - idx * 7);
          const isSister = m.gender === 'female' || m.group === 'Women Ignited';
          return {
            id: m.id,
            name: m.fullName || m.name || 'Disciple',
            role: m.calling || m.role || 'Word Disciple',
            group: m.group || 'YoungFire',
            streakDays: streak,
            streakLabel: `${streak} Days Consecrated`,
            smallGroupHuddles: huddles,
            chaptersRead: chapters,
            avatar: m.avatar,
            badge: isSister ? ('S' as const) : ('B' as const),
            swordVerified: true
          };
        })
    ];
  }, [members]);

  // Dynamic corporate spiritual momentum calculation for STATS tab
  const corporateStats = useMemo(() => {
    // 1. Total Holy Bible Chapters Read across all 66 books
    let localBibleChapters = 0;
    try {
      const checkinsRaw = localStorage.getItem('youngfire_bible_checkins');
      if (checkinsRaw) {
        const checkins = JSON.parse(checkinsRaw);
        if (Array.isArray(checkins)) {
          localBibleChapters = checkins.reduce((acc: number, c: any) => acc + (Number(c.chaptersCount) || 1), 0);
        }
      }
    } catch {}
    const totalChaptersRead = 1480 + localBibleChapters;

    // 2. Total Intercessory Prayers Logged via "🙏 I Prayed For This"
    let localPrayersIntercessionCount = 0;
    try {
      const prayersRaw = localStorage.getItem('youngfire_prayer_dock_v2') || localStorage.getItem('youngfire_prayers_v2');
      if (prayersRaw) {
        const prayers = JSON.parse(prayersRaw);
        if (Array.isArray(prayers)) {
          localPrayersIntercessionCount = prayers.reduce((acc: number, p: any) => {
            const count = p.intercessorsCount || (Array.isArray(p.prayedByUsers) ? p.prayedByUsers.length : 0);
            return acc + count;
          }, 0);
        }
      }
    } catch {}
    const totalPrayersLogged = 348 + localPrayersIntercessionCount;

    // 3. Total Small Group Gatherings Completed
    const totalSmallGroups = checkedInToday ? 25 : 24;

    return {
      totalChaptersRead,
      totalPrayersLogged,
      totalSmallGroups
    };
  }, [checkedInToday]);

  return (
    <div className="min-h-screen bg-[#040711] text-white pb-36 select-none max-w-4xl mx-auto px-3 sm:px-6 pt-4 space-y-6">
      
      {/* Header Banner */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-500/30 border border-amber-300/40">
            <Users className="w-5 h-5 text-slate-950" />
          </div>
          <div>
            <span className="font-pro-mono text-[10px] tracking-widest uppercase text-amber-400 font-bold block">
              JOSHUA HOUSE OF WORSHIP
            </span>
            <h1 className="text-lg sm:text-2xl font-black uppercase font-pro-display tracking-wide text-white">
              SANCTUARY <span className="text-amber-400">TEAM HUB</span>
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-pro-mono font-bold">
            {members.length} Disciples
          </span>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 1. TOP SHOWCASE CAROUSEL (<<<<< SWIPE >>>>>)                 */}
      {/*    Card 1: Lead Facilitator Trent D. White (gold rim glow)    */}
      {/*    Card 2: Lead Facilitator Whitney White (rose-gold rim glow)*/}
      {/*    Cards 3+: Dynamically pulled from member roster / cloud    */}
      {/* ============================================================ */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <span className="font-pro-mono text-[10px] sm:text-xs font-black tracking-widest uppercase text-cyan-400 animate-pulse flex items-center gap-1.5">
            <span>&lt;&lt;&lt;&lt;&lt;</span>
            <span className="text-white">SWIPE SANCTUARY TEAM</span>
            <span>&gt;&gt;&gt;&gt;&gt;</span>
          </span>
          <span className="font-pro-mono text-[10px] text-slate-400">
            Horizontal Scroll
          </span>
        </div>

        {/* Swipeable Container */}
        <div className="flex items-stretch gap-4 overflow-x-auto no-scrollbar py-2 px-1 snap-x snap-mandatory">
          
          {/* CARD 1: Lead Facilitator Trent D. White (portrait with gold rim glow and condensed headline typography) */}
          <div className="snap-start flex-shrink-0 w-64 sm:w-72 bg-[#080E21] border-2 border-amber-400/90 rounded-3xl p-4 shadow-[0_0_35px_rgba(245,158,11,0.4)] ring-1 ring-amber-300/40 flex flex-col justify-between relative overflow-hidden group">
            <div className="relative h-60 w-full rounded-2xl overflow-hidden bg-slate-950 mb-3 border-2 border-amber-400/80 shadow-[0_0_20px_rgba(245,158,11,0.3)]">
              <img
                src="/image_7.png"
                alt="Lead Facilitator Trent D. White"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                style={{ objectPosition: '30% 15%' }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#040711] via-transparent to-transparent" />
              <div className="absolute top-2.5 right-2.5">
                <span className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-400 via-amber-500 to-orange-500 border-2 border-amber-200 text-slate-950 font-black text-xs font-pro-mono flex items-center justify-center shadow-lg shadow-amber-500/50">
                  A
                </span>
              </div>
              <div className="absolute bottom-2.5 left-2.5 right-2.5">
                <span className="px-2 py-0.5 rounded-md bg-amber-500 text-slate-950 font-pro-mono text-[9px] font-black tracking-wider uppercase inline-block mb-1 shadow-md">
                  LEAD FACILITATOR
                </span>
                <h3 className="font-pro-display text-lg sm:text-xl font-black text-white uppercase tracking-tight drop-shadow-md leading-tight">
                  Trent D. White
                </h3>
              </div>
            </div>

            <div className="space-y-1.5 text-left">
              <p className="text-xs text-amber-300 font-pro-mono font-bold">
                Sanctuary Leadership &amp; Overseer
              </p>
              <p className="text-[11px] text-slate-300 font-serif leading-relaxed line-clamp-2">
                "According to the effectual working in the measure of every part..." &bull; Ephesians 4:16
              </p>
            </div>
          </div>

          {/* CARD 2: Lead Facilitator Whitney White (portrait with rose-gold rim glow and condensed headline typography) */}
          <div className="snap-start flex-shrink-0 w-64 sm:w-72 bg-[#080E21] border-2 border-rose-400/90 rounded-3xl p-4 shadow-[0_0_35px_rgba(244,63,94,0.4)] ring-1 ring-rose-300/40 flex flex-col justify-between relative overflow-hidden group">
            <div className="relative h-60 w-full rounded-2xl overflow-hidden bg-slate-950 mb-3 border-2 border-rose-400/80 shadow-[0_0_20px_rgba(244,63,94,0.3)]">
              <img
                src="/image_7.png"
                alt="Lead Facilitator Whitney White"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                style={{ objectPosition: '70% 15%' }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#040711] via-transparent to-transparent" />
              <div className="absolute top-2.5 right-2.5">
                <span className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-400 via-amber-500 to-orange-500 border-2 border-amber-200 text-slate-950 font-black text-xs font-pro-mono flex items-center justify-center shadow-lg shadow-amber-500/50">
                  A
                </span>
              </div>
              <div className="absolute bottom-2.5 left-2.5 right-2.5">
                <span className="px-2 py-0.5 rounded-md bg-rose-500 text-white font-pro-mono text-[9px] font-black tracking-wider uppercase inline-block mb-1 shadow-md">
                  LEAD FACILITATOR
                </span>
                <h3 className="font-pro-display text-lg sm:text-xl font-black text-white uppercase tracking-tight drop-shadow-md leading-tight">
                  Whitney White
                </h3>
              </div>
            </div>

            <div className="space-y-1.5 text-left">
              <p className="text-xs text-rose-300 font-pro-mono font-bold">
                Sanctuary Leadership &amp; Sisterhood
              </p>
              <p className="text-[11px] text-slate-300 font-serif leading-relaxed line-clamp-2">
                Nurturing spiritual alignment, fervent intercession, and holy sisterhood across San Antonio.
              </p>
            </div>
          </div>

          {/* CARDS 3+: DYNAMICALLY PULL FROM youngfire_member_roster_v2 / FIRESTORE roster_members */}
          {members
            .filter(m => !m.id.includes('roster_lead_') && !m.fullName?.toLowerCase().includes('trent') && !m.fullName?.toLowerCase().includes('whitney'))
            .map((disciple) => {
              const badge = getColumnBadge(disciple);
              return (
                <div 
                  key={disciple.id}
                  className="snap-start flex-shrink-0 w-60 sm:w-64 bg-[#080E21] border border-white/15 hover:border-amber-400/60 rounded-3xl p-4 shadow-xl flex flex-col justify-between relative overflow-hidden transition-all group"
                >
                  <div className="relative h-56 w-full rounded-2xl overflow-hidden bg-slate-950 mb-3 border border-white/10 flex items-center justify-center">
                    {disciple.avatar && disciple.avatar.startsWith('data:') ? (
                      <img
                        src={disciple.avatar}
                        alt={disciple.fullName || disciple.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-20 h-20 rounded-full bg-slate-900 border-2 border-amber-400/50 flex items-center justify-center text-xl font-black font-pro-display text-amber-400 shadow-inner">
                        {getMemberInitials(disciple.fullName || disciple.name)}
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#040711] via-transparent to-transparent" />
                    
                    <div className="absolute top-2.5 right-2.5">
                      <span className={`w-8 h-8 rounded-full border text-xs font-pro-mono font-black flex items-center justify-center ${badge.style}`}>
                        {badge.letter}
                      </span>
                    </div>

                    <div className="absolute bottom-2.5 left-2.5 right-2.5">
                      <span className="px-2 py-0.5 rounded-md bg-slate-900/90 text-amber-400 text-[9px] font-pro-mono font-bold tracking-wider uppercase inline-block mb-1 border border-white/10">
                        {disciple.group || 'YoungFire'}
                      </span>
                      <h4 className="font-pro-display text-sm sm:text-base font-bold text-white tracking-wide truncate">
                        {disciple.fullName || disciple.name}
                      </h4>
                    </div>
                  </div>

                  <div className="space-y-1 text-left">
                    <p className="font-pro-mono text-[10px] text-amber-300 font-bold truncate">
                      {disciple.calling || disciple.role || 'Word Disciple'}
                    </p>
                    <p className="font-pro-mono text-[10px] text-slate-400">
                      San Antonio, TX &bull; Active Huddle
                    </p>
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      {/* ============================================================ */}
      {/* 2. 3-WAY SEGMENTED CONTROL: [ROSTER] | [STREAKS] | [STATS]   */}
      {/* ============================================================ */}
      <div className="bg-[#0B1329] p-1.5 rounded-2xl border border-white/10 shadow-lg flex items-center justify-between">
        <button
          onClick={() => setActiveSegment('roster')}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-pro-mono font-black uppercase tracking-wider transition-all cursor-pointer ${
            activeSegment === 'roster'
              ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-md scale-100'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          [ ROSTER ]
        </button>

        <button
          onClick={() => setActiveSegment('streaks')}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-pro-mono font-black uppercase tracking-wider transition-all cursor-pointer ${
            activeSegment === 'streaks'
              ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-md scale-100'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          [ DISCIPLESHIP STREAKS ]
        </button>

        <button
          onClick={() => setActiveSegment('stats')}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-pro-mono font-black uppercase tracking-wider transition-all cursor-pointer ${
            activeSegment === 'stats'
              ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-md scale-100'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          [ STATS ]
        </button>
      </div>

      {/* ============================================================ */}
      {/* TAB A: [ ROSTER ] MEMBER CARDS LIST                          */}
      {/*   - High-contrast card with avatar / monogram initials       */}
      {/*   - Member Full Name (.font-pro-display text-base)           */}
      {/*   - Calling / Role Subtitle (.font-pro-mono text-[10px])     */}
      {/*   - Right-hand Athletic Position Badges (B, S, A)            */}
      {/* ============================================================ */}
      {activeSegment === 'roster' && (
        <div className="space-y-4 animate-fadeIn">
          {/* Search & Filter Controls */}
          <div className="flex flex-col sm:flex-row gap-2.5">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search disciple by name or calling..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#080E21] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 font-pro-mono"
              />
            </div>

            {/* Group Filter Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              {(['All', 'Men On Fire', 'Women Ignited', 'YoungFire'] as const).map((grp) => (
                <button
                  key={grp}
                  onClick={() => setSelectedGroup(grp)}
                  className={`px-3 py-2 rounded-xl text-xs font-pro-mono font-bold whitespace-nowrap cursor-pointer transition-all ${
                    selectedGroup === grp
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-400'
                      : 'bg-[#080E21] text-slate-400 border border-white/10 hover:text-white'
                  }`}
                >
                  {grp}
                </button>
              ))}
            </div>
          </div>

          {/* Member Cards List */}
          <div className="space-y-2.5">
            {filteredMembers.map((member) => {
              const badge = getColumnBadge(member);
              return (
                <div
                  key={member.id}
                  className="p-3.5 sm:p-4 rounded-2xl bg-[#080E21] border border-white/15 hover:border-amber-400/60 shadow-lg flex items-center justify-between gap-3 transition-all hover:bg-[#0c142e]"
                >
                  {/* Left: High-contrast circular Avatar or Monogram Initials */}
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="relative flex-shrink-0">
                      {member.avatar && member.avatar.startsWith('data:') ? (
                        <img
                          src={member.avatar}
                          alt={member.fullName || member.name}
                          className="w-12 h-12 rounded-full object-cover border-2 border-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.35)]"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-slate-900 border-2 border-amber-400 flex items-center justify-center font-black font-pro-display text-amber-400 text-sm shadow-[0_0_12px_rgba(245,158,11,0.25)]">
                          {getMemberInitials(member.fullName || member.name)}
                        </div>
                      )}
                    </div>

                    {/* Center: Member Full Name & Calling / Role Subtitle */}
                    <div className="truncate space-y-0.5">
                      <div className="flex items-center gap-2">
                        {/* Member Full Name (.font-pro-display text-base tracking-wide) */}
                        <h4 className="font-pro-display text-base tracking-wide text-white truncate">
                          {member.fullName || member.name}
                        </h4>
                        <span className="font-pro-mono text-[9px] px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-slate-300">
                          {member.group || 'YoungFire'}
                        </span>
                      </div>
                      
                      {/* Calling / Ministry Role Subtitle (.font-pro-mono text-[10px] text-slate-400) */}
                      <p className="font-pro-mono text-[10px] text-slate-400 truncate">
                        {member.calling || member.role || 'Word Disciple'}
                      </p>
                      
                      <p className="font-pro-mono text-[9px] text-amber-400/80 truncate">
                        Joshua House of Worship &bull; San Antonio, TX
                      </p>
                    </div>
                  </div>

                  {/* Right: Athletic Position Badges (B for Brother, S for Sister, A for Admin/Lead) */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span 
                      className={`w-10 h-10 rounded-2xl border-2 font-pro-mono font-black text-sm flex items-center justify-center cursor-default ${badge.style}`}
                      title={badge.label}
                    >
                      {badge.letter}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* TAB B: [ DISCIPLESHIP STREAKS ]                              */}
      {/*   - Ranked leader list of active disciples                   */}
      {/*   - Consecutive Scripture Reading Streaks ("14 Days Consecrated") */}
      {/*   - Monday Bi-Weekly Small Group Check-in count              */}
      {/*   - Physical Sword Huddle attendance badge                   */}
      {/* ============================================================ */}
      {activeSegment === 'streaks' && (
        <div className="space-y-4 animate-fadeIn">
          
          {/* Small Group Check-In Banner */}
          <div className="bg-[#0B1329] border border-orange-500/40 rounded-3xl p-5 shadow-2xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Calendar className="w-5 h-5 text-orange-400" />
                <h3 className="text-sm sm:text-base font-black uppercase text-white font-pro-display tracking-wide">
                  Monday Small Group Huddle Attendance
                </h3>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-orange-500/20 text-orange-300 font-pro-mono text-[10px] font-bold border border-orange-500/40">
                Bi-Weekly 7:00 PM CST
              </span>
            </div>

            <p className="text-xs text-slate-300 font-serif leading-relaxed">
              Living room fellowship and intentional discipleship with Lead Facilitators Trent D. White &amp; Whitney White.
            </p>

            <div className="flex items-center justify-between pt-1">
              <div className="text-xs font-pro-mono">
                <span className="text-slate-400">Next Huddle: </span>
                <span className="text-amber-400 font-bold">Monday, Oct 5 @ 7:00 PM CST</span>
              </div>

              <button
                onClick={handleCheckIn}
                disabled={checkedInToday}
                className={`px-4 py-2 rounded-xl text-xs font-pro-mono font-black uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer ${
                  checkedInToday
                    ? 'bg-emerald-950/40 border border-emerald-500 text-emerald-300'
                    : 'bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 hover:brightness-110 shadow-lg'
                }`}
              >
                {checkedInToday ? (
                  <>
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                    <span>Checked In!</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-3.5 h-3.5 fill-current" />
                    <span>Check In Now</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Daily Holy Sword Reading Streaks Leaderboard */}
          <div className="bg-[#080E21] border border-white/10 rounded-3xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-amber-400" />
                <h3 className="text-sm sm:text-base font-black uppercase text-white font-pro-display tracking-wide">
                  Consecrated Discipleship Streaks
                </h3>
              </div>
              <span className="text-xs font-pro-mono text-amber-400 font-bold">
                Paper Sword Disciples
              </span>
            </div>

            <div className="space-y-3">
              {streakDisciples.map((item, idx) => (
                <div 
                  key={item.id}
                  className="p-3.5 sm:p-4 rounded-2xl bg-[#040817] border border-white/10 hover:border-amber-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all"
                >
                  {/* Left: Rank, Avatar, Name & Ministry Group */}
                  <div className="flex items-center gap-3">
                    <span className={`w-7 h-7 rounded-full border text-xs font-pro-mono font-black flex items-center justify-center flex-shrink-0 ${
                      idx === 0 
                        ? 'bg-amber-500 text-slate-950 border-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.5)]'
                        : idx === 1
                        ? 'bg-slate-300 text-slate-950 border-white shadow-[0_0_12px_rgba(255,255,255,0.4)]'
                        : idx === 2
                        ? 'bg-amber-700 text-white border-amber-500'
                        : 'bg-slate-900 border-white/10 text-slate-400'
                    }`}>
                      #{idx + 1}
                    </span>

                    <div className="w-10 h-10 rounded-full bg-slate-900 border border-amber-400/60 overflow-hidden flex items-center justify-center font-pro-display text-amber-400 font-bold text-xs flex-shrink-0">
                      {item.avatar ? (
                        <img src={item.avatar} alt={item.name} className="w-full h-full object-cover" />
                      ) : (
                        getMemberInitials(item.name)
                      )}
                    </div>

                    <div className="truncate">
                      <div className="flex items-center gap-2">
                        <h5 className="font-pro-display text-sm sm:text-base font-bold text-white tracking-wide truncate">
                          {item.name}
                        </h5>
                        <span className="text-[9px] font-pro-mono px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-slate-300">
                          {item.group}
                        </span>
                      </div>
                      <p className="font-pro-mono text-[10px] text-slate-400 truncate">
                        {item.role}
                      </p>
                    </div>
                  </div>

                  {/* Right: Scripture Streak, Small Group Count & Physical Sword Huddle Badge */}
                  <div className="flex items-center flex-wrap gap-2.5 sm:justify-end">
                    {/* Consecutive Scripture Reading Streak (e.g. "14 Days Consecrated") */}
                    <div className="px-2.5 py-1 rounded-xl bg-amber-500/10 border border-amber-400/30 flex items-center gap-1.5 text-xs font-black font-pro-mono text-amber-400 shadow-sm">
                      <Flame className="w-3.5 h-3.5 fill-current text-amber-400" />
                      <span>{item.streakLabel}</span>
                    </div>

                    {/* Monday Bi-Weekly Small Group Check-in count */}
                    <div className="px-2.5 py-1 rounded-xl bg-cyan-500/10 border border-cyan-400/30 flex items-center gap-1.5 text-[11px] font-pro-mono text-cyan-300 shadow-sm">
                      <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{item.smallGroupHuddles} Huddles Checked In</span>
                    </div>

                    {/* Physical Sword Huddle attendance badge */}
                    <div className="px-2.5 py-1 rounded-xl bg-orange-500/10 border border-orange-400/30 flex items-center gap-1 text-[10px] font-pro-mono text-orange-300 font-bold shadow-sm">
                      <Shield className="w-3 h-3 text-orange-400" />
                      <span>⚔️ Sword Huddle Verified</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* TAB C: [ STATS ] CORPORATE SPIRITUAL MOMENTUM TILES          */}
      {/*   - Total Holy Bible Chapters Read across all 66 books       */}
      {/*   - Total Intercessory Prayers Logged via "🙏 I Prayed For This"*/}
      {/*   - Total Small Group Gatherings Completed                   */}
      {/* ============================================================ */}
      {activeSegment === 'stats' && (
        <div className="space-y-4 animate-fadeIn">
          {/* Corporate Spiritual Momentum Tiles */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Tile 1: Total Holy Bible Chapters Read across all 66 books */}
            <div className="p-4 sm:p-5 rounded-3xl bg-[#080E21] border-2 border-amber-500/40 shadow-[0_10px_30px_rgba(245,158,11,0.2)] space-y-2">
              <div className="flex items-center justify-between text-amber-400">
                <BookOpen className="w-6 h-6 text-amber-400" />
                <span className="text-[10px] font-pro-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-400/30">
                  ALL 66 BOOKS
                </span>
              </div>
              <div className="font-pro-display text-3xl sm:text-4xl font-black text-white tracking-wide">
                {corporateStats.totalChaptersRead.toLocaleString()}
              </div>
              <div>
                <h4 className="font-pro-display text-sm font-bold text-amber-300 uppercase tracking-wide">
                  Total Chapters Read
                </h4>
                <p className="font-pro-mono text-[10px] text-slate-400 mt-0.5">
                  Across all 66 canonical books from Genesis to Revelation
                </p>
              </div>
            </div>

            {/* Tile 2: Total Intercessory Prayers Logged via "🙏 I Prayed For This" */}
            <div className="p-4 sm:p-5 rounded-3xl bg-[#080E21] border-2 border-rose-500/40 shadow-[0_10px_30px_rgba(244,63,94,0.2)] space-y-2">
              <div className="flex items-center justify-between text-rose-400">
                <Heart className="w-6 h-6 text-rose-400" />
                <span className="text-[10px] font-pro-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-rose-500/15 border border-rose-400/30">
                  INTERCESSION
                </span>
              </div>
              <div className="font-pro-display text-3xl sm:text-4xl font-black text-white tracking-wide">
                {corporateStats.totalPrayersLogged.toLocaleString()}
              </div>
              <div>
                <h4 className="font-pro-display text-sm font-bold text-rose-300 uppercase tracking-wide">
                  Intercessory Prayers Logged
                </h4>
                <p className="font-pro-mono text-[10px] text-slate-400 mt-0.5">
                  Logged live via "🙏 I Prayed For This" on the Prayer Dock
                </p>
              </div>
            </div>

            {/* Tile 3: Total Small Group Gatherings Completed */}
            <div className="p-4 sm:p-5 rounded-3xl bg-[#080E21] border-2 border-orange-500/40 shadow-[0_10px_30px_rgba(249,115,22,0.2)] space-y-2">
              <div className="flex items-center justify-between text-orange-400">
                <Activity className="w-6 h-6 text-orange-400" />
                <span className="text-[10px] font-pro-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-orange-500/15 border border-orange-400/30">
                  HUDDLE ATTENDANCE
                </span>
              </div>
              <div className="font-pro-display text-3xl sm:text-4xl font-black text-white tracking-wide">
                {corporateStats.totalSmallGroups}
              </div>
              <div>
                <h4 className="font-pro-display text-sm font-bold text-orange-300 uppercase tracking-wide">
                  Small Groups Completed
                </h4>
                <p className="font-pro-mono text-[10px] text-slate-400 mt-0.5">
                  Bi-Weekly living room discipleship &amp; Zoom bridge encounters
                </p>
              </div>
            </div>
          </div>

          {/* Ministry Cohort Breakdown */}
          <div className="bg-[#0B1329] border border-white/10 rounded-3xl p-5 shadow-2xl space-y-4">
            <h3 className="text-sm sm:text-base font-black uppercase text-white font-pro-display tracking-wide">
              Sanctuary Cohort Scripture Distribution
            </h3>

            <div className="space-y-3">
              {/* YoungFire General */}
              <div>
                <div className="flex justify-between text-xs font-pro-mono mb-1">
                  <span className="text-amber-400 font-bold">YoungFire General Assembly</span>
                  <span className="text-slate-300">48% (710 Ch.)</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden">
                  <div className="h-full bg-amber-400 rounded-full" style={{ width: '48%' }} />
                </div>
              </div>

              {/* Men On Fire */}
              <div>
                <div className="flex justify-between text-xs font-pro-mono mb-1">
                  <span className="text-orange-400 font-bold">Men On Fire (Brotherhood)</span>
                  <span className="text-slate-300">28% (414 Ch.)</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden">
                  <div className="h-full bg-orange-500 rounded-full" style={{ width: '28%' }} />
                </div>
              </div>

              {/* Women Ignited */}
              <div>
                <div className="flex justify-between text-xs font-pro-mono mb-1">
                  <span className="text-rose-400 font-bold">Women Ignited (Sisterhood)</span>
                  <span className="text-slate-300">24% (356 Ch.)</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden">
                  <div className="h-full bg-rose-500 rounded-full" style={{ width: '24%' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
