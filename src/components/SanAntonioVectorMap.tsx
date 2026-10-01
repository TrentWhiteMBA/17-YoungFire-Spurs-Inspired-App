import React from 'react';

interface SanAntonioVectorMapProps {
  className?: string;
  opacity?: number;
  maskId?: string;
  show3dDepth?: boolean;
}

/**
 * High-Density Monochrome San Antonio Vector Basemap (Spurs App 1:1 Match)
 * - Stationary in background as user scrolls
 * - 3D Aerial Perspective with tilt & deep focal depth
 * - Hundreds of fine, razor-thin streets, urban downtown grids, highway loops, and interchanges
 */
export const SanAntonioVectorMap: React.FC<SanAntonioVectorMapProps> = ({
  className = "w-full h-full object-cover",
  opacity = 0.88,
  maskId = "saVectorRadialMask",
  show3dDepth = true
}) => {
  return (
    <div 
      className="fixed inset-0 w-screen h-screen pointer-events-none select-none z-0 overflow-hidden bg-[#000000]"
      style={{
        perspective: show3dDepth ? '1100px' : 'none',
      }}
    >
      <div 
        className="w-full h-full"
        style={{
          transform: show3dDepth ? 'rotateX(8deg) scale(1.08)' : 'none',
          transformOrigin: '50% 40%',
          transition: 'transform 0.4s ease-out'
        }}
      >
        <svg 
          viewBox="0 0 2400 1600" 
          className={`${className} pointer-events-none select-none`}
          preserveAspectRatio="xMidYMid slice"
          style={{ opacity }}
        >
          <defs>
            {/* Center-focused vignette allowing streets to be clearly visible behind cards while fading at edges */}
            <radialGradient id={maskId} cx="50%" cy="45%" r="65%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
              <stop offset="40%" stopColor="#ffffff" stopOpacity="0.95" />
              <stop offset="70%" stopColor="#ffffff" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0.15" />
            </radialGradient>
            
            <mask id={`mask_${maskId}`}>
              <rect width="2400" height="1600" fill={`url(#${maskId})`} />
            </mask>
          </defs>

          <g mask={`url(#mask_${maskId})`}>
            {/* Pitch black canvas */}
            <rect width="2400" height="1600" fill="#000000" />

            {/* 1. ULTRA-DENSE CITYWIDE RESIDENTIAL STREET GRID (Hundreds of fine razor-thin lines) */}
            <g stroke="rgba(255, 255, 255, 0.075)" strokeWidth="0.85">
              {/* Vertical streets across 2400 width every 28px */}
              {Array.from({ length: 85 }).map((_, i) => (
                <line key={`dense-v-${i}`} x1={i * 28 + 14} y1="0" x2={i * 28 + 14} y2="1600" />
              ))}
              {/* Horizontal streets across 1600 height every 28px */}
              {Array.from({ length: 58 }).map((_, i) => (
                <line key={`dense-h-${i}`} x1="0" y1={i * 28 + 14} x2="2400" y2={i * 28 + 14} />
              ))}
            </g>

            {/* 2. DOWNTOWN SAN ANTONIO ANGLED URBAN BLOCKS & ALAMO PLAZA GEOMETRY */}
            {/* Downtown street blocks sit at an authentic ~25 degree angle relative to North */}
            <g 
              stroke="rgba(255, 255, 255, 0.16)" 
              strokeWidth="1.2"
              transform="translate(1200, 800) rotate(22) translate(-1200, -800)"
            >
              {/* Downtown dense blocks */}
              {Array.from({ length: 28 }).map((_, i) => (
                <line key={`dt-v-${i}`} x1={1020 + i * 16} y1="650" x2={1020 + i * 16} y2="950" />
              ))}
              {Array.from({ length: 20 }).map((_, i) => (
                <line key={`dt-h-${i}`} x1="1020" y1={650 + i * 16} x2="1450" y2={650 + i * 16} />
              ))}
            </g>

            {/* 3. SAN ANTONIO RIVER MEANDER (Meandering waterway tracing through downtown) */}
            <path
              d="M 1240 500 Q 1260 620 1210 700 T 1180 780 T 1230 840 T 1200 930 T 1160 1050 T 1190 1200 T 1150 1450"
              fill="none"
              stroke="rgba(255, 255, 255, 0.14)"
              strokeWidth="2.2"
              strokeDasharray="4 2"
            />

            {/* 4. SECONDARY ARTERIALS, DIAGONAL THOROUGHFARES & SUBDIVISIONS */}
            <g stroke="rgba(255, 255, 255, 0.13)" strokeWidth="1.5">
              {/* Major cross arterials */}
              <line x1="400" y1="200" x2="2000" y2="200" />
              <line x1="200" y1="380" x2="2200" y2="380" />
              <line x1="100" y1="560" x2="2300" y2="560" />
              <line x1="100" y1="740" x2="2300" y2="740" />
              <line x1="100" y1="920" x2="2300" y2="920" />
              <line x1="200" y1="1100" x2="2200" y2="1100" />
              <line x1="400" y1="1280" x2="2000" y2="1280" />
              <line x1="600" y1="1440" x2="1800" y2="1440" />

              {/* North-South Corridors (San Pedro, Blanco, Broadway, Zarzamora, New Braunfels) */}
              <line x1="680" y1="50" x2="680" y2="1550" />
              <line x1="920" y1="50" x2="920" y2="1550" />
              <line x1="1060" y1="50" x2="1060" y2="1550" />
              <line x1="1340" y1="50" x2="1340" y2="1550" />
              <line x1="1480" y1="50" x2="1480" y2="1550" />
              <line x1="1720" y1="50" x2="1720" y2="1550" />

              {/* Diagonal Avenues (Fredericksburg Rd, Bandera Rd, Culebra Rd, Nacogdoches Rd) */}
              <line x1="120" y1="300" x2="1180" y2="790" />
              <line x1="280" y1="100" x2="1190" y2="780" />
              <line x1="80" y1="650" x2="1170" y2="800" />
              <line x1="80" y1="900" x2="1180" y2="820" />
              <line x1="2320" y1="280" x2="1220" y2="780" />
              <line x1="2350" y1="600" x2="1230" y2="800" />
              <line x1="2300" y1="1000" x2="1230" y2="830" />
              <line x1="1800" y1="1550" x2="1210" y2="840" />
              <line x1="600" y1="1550" x2="1190" y2="830" />
            </g>

            {/* 5. PRIMARY HIGHWAY NETWORKS (LOOP 1604, LOOP 410, I-10, I-35, US-281, US-90) */}
            <g stroke="rgba(255, 255, 255, 0.28)" strokeWidth="2.8" fill="none" strokeLinecap="round">
              {/* LOOP 1604 (Anderson Loop - Outer Beltway) */}
              <ellipse 
                cx="1200" 
                cy="800" 
                rx="1020" 
                ry="720" 
                strokeDasharray="14 8"
                strokeWidth="2.2"
              />

              {/* LOOP 410 (Connally Loop - Inner Highway Beltway) */}
              <ellipse 
                cx="1200" 
                cy="800" 
                rx="620" 
                ry="440" 
                strokeWidth="3.2"
              />

              {/* INTERSTATE 35 (Northeast to Southwest Diagonal Spine) */}
              <path 
                d="M 2350 80 L 1750 440 L 1240 760 L 1160 820 L 780 1120 L 100 1520" 
                strokeWidth="3.5"
              />

              {/* INTERSTATE 10 (Northwest to Southeast Diagonal Spine) */}
              <path 
                d="M 80 120 L 680 460 L 1180 770 L 1230 820 L 1780 1140 L 2350 1480" 
                strokeWidth="3.5"
              />

              {/* US-281 / INTERSTATE 37 (North-South Expressway) */}
              <path 
                d="M 1205 30 L 1205 740 L 1235 810 L 1270 940 L 1380 1580" 
                strokeWidth="3.2"
              />

              {/* US-90 WEST (West Expressway) */}
              <path d="M 1160 820 L 800 890 L 50 960" strokeWidth="3.0" />

              {/* STATE HIGHWAY 151 (SeaWorld Expressway) */}
              <path d="M 1140 790 L 760 720 L 80 690" strokeWidth="2.6" />

              {/* WURZBACH PARKWAY ARC */}
              <path 
                d="M 640 370 Q 1200 480 1760 370" 
                strokeDasharray="10 5" 
                strokeWidth="2.4" 
              />

              {/* MILITARY DRIVE ARC */}
              <path 
                d="M 620 1210 Q 1200 1120 1780 1210" 
                strokeDasharray="10 5" 
                strokeWidth="2.4" 
              />

              {/* DOWNTOWN INNER FREEWAY LOOP (Downtown Core Interchange) */}
              <path 
                d="M 1120 740 C 1180 720 1240 720 1270 750 C 1290 790 1260 845 1210 855 C 1145 850 1110 800 1120 740 Z" 
                strokeWidth="3.6" 
              />
            </g>

            {/* 6. HIGHWAY INTERCHANGES & RAMPS (Cloverleaf Loops at I-10/410, I-35/410, US-281/410) */}
            <g stroke="rgba(255, 255, 255, 0.22)" strokeWidth="1.8" fill="none">
              {/* I-10 & Loop 410 Interchange (NW) */}
              <circle cx="760" cy="510" r="32" strokeDasharray="6 3" />
              <circle cx="760" cy="510" r="18" />

              {/* US-281 & Loop 410 Interchange (North Central) */}
              <circle cx="1205" cy="480" r="32" strokeDasharray="6 3" />
              <circle cx="1205" cy="480" r="18" />

              {/* I-35 & Loop 410 Interchange (NE) */}
              <circle cx="1660" cy="520" r="32" strokeDasharray="6 3" />
              <circle cx="1660" cy="520" r="18" />

              {/* I-35 & Loop 410 Interchange (SW) */}
              <circle cx="750" cy="1100" r="32" strokeDasharray="6 3" />
              <circle cx="750" cy="1100" r="18" />

              {/* I-37 & Loop 410 Interchange (SE) */}
              <circle cx="1320" cy="1170" r="32" strokeDasharray="6 3" />
              <circle cx="1320" cy="1170" r="18" />
            </g>

            {/* 7. DOWNTOWN SAN ANTONIO CENTER BEACON */}
            <circle cx="1200" cy="790" r="48" fill="none" stroke="rgba(255, 255, 255, 0.16)" strokeWidth="1.2" strokeDasharray="4 4" />
            <circle cx="1200" cy="790" r="24" fill="none" stroke="rgba(255, 255, 255, 0.28)" strokeWidth="1.8" />
            <circle cx="1200" cy="790" r="6" fill="rgba(255, 255, 255, 0.65)" />
          </g>
        </svg>
      </div>

      {/* Smooth radial vignette guaranteeing high center contrast and natural outer falloff */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 50% 45%, transparent 20%, rgba(0, 0, 0, 0.5) 65%, rgba(0, 0, 0, 0.96) 100%)'
        }}
      />
    </div>
  );
};

export default SanAntonioVectorMap;
