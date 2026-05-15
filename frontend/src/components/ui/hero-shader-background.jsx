"use client"

import { MeshGradient, DotOrbit } from "@paper-design/shaders-react"

export function HeroShaderBackground() {
  const speed = 1.0;
  const intensity = 1.5;

  return (
    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
      <MeshGradient
        className="w-full h-full absolute inset-0 opacity-60"
        colors={["#000000", "#5c0a0a", "#b51212", "#000000"]}
        speed={speed * 0.5}
        wireframe={true}
        backgroundColor="#000000"
      />
      <div className="w-full h-full absolute inset-0 opacity-60">
        <DotOrbit
          className="w-full h-full"
          dotColor="#ff3333"
          orbitColor="#3a0202"
          speed={speed * 1.5}
          intensity={intensity * 0.8}
        />
      </div>

      {/* Lighting overlay effects */}
      <div className="absolute inset-0 pointer-events-none mix-blend-screen">
        <div
          className="absolute top-1/4 left-1/3 w-32 h-32 bg-red-800/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDuration: `${3 / speed}s` }}
        />
        <div
          className="absolute bottom-1/3 right-1/4 w-48 h-48 bg-rose-600/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDuration: `${2 / speed}s`, animationDelay: "1s" }}
        />
        <div
          className="absolute top-1/2 right-1/3 w-20 h-20 bg-red-900/10 rounded-full blur-xl animate-pulse"
          style={{ animationDuration: `${4 / speed}s`, animationDelay: "0.5s" }}
        />
      </div>
    </div>
  )
}
