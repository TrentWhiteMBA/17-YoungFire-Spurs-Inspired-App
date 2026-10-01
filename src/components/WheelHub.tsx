import React, { useState, useEffect, useRef } from "react";
import { 
  Flame, Shield, Heart, BookOpen, Calendar, 
  Video, Radio, Sparkles, Pause, Play, RotateCcw, 
  ChevronRight, Compass 
} from 'lucide-react';

export interface OrbitNode {
  id: string;
  deg: number;
  label: string;
  badge: string;
  description: string;
  icon: React.ReactNode;
  iconName: string;
  accentColor: string;
  borderColor: string;
  bgGradient: string;
  glowColor: string;
  badgeBg: string;
  badgeText: string;
}

interface WheelHubProps {
  onSelectHub?: (hubId: string) => void;
  activeHubId?: string;
}

export const ORBIT_NODES: OrbitNode[] = [
  {
    id: 'youngfire',
    deg: 0,
    label: 'YoungFire Sanctuary',
    badge: 'Main Pillar',
    description: 'Every Joint Supplies & Apostolic Discipleship',
    icon: <Flame className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400 fill-current" />,
    iconName: 'Flame',
    accentColor: 'text-amber-400',
    borderColor: 'border-amber-400/80',
    bgGradient: 'bg-gradient-to-tr from-amber-600/40 via-[#0B1329] to-amber-950/90',
    glowColor: 'shadow-[0_0_20px_rgba(245,158,11,0.5)]',
    badgeBg: 'bg-amber-500/20',
    badgeText: 'text-amber-300'
  },
  {
    id: 'men_on_fire',
    deg: 45,
    label: 'Men On Fire',
    badge: 'Brotherhood',
    description: 'Iron Sharpens Iron & Armor of God',
    icon: <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-orange-400" />,
    iconName: 'Shield',
    accentColor: 'text-orange-400',
    borderColor: 'border-orange-500/80',
    bgGradient: 'bg-gradient-to-tr from-orange-600/40 via-[#0B1329] to-orange-950/90',
    glowColor: 'shadow-[0_0_20px_rgba(249,115,22,0.5)]',
    badgeBg: 'bg-orange-500/20',
    badgeText: 'text-orange-300'
  },
  {
    id: 'women_ignited',
    deg: 90,
    label: 'Women Ignited',
    badge: 'Sisterhood',
    description: 'Consecrated Virtuous Sisterhood & Grace',
    icon: <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-rose-400 fill-current" />,
    iconName: 'Heart',
    accentColor: 'text-rose-400',
    borderColor: 'border-rose-400/80',
    bgGradient: 'bg-gradient-to-tr from-rose-600/40 via-[#0B1329] to-rose-950/90',
    glowColor: 'shadow-[0_0_20px_rgba(244,63,94,0.5)]',
    badgeBg: 'bg-rose-500/20',
    badgeText: 'text-rose-300'
  },
  {
    id: 'open_bible',
    deg: 135,
    label: 'Open Bible Thursdays',
    badge: 'Scripture Watch',
    description: 'Deep Scripture Dive & Discipleship Exegesis',
    icon: <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-400" />,
    iconName: 'BookOpen',
    accentColor: 'text-emerald-400',
    borderColor: 'border-emerald-400/80',
    bgGradient: 'bg-gradient-to-tr from-emerald-600/40 via-[#0B1329] to-emerald-950/90',
    glowColor: 'shadow-[0_0_20px_rgba(52,211,153,0.5)]',
    badgeBg: 'bg-emerald-500/20',
    badgeText: 'text-emerald-300'
  },
  {
    id: 'calendar',
    deg: 180,
    label: 'Sanctuary Calendar',
    badge: 'Events & Huddles',
    description: 'Bi-Weekly Small Groups & Ministry Gatherings',
    icon: <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-400" />,
    iconName: 'Calendar',
    accentColor: 'text-cyan-400',
    borderColor: 'border-cyan-400/80',
    bgGradient: 'bg-gradient-to-tr from-cyan-600/40 via-[#0B1329] to-cyan-950/90',
    glowColor: 'shadow-[0_0_20px_rgba(6,182,212,0.5)]',
    badgeBg: 'bg-cyan-500/20',
    badgeText: 'text-cyan-300'
  },
  {
    id: 'tv',
    deg: 225,
    label: 'Kingdom TV & Media',
    badge: 'Video Vault',
    description: 'Recorded Sermons, Worship Anthems & Exhortations',
    icon: <Video className="w-5 h-5 sm:w-6 sm:h-6 text-red-400" />,
    iconName: 'Video',
    accentColor: 'text-red-400',
    borderColor: 'border-red-400/80',
    bgGradient: 'bg-gradient-to-tr from-red-600/40 via-[#0B1329] to-red-950/90',
    glowColor: 'shadow-[0_0_20px_rgba(239,68,68,0.5)]',
    badgeBg: 'bg-red-500/20',
    badgeText: 'text-red-300'
  },
  {
    id: 'radio',
    deg: 270,
    label: '24/7 Gospel Radio',
    badge: 'Live Broadcast',
    description: 'Continuous Live Anointing & Gospel Anthems',
    icon: <Radio className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400" />,
    iconName: 'Radio',
    accentColor: 'text-purple-400',
    borderColor: 'border-purple-400/80',
    bgGradient: 'bg-gradient-to-tr from-purple-600/40 via-[#0B1329] to-purple-950/90',
    glowColor: 'shadow-[0_0_20px_rgba(192,132,252,0.5)]',
    badgeBg: 'bg-purple-500/20',
    badgeText: 'text-purple-300'
  },
  {
    id: 'prayer',
    deg: 315,
    label: '24/7 Prayer Dock',
    badge: 'Intercession Watch',
    description: 'Live Altar Prayer Requests & Consecration',
    icon: <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-300 fill-current" />,
    iconName: 'Sparkles',
    accentColor: 'text-yellow-300',
    borderColor: 'border-yellow-400/80',
    bgGradient: 'bg-gradient-to-tr from-yellow-500/40 via-[#0B1329] to-yellow-950/90',
    glowColor: 'shadow-[0_0_20px_rgba(250,204,21,0.5)]',
    badgeBg: 'bg-yellow-500/20',
    badgeText: 'text-yellow-200'
  }
];

