import React from 'react';
import { motion } from 'framer-motion';

export function CinematicFluidBackground({ className }) {
  return (
    <div className={`absolute inset-0 z-0 w-full h-full bg-[#030000] overflow-hidden pointer-events-none ${className || ''}`}>
      
      {/* Main Liquid Glows */}
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          x: ['0%', '8%', '-5%', '0%'],
          y: ['0%', '6%', '-8%', '0%'],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-[-10%] left-[-10%] w-[60vw] h-[60vh] rounded-[100%] bg-red-600/25 blur-[120px] mix-blend-screen"
      />
      
      <motion.div
        animate={{
          scale: [1, 1.25, 1],
          x: ['0%', '-12%', '8%', '0%'],
          y: ['0%', '-8%', '12%', '0%'],
        }}
        transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        className="absolute top-[30%] right-[-10%] w-[70vw] h-[70vh] rounded-[100%] bg-[#ff0505]/20 blur-[140px] mix-blend-screen"
      />

      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          x: ['0%', '12%', '-15%', '0%'],
          y: ['0%', '-12%', '10%', '0%'],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut', delay: 5 }}
        className="absolute bottom-[-20%] left-[20%] w-[80vw] h-[60vh] rounded-[100%] bg-rose-700/20 blur-[150px] mix-blend-screen"
      />
      
      {/* Deep inner moving core */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 90, 0],
        }}
        transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
        className="absolute top-[40%] left-[40%] w-[50vw] h-[50vh] rounded-[100%] bg-red-900/30 blur-[130px] mix-blend-screen"
      />

      {/* Very subtle noise texture for cinematic realism */}
      <div 
        className="absolute inset-0 z-10 opacity-[0.035] mix-blend-overlay pointer-events-none" 
        style={{ 
          backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' 
        }} 
      />
    </div>
  );
}
