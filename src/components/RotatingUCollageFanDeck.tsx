import React, { useState, useEffect } from 'react';

interface RotatingUCollageFanDeckProps {
  photos?: string[];
  className?: string;
  onPhotoClick?: (index: number) => void;
  autoRotateIntervalMs?: number;
}

const DEFAULT_PHOTOS = [
  '/image_4.png', // Authentic Pulpit / Sanctuary Photo
  '/image_5.png', // Fellowship Gathering Photo
  '/image_6.png', // Men on Fire / Discipleship Photo
  '/image_7.png', // Lead Facilitators Trent & Whitney White
  '/image_8.png', // Sanctuary Community Photo
];

/**
 * U-Shaped Rotating Collage Fan Deck (1:1 Spurs App Match)
 * - 5 smaller pictures arranged in a classic "U" shaped arc
 * - Rotates in clock formation every 2 seconds (or custom interval)
 * - Smooth transition animations and tap-to-focus
 */
export const RotatingUCollageFanDeck: React.FC<RotatingUCollageFanDeckProps> = ({
  photos = DEFAULT_PHOTOS,
  className = '',
  onPhotoClick,
  autoRotateIntervalMs = 2000
}) => {
  // Ensure we have at least 5 photos by looping if needed
  const displayPhotos = photos.length >= 5 ? photos : [...photos, ...DEFAULT_PHOTOS].slice(0, 5);
  const totalCount = displayPhotos.length;

  // Active rotation offset (increments every 2 seconds like a clock)
  const [rotationOffset, setRotationOffset] = useState<number>(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setRotationOffset((prev) => (prev + 1) % totalCount);
    }, autoRotateIntervalMs);

    return () => clearInterval(timer);
  }, [totalCount, autoRotateIntervalMs]);

  // Geometric coordinates for the 5 slots forming a distinct "U" shape
  // Slots 0 & 4 are higher up at the arms of the U; Slot 2 is at the bottom curve of the U
  const SLOTS = [
    { x: -105, y: -18, rotate: -20, scale: 0.82, zIndex: 10, opacity: 0.75 },
    { x: -54,  y: -4,  rotate: -9,  scale: 0.94, zIndex: 20, opacity: 0.92 },
    { x: 0,    y: 12,  rotate: 0,   scale: 1.06, zIndex: 40, opacity: 1.0 },
    { x: 54,   y: -4,  rotate: 9,   scale: 0.94, zIndex: 20, opacity: 0.92 },
    { x: 105,  y: -18, rotate: 20,  scale: 0.82, zIndex: 10, opacity: 0.75 },
  ];

  return (
    <div className={`relative w-full py-4 flex flex-col items-center justify-center select-none ${className}`}>
      {/* 3D Perspective Stage for the U-Curve Arc */}
      <div className="relative w-72 h-40 sm:h-44 flex items-center justify-center [perspective:1000px]">
        {displayPhotos.map((photo, origIndex) => {
          // Calculate relative slot position for this photo
          const relativePos = (origIndex - rotationOffset + totalCount * 10) % totalCount;
          
          // Only show photos that map into the 5 active U-arc slots
          if (relativePos >= 5) return null;

          const slot = SLOTS[relativePos];
          const isCenter = relativePos === 2;

          return (
            <div
              key={`${origIndex}-${photo}`}
              onClick={() => {
                // If clicked, shift so this photo moves to center (slot 2)
                const shiftNeeded = (relativePos - 2 + totalCount) % totalCount;
                setRotationOffset((prev) => (prev + shiftNeeded) % totalCount);
                if (onPhotoClick) onPhotoClick(origIndex);
              }}
              className={`absolute w-20 sm:w-24 h-28 sm:h-34 rounded-2xl overflow-hidden shadow-2xl transition-all duration-700 ease-out cursor-pointer group border ${
                isCenter
                  ? 'border-white ring-2 ring-amber-400/80 shadow-[0_10px_25px_rgba(245,158,11,0.4)]'
                  : 'border-white/30 hover:border-white/70 shadow-black/90'
              }`}
              style={{
                transform: `translateX(${slot.x}px) translateY(${slot.y}px) rotate(${slot.rotate}deg) scale(${slot.scale})`,
                zIndex: slot.zIndex,
                opacity: slot.opacity,
              }}
              title="Click photo to rotate into center focus"
            >
              <img
                src={photo}
                alt={`Sanctuary Fellowship Photo ${origIndex + 1}`}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                loading="eager"
              />
              <div 
                className={`absolute inset-0 transition-opacity ${
                  isCenter 
                    ? 'bg-gradient-to-t from-black/60 via-transparent to-black/10' 
                    : 'bg-black/35 group-hover:bg-black/15'
                }`} 
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RotatingUCollageFanDeck;