export const WheelHub: React.FC<WheelHubProps> = ({ onSelectHub, activeHubId }) => {
  const [isRotating, setIsRotating] = useState(true);
  const [hoveredNode, setHoveredNode] = useState<OrbitNode | null>(null);
  const [selectedNode, setSelectedNode] = useState<OrbitNode>(() => {
    return ORBIT_NODES.find(n => n.id === activeHubId) || ORBIT_NODES[0];
  });
  
  const wheelRef = useRef<HTMLDivElement | null>(null);
  const isDraggingRef = useRef(false);
  const lastXRef = useRef(0);
  const currentAngleRef = useRef(0);

  // Sync active node if prop changes
  useEffect(() => {
    if (activeHubId) {
      const match = ORBIT_NODES.find(n => n.id === activeHubId);
      if (match) setSelectedNode(match);
    }
  }, [activeHubId]);

  // Touch & Pointer interaction: Direct DOM transform for 60fps zero-glitch dragging
  const handlePointerDown = (e: React.PointerEvent) => {
    isDraggingRef.current = true;
    lastXRef.current = e.clientX;
    try {
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    } catch {}
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    const dx = e.clientX - lastXRef.current;
    lastXRef.current = e.clientX;
    currentAngleRef.current = (currentAngleRef.current + dx * 0.5) % 360;
    if (wheelRef.current) {
      wheelRef.current.style.transform = `rotate(${currentAngleRef.current}deg)`;
    }
  };

  const handlePointerUp = () => {
    isDraggingRef.current = false;
  };

  const handleNodeClick = (node: OrbitNode, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedNode(node);
    if (onSelectHub) {
      onSelectHub(node.id);
    }
  };

  const displayNode = hoveredNode || selectedNode;

  return (
    <div className="relative flex flex-col items-center justify-center p-2 sm:p-4 select-none w-full max-w-2xl">
      <style>{`
        @keyframes wheel-orbit-rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes wheel-counter-rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(-360deg); }
        }
        .orbit-spin-active {
          animation: wheel-orbit-rotate 48s linear infinite;
        }
        .orbit-spin-counter {
          animation: wheel-counter-rotate 48s linear infinite;
        }
        .orbit-spin-paused {
          animation-play-state: paused !important;
        }
      `}</style>

      {/* Orbit Wheel Controls Top Bar */}
      <div className="flex items-center justify-between w-full max-w-md px-2 pb-2 text-xs font-mono text-slate-400">
        <div className="flex items-center gap-1.5 text-amber-300">
          <Compass className="w-4 h-4 animate-spin-slow" />
          <span className="font-bold uppercase tracking-wider text-[11px]">Orbit Wheel Selector</span>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsRotating(!isRotating)}
            className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white flex items-center gap-1 text-[11px] font-mono cursor-pointer transition-colors"
            title={isRotating ? 'Pause Orbit Animation' : 'Resume Orbit Animation'}
          >
            {isRotating ? (
              <>
                <Pause className="w-3 h-3 text-amber-400" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-3 h-3 text-emerald-400" />
                <span>Spin</span>
              </>
            )}
          </button>
          <button
            onClick={() => {
              currentAngleRef.current = 0;
              if (wheelRef.current) {
                wheelRef.current.style.transform = 'rotate(0deg)';
              }
            }}
            className="p-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white cursor-pointer transition-colors"
            title="Reset Wheel Orientation"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Orbit Wheel Canvas Area */}
      <div
        className="relative w-[320px] h-[320px] sm:w-[420px] sm:h-[420px] flex items-center justify-center cursor-grab active:cursor-grabbing touch-none my-3"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        {/* Outer glowing cosmic halo */}
        <div className="absolute inset-0 rounded-full border-2 border-amber-500/20 blur-md pointer-events-none" />
        
        {/* Concentric orbital rings */}
        <div className="absolute inset-6 sm:inset-8 rounded-full border border-dashed border-amber-500/30 pointer-events-none" />
        <div className="absolute inset-16 sm:inset-20 rounded-full border border-white/10 pointer-events-none" />

        {/* Rotating ring carrying all 8 distinct orbital nodes (GPU-accelerated, zero React re-render glitch) */}
        <div
          ref={wheelRef}
          className={`absolute inset-0 flex items-center justify-center pointer-events-none ${
            isRotating ? 'orbit-spin-active' : ''
          } ${hoveredNode ? 'orbit-spin-paused' : ''}`}
        >
          {ORBIT_NODES.map((node) => {
            const isHovered = hoveredNode?.id === node.id;
            const isActive = selectedNode?.id === node.id || activeHubId === node.id;

            return (
              <div
                key={node.id}
                className="absolute flex items-center justify-center pointer-events-auto"
                style={{
                  // Position radially around circumference
                  transform: `rotate(${node.deg}deg) translateY(calc(-115px - 2.5vw))`
                }}
              >
                {/* Counter-rotating node button so icons remain upright and readable */}
                <div className={`${isRotating ? 'orbit-spin-counter' : ''} ${hoveredNode ? 'orbit-spin-paused' : ''}`}>
                  <button
                    type="button"
                    onClick={(e) => handleNodeClick(node, e)}
                    onMouseEnter={() => setHoveredNode(node)}
                    onMouseLeave={() => setHoveredNode(null)}
                    className={`group relative w-11 h-11 sm:w-13 sm:h-13 rounded-2xl border-2 flex flex-col items-center justify-center transition-all duration-200 cursor-pointer shadow-xl active:scale-95 ${
                      node.bgGradient
                    } ${node.borderColor} ${node.glowColor} ${
                      isHovered || isActive 
                        ? 'scale-125 ring-2 ring-white z-30 shadow-[0_0_20px_rgba(255,255,255,0.6)]' 
                        : 'hover:scale-115'
                    }`}
                    title={`${node.label} (${node.badge})`}
                  >
                    {/* Distinct Icon */}
                    <div className="transition-transform group-hover:scale-110 drop-shadow-md">
                      {node.icon}
                    </div>

                    {/* Active pulse */}
                    {isActive && (
                      <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-400 border border-white animate-ping" />
                    )}

                    {/* Mini Tooltip */}
                    <div className={`absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap px-2 py-0.5 rounded-md bg-black/95 border border-white/20 text-[9px] font-mono font-bold text-white shadow-lg pointer-events-none transition-opacity ${
                      isHovered ? 'opacity-100 z-50' : 'opacity-0'
                    }`}>
                      {node.label}
                    </div>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Central Hub Core: Interactive Showcase */}
        <div 
          onClick={() => handleNodeClick(displayNode, {} as any)}
          className="relative z-10 w-32 h-32 sm:w-44 sm:h-44 rounded-full bg-gradient-to-tr from-[#160B03] via-[#0B1020] to-[#1C0F04] border-2 border-amber-400/80 shadow-[0_0_40px_rgba(245,158,11,0.35)] flex flex-col items-center justify-center p-3 text-center cursor-pointer hover:border-amber-300 transition-all group pointer-events-auto"
        >
          <div className="w-full h-full rounded-full bg-[#060914]/90 border border-amber-500/40 flex flex-col items-center justify-center p-2 sm:p-3 text-center transition-all group-hover:bg-[#070D1E]">
            {/* Center Dynamic Icon */}
            <div className="mb-1 transition-transform group-hover:scale-110">
              {displayNode.icon}
            </div>
            
            <div className="font-['Cinzel'] font-black text-amber-300 text-[11px] sm:text-xs tracking-wide uppercase line-clamp-1">
              {displayNode.label}
            </div>

            <div className={`text-[8px] sm:text-[9px] font-mono px-2 py-0.5 rounded-full mt-0.5 font-bold uppercase tracking-widest ${displayNode.badgeBg} ${displayNode.badgeText}`}>
              {displayNode.badge}
            </div>

            <div className="mt-1 text-[8px] font-mono text-slate-400 uppercase tracking-widest flex items-center gap-1 group-hover:text-amber-300">
              <span>Open Pillar</span>
              <ChevronRight className="w-2.5 h-2.5" />
            </div>
          </div>
        </div>
      </div>

      {/* Active Node Quick Guide Bar */}
      <div className="w-full max-w-md p-3 rounded-2xl bg-[#070C1C] border border-white/10 shadow-lg text-center space-y-1">
        <div className="flex items-center justify-center gap-2">
          <span className="text-xs font-mono font-bold text-white">
            {displayNode.label}
          </span>
          <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded font-bold ${displayNode.badgeBg} ${displayNode.badgeText}`}>
            {displayNode.badge}
          </span>
        </div>
        <p className="text-[11px] font-serif text-slate-300">
          {displayNode.description}
        </p>
        <button
          onClick={() => handleNodeClick(displayNode, {} as any)}
          className="mt-1 text-xs font-mono font-bold text-amber-400 hover:text-amber-300 inline-flex items-center gap-1 cursor-pointer"
        >
          <span>Tap to Enter This Ministry Hub &rarr;</span>
        </button>
      </div>
    </div>
  );
};
