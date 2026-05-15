import React from 'react';
import { motion } from 'framer-motion';

export function FastMovingBackground() {
  return (
    <div className="fixed inset-0 z-0 w-full h-full bg-black overflow-hidden pointer-events-none">
      {/* Deep Red Mesh Glows */}
      <motion.div
        animate={{
          x: ['0%', '-20%', '10%', '0%'],
          y: ['0%', '10%', '-20%', '0%'],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
        className="absolute top-[-20%] left-[-10%] w-[70vw] h-[70vh] rounded-full bg-[#450a0a] blur-[100px] opacity-80 mix-blend-screen"
      />
      <motion.div
        animate={{
          x: ['0%', '20%', '-10%', '0%'],
          y: ['0%', '-20%', '10%', '0%'],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
        className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vh] rounded-full bg-red-900/40 blur-[120px] opacity-70 mix-blend-screen"
      />

      {/* Fast Moving Grid Lines */}
      <motion.div
        initial={{ y: 0 }}
        animate={{ y: '50px' }}
        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        className="absolute inset-0 w-full h-[200%] opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
          top: '-50px',
        }}
      />
      
      {/* Fade overlay at bottom so it blends with footer if needed */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black" />
    </div>
  );
}
