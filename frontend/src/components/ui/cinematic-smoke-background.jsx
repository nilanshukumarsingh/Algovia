import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

export function CinematicSmokeBackground() {
  const plumes = useMemo(() => {
    return Array.from({ length: 8 }).map((_, i) => {
      // Create layered depth
      const isForeground = i % 2 === 0;
      const size = isForeground ? Math.random() * 60 + 60 : Math.random() * 40 + 40; // 60-120vw or 40-80vw
      
      // Start positions spread across the screen
      const startX = Math.random() * 120 - 10; 
      const startY = Math.random() * 120 - 10;
      
      // Extremely slow movement
      const duration = Math.random() * 40 + 60; // 60s to 100s
      const delay = Math.random() * -100; 
      
      // Soft whites and grays
      const opacity = isForeground ? (Math.random() * 0.02 + 0.01) : (Math.random() * 0.015 + 0.005);
      
      return {
        id: i,
        width: `${size}vw`,
        height: `${size * (Math.random() * 0.4 + 0.8)}vh`, // Oval shapes
        left: `${startX}%`,
        top: `${startY}%`,
        // Gentle upward and sideways drift
        xMove: `${Math.random() * 20 - 10}vw`,
        yMove: `${Math.random() * -30 - 10}vh`,
        duration,
        delay,
        opacity,
        scale: Math.random() * 0.3 + 1.1,
        rotation: Math.random() * 60 - 30,
      };
    });
  }, []);

  return (
    <div className="fixed inset-0 z-0 w-full h-full bg-[#030303] overflow-hidden pointer-events-none">
      {/* Ambient base glow to prevent pure black dead zones */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(20,20,20,1)_0%,_rgba(3,3,3,1)_100%)]" />

      {/* SVG Noise overlay for cinematic texture and turbulence */}
      <div 
        className="absolute inset-0 opacity-[0.03] mix-blend-screen" 
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.6' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
      />
      
      {/* Smoke plumes */}
      {plumes.map((plume) => (
        <motion.div
          key={plume.id}
          className="absolute rounded-[100%] mix-blend-screen"
          style={{
            width: plume.width,
            height: plume.height,
            left: plume.left,
            top: plume.top,
            // Smooth gradient for volumetric feel
            background: `radial-gradient(circle at center, rgba(255,255,255,${plume.opacity}) 0%, rgba(200,200,200,${plume.opacity * 0.5}) 40%, transparent 70%)`,
            filter: 'blur(60px)',
            transformOrigin: 'center center',
          }}
          animate={{
            x: ['0vw', plume.xMove, '0vw'],
            y: ['0vh', plume.yMove, '0vh'],
            scale: [1, plume.scale, 1],
            rotate: [0, plume.rotation, 0]
          }}
          transition={{
            duration: plume.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: plume.delay,
          }}
        />
      ))}
      
      {/* Dark vignette to frame the content and enhance depth */}
      <div className="absolute inset-0 shadow-[inset_0_0_200px_rgba(0,0,0,1)]" />
      {/* Bottom fade for footer blending */}
      <div className="absolute bottom-0 left-0 w-full h-[30vh] bg-gradient-to-t from-black to-transparent" />
    </div>
  );
}
