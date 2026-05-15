import { NavLink } from "react-router";
import { useEffect, useState } from "react";

const SOCIAL_LINKS = [
  { label: "LinkedIn", href: "https://linkedin.com/in/nilanshukumarsingh/" },
  { label: "X", href: "https://x.com/nilanshukumar81" },
  { label: "GitHub", href: "https://github.com/nilanshukumarsingh/" },
];

export default function Footer() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const update = () => {
      setTime(new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <footer className="relative w-full py-16 text-white sm:py-24 mt-auto">
      <div className="relative z-10 mx-auto max-w-[1152px] px-6">

        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 py-16">
          {/* Logo & Tagline */}
          <div className="md:col-span-5 flex flex-col gap-6">
            <NavLink to="/" className="flex items-center gap-3 no-underline group">
              <img src="/logo.png" alt="Algovia Logo" className="h-10 w-10 rounded-xl object-cover transition-transform group-hover:scale-110 duration-300" />
              <span className="text-2xl font-bold tracking-tighter text-white">Algovia <span className="text-red-500 text-xs align-top">®</span></span>
            </NavLink>
            <p className="text-slate-500 text-sm max-w-sm leading-relaxed">
              Algovia is a high-performance DSA practice environment engineered for the modern developer.
              We combine beautiful design with AI-powered insights to accelerate your career.
            </p>
          </div>

          {/* Navigation Column */}
          <div className="md:col-span-3 flex flex-col gap-4">
            <h4 className="text-white font-bold text-sm uppercase tracking-[0.2em] mb-2 opacity-50">Platform</h4>
            <div className="flex flex-col gap-2">
              <NavLink to="/" className="text-slate-400 no-underline hover:text-white transition-colors text-base">Overview</NavLink>
              <NavLink to="/problems" className="text-slate-400 no-underline hover:text-white transition-colors text-base">Problems</NavLink>
              <NavLink to="/login" className="text-slate-400 no-underline hover:text-white transition-colors text-base">Authentication</NavLink>
              <NavLink to="/signup" className="text-slate-400 no-underline hover:text-[#67e8f9] transition-colors text-base font-semibold">Join the Waitlist</NavLink>
            </div>
          </div>

          {/* Connect Column */}
          <div className="md:col-span-4 flex flex-col gap-4">
            <h4 className="text-white font-bold text-sm uppercase tracking-[0.2em] mb-2 opacity-50">Connect</h4>
            <div className="flex flex-col gap-4">
              <a href="mailto:nilanshukumarsingh2005@gmail.com" className="text-slate-300 hover:text-white transition-colors no-underline text-base truncate">
                nilanshukumarsingh2005@gmail.com
              </a>
              <div className="flex items-center gap-6 mt-2">
                {SOCIAL_LINKS.map((link) => (
                  <a key={link.label} href={link.href} target="_blank" rel="noreferrer" className="text-slate-500 hover:text-white transition-all duration-300 hover:-translate-y-1 no-underline text-sm font-medium">
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Metadata Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-center pt-10 border-t border-white/5 text-[10px] uppercase tracking-widest text-slate-600 font-bold">
          <div className="flex items-center gap-4">
            <p>Algovia Systems © {new Date().getFullYear()}</p>
            <span className="h-1 w-1 rounded-full bg-slate-800" />
            <p>Built by Developers</p>
          </div>
          <div className="mt-4 sm:mt-0 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <p>All Systems Operational</p>
            <span className="mx-2 text-slate-800">|</span>
            <p>{time} IST</p>
          </div>
        </div>

      </div>
    </footer>
  );
}
