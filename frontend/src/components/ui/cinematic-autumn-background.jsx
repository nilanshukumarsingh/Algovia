import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

// Replace Maple Leaf with Code Fragments
const CODE_FRAGMENTS = ['{', '}', '/>', '=>', '0', '1', ';', '[', ']'];

export function CinematicAutumnBackground() {
  // Atmosphere Plumes
  const plumes = useMemo(() => {
    return Array.from({ length: 8 }).map((_, i) => ({
      id: `plume-${i}`,
      size: `${Math.random() * 60 + 60}vw`,
      left: `${Math.random() * 100 - 10}%`,
      top: `${Math.random() * 100 - 10}%`,
      xMove: `${Math.random() * 30 - 15}vw`,
      yMove: `${Math.random() * 30 - 15}vh`,
      duration: Math.random() * 30 + 40,
      delay: Math.random() * -50,
      opacity: Math.random() * 0.2 + 0.15,
    }));
  }, []);

  // Data Fragments Drifting Upward
  const fragments = useMemo(() => {
    return Array.from({ length: 40 }).map((_, i) => {
      const isForeground = Math.random() > 0.6;
      return {
        id: `frag-${i}`,
        char: CODE_FRAGMENTS[Math.floor(Math.random() * CODE_FRAGMENTS.length)],
        size: isForeground ? Math.random() * 10 + 14 : Math.random() * 8 + 8,
        startX: Math.random() * 100,
        duration: Math.random() * 40 + 25, // Very slow drift
        delay: Math.random() * -60,
        swayAmount: Math.random() * 10 + 5,
        opacity: isForeground ? (Math.random() * 0.3 + 0.2) : (Math.random() * 0.15 + 0.05),
        blur: isForeground ? 'blur(0px)' : 'blur(3px)',
        color: Math.random() > 0.5 ? '#ef4444' : '#67e8f9' // Mix of Red and Cyan fragments
      };
    });
  }, []);

  return (
    <div className="fixed inset-0 z-0 w-full h-full bg-[#030000] overflow-hidden pointer-events-none">
      {/* Base glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(15,0,0,1)_0%,_rgba(3,0,0,1)_100%)]" />

      {/* Subtle 20px Grid Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.05] mix-blend-screen"
        style={{
          backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.5) 1px, transparent 1px)`,
          backgroundSize: '20px 20px'
        }}
      />

      {/* Cinematic Smoke Atmosphere */}
      {plumes.map((plume) => (
        <motion.div
          key={plume.id}
          className="absolute rounded-full mix-blend-screen"
          style={{
            width: plume.size,
            height: plume.size,
            left: plume.left,
            top: plume.top,
            background: `radial-gradient(circle at center, rgba(225,29,72,${plume.opacity}) 0%, rgba(159,18,57,${plume.opacity * 0.5}) 40%, transparent 70%)`,
            filter: 'blur(80px)',
            transformOrigin: 'center center',
          }}
          animate={{
            x: ['0vw', plume.xMove, '0vw'],
            y: ['0vh', plume.yMove, '0vh'],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: plume.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: plume.delay,
          }}
        />
      ))}

      {/* Subtle Noise Texture */}
      <div 
        className="absolute inset-0 opacity-[0.035] mix-blend-screen" 
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.6' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
      />
      
      {/* Drifting Data Fragments (Upward Parallax) */}
      {fragments.map((frag) => (
        <motion.div
          key={frag.id}
          className="absolute font-mono font-bold"
          style={{
            left: `${frag.startX}%`,
            fontSize: `${frag.size}px`,
            color: frag.color,
            opacity: frag.opacity,
            filter: frag.blur,
          }}
          animate={{
            y: ['110vh', '-10vh'], // Drift upwards
            x: [
              '0px', 
              `${frag.swayAmount}px`, 
              `-${frag.swayAmount * 0.5}px`, 
              '0px'
            ],
            rotate: [0, 360],
          }}
          transition={{
            y: {
              duration: frag.duration,
              repeat: Infinity,
              ease: "linear",
              delay: frag.delay,
            },
            x: {
              duration: frag.duration * 0.8,
              repeat: Infinity,
              ease: "easeInOut",
              delay: frag.delay,
              repeatType: "mirror"
            },
            rotate: {
              duration: frag.duration * 1.5,
              repeat: Infinity,
              ease: "linear",
              delay: frag.delay,
            }
          }}
        >
          {frag.char}
        </motion.div>
      ))}

      {/* Scanline Effect */}
      <motion.div 
        className="absolute inset-0 w-full h-[10vh] bg-gradient-to-b from-transparent via-white to-transparent opacity-[0.015]"
        animate={{ y: ['-10vh', '110vh'] }}
        transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
      />
      
      {/* Deep Vignette */}
      <div className="absolute inset-0 shadow-[inset_0_0_180px_rgba(0,0,0,1)]" />
    </div>
  );
}
