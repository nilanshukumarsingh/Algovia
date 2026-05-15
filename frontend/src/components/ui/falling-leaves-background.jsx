import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

const MapleLeaf = ({ className, style }) => (
  <svg viewBox="0 0 512 512" fill="currentColor" className={className} style={style}>
    <path d="M495.9 203.2c-15.1-6.1-32.9-2.2-43.9 9.3l-29.2 30.5-27-81.8c-4.4-13.4-16.7-22.6-30.8-23.2-14.1-.6-27.1 7.2-32.5 19.5L296.8 240l-28.7-142.2c-2.3-11.4-10.4-20.6-21.5-24.3-11.1-3.8-23.5-.9-31.9 7.4l-57.9 57.6-5.5-62.7c-1.3-14.5-12.2-26.6-26.7-29.4-14.5-2.8-29.2 4-36.1 16.7L42.2 147.2c-6.8 12.6-5.3 28.3 3.8 39.4l45.2 55.4-78.3 15.6c-14.6 2.9-26.1 13.9-28.7 28.6-2.6 14.6 4.3 29.4 17.1 36.8l77.7 45.4-44.5 54c-9.5 11.5-10.4 27.8-2.3 40.2 8.1 12.4 23.3 17.1 37.8 11.7l102.6-38.3 16.3 54.7c4.1 13.7 16.4 23.3 30.7 23.9 14.3.6 27.5-7.7 32.7-20.5l47.9-117.8 54.3 59.9c10 11 25.9 14.1 39.4 7.6 13.5-6.5 22.3-20.1 21.8-35.1l-2.4-71.5 53.3-33.3c12.3-7.7 19.2-21.8 17.3-36.3-1.8-14.4-12-26.5-25.7-30.4l-75.1-21.4 51.5-53.7c10.4-10.8 12.6-27.2 5.5-40.4-7.2-13.2-22.1-19.5-36.8-15.1z" />
  </svg>
);

export function FallingLeavesBackground() {
  const leaves = useMemo(() => {
    return Array.from({ length: 40 }).map((_, i) => {
      // Random properties for natural movement
      const size = Math.random() * 25 + 15; // 15px to 40px
      const startX = Math.random() * 100; // 0% to 100%
      const duration = Math.random() * 10 + 10; // 10s to 20s
      const delay = Math.random() * -20; // Start at different times
      const rotateStart = Math.random() * 360;
      const rotateEnd = rotateStart + (Math.random() > 0.5 ? 360 : -360) * (Math.random() * 2 + 1);
      const swayAmount = Math.random() * 10 + 5; // Horizontal sway
      
      return {
        id: i,
        size,
        startX,
        duration,
        delay,
        rotateStart,
        rotateEnd,
        swayAmount,
        opacity: Math.random() * 0.5 + 0.3, // 0.3 to 0.8
        color: Math.random() > 0.7 ? '#ef4444' : (Math.random() > 0.5 ? '#dc2626' : '#991b1b') // Mix of red hues
      };
    });
  }, []);

  return (
    <div className="fixed inset-0 z-0 w-full h-full overflow-hidden pointer-events-none bg-black">
      {/* Background dark radial gradient to give depth */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#1a0505] via-black to-black opacity-80" />
      
      {leaves.map((leaf) => (
        <motion.div
          key={leaf.id}
          className="absolute top-[-50px]"
          style={{
            left: `${leaf.startX}%`,
            width: leaf.size,
            height: leaf.size,
            color: leaf.color,
            opacity: leaf.opacity,
            filter: `blur(${Math.random() > 0.7 ? '2px' : '0px'})`
          }}
          animate={{
            y: ['0vh', '110vh'],
            x: [
              '0px', 
              `${leaf.swayAmount * 2}px`, 
              `-${leaf.swayAmount * 1.5}px`, 
              `${leaf.swayAmount}px`, 
              '0px'
            ],
            rotate: [leaf.rotateStart, leaf.rotateEnd],
          }}
          transition={{
            y: {
              duration: leaf.duration,
              repeat: Infinity,
              ease: "linear",
              delay: leaf.delay,
            },
            x: {
              duration: leaf.duration * 0.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: leaf.delay,
              repeatType: "mirror"
            },
            rotate: {
              duration: leaf.duration,
              repeat: Infinity,
              ease: "linear",
              delay: leaf.delay,
            }
          }}
        >
          <MapleLeaf className="w-full h-full drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
        </motion.div>
      ))}
      
      {/* Vignette overlay for cinematic effect */}
      <div className="absolute inset-0 shadow-[inset_0_0_150px_rgba(0,0,0,0.9)]" />
    </div>
  );
}
