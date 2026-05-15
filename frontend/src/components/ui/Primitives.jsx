export function SectionLabel({ children }) {
  return (
    <p className="mb-3 text-center text-xs font-bold uppercase tracking-[0.18em] text-cyan-300">
      {children}
    </p>
  );
}

export function SectionTitle({ children }) {
  return (
    <h2 className="mx-auto mb-12 max-w-[768px] text-center text-3xl font-extrabold leading-tight text-white md:text-4xl">
      {children}
    </h2>
  );
}

export function FeatureCard({ icon, title, description }) {
  return (
    <div className="group rounded-2xl border border-white/[0.06] bg-[#0c0c14] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-cyan-300/25 hover:bg-cyan-300/[0.03]">
      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl border border-cyan-300/20 bg-cyan-300/10 text-cyan-400">
        {icon}
      </div>
      <h3 className="mb-2 text-[15px] font-bold text-white">{title}</h3>
      <p className="text-sm leading-relaxed text-slate-500">{description}</p>
    </div>
  );
}


export function PageBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 bg-[#07080d]">
      {/* Radial gradient — taller so sections below the fold stay consistent */}
      <div className="absolute inset-x-0 top-0 h-[640px] bg-[radial-gradient(ellipse_at_top,rgba(34,211,238,0.10)_0%,rgba(79,70,229,0.07)_38%,transparent_70%)]" />
      {/* Subtle grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.03)_1px,transparent_1px)] bg-[length:52px_52px]" />
      {/* Fade to solid at bottom */}
      <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_0%,#07080d_85%)]" />
    </div>
  );
}


export function BrandMark({ className = "" }) {
  return (
    <div className={`flex h-11 w-11 items-center justify-center rounded-xl border border-cyan-300/20 bg-cyan-300/10 text-cyan-200 shadow-lg shadow-cyan-950/30 ${className}`}>
      <span className="text-lg font-black leading-none">{"</>"}</span>
    </div>
  );
}

export const fieldClass =
  "h-12 w-full rounded-xl border border-slate-700/80 bg-slate-950/60 px-4 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300/70 focus:ring-4 focus:ring-cyan-300/10";

export const iconFieldClass =
  "h-12 w-full rounded-xl border border-slate-700/80 bg-slate-950/60 py-3 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300/70 focus:ring-4 focus:ring-cyan-300/10";
