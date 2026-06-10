import { NavLink, useLocation } from "react-router";
import { Github } from "lucide-react";
import { motion } from "framer-motion";

export default function Navbar({ isAuthenticated, rightSlot }) {
  const location = useLocation();

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Problems", path: "/problems" },
  ];

  return (
    <div className="sticky top-0 z-50 flex justify-center px-4 pb-2 pt-4 sm:px-6 pointer-events-none">
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="pointer-events-auto relative flex h-16 w-full max-w-5xl items-center justify-between rounded-2xl border border-white/10 bg-black/40 px-4 shadow-[0_8px_32px_rgba(0,0,0,0.4)] backdrop-blur-xl before:absolute before:inset-0 before:-z-10 before:rounded-2xl before:bg-gradient-to-b before:from-white/5 before:to-transparent sm:px-6"
      >
        {/* Logo */}
        <NavLink to="/" className="group relative flex items-center gap-3 no-underline">
          <div className="relative">
            <div className="absolute -inset-2 rounded-full bg-cyan-400/20 opacity-0 blur-md transition-opacity duration-500 group-hover:opacity-100" />
            <img 
              src="/logo.png" 
              alt="Algovia Logo" 
              className="relative h-9 w-9 rounded-lg object-cover shadow-[0_0_15px_rgba(34,211,238,0.4)] transition-transform duration-300 group-hover:scale-105" 
            />
          </div>
          <span className="text-xl font-extrabold tracking-tight text-white transition-colors duration-300 group-hover:text-cyan-300">
            Algovia
          </span>
        </NavLink>

        {/* Center nav links */}
        {isAuthenticated && (
          <div className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-2 rounded-xl border border-white/5 bg-white/[0.02] p-1.5 md:flex shadow-[inset_0_0_20px_rgba(255,255,255,0.02)]">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <NavLink
                  key={link.name}
                  to={link.path}
                  className={`relative rounded-lg px-5 py-2 text-sm font-semibold transition-colors duration-300 no-underline
                    ${isActive ? "text-cyan-300" : "text-slate-400 hover:text-white"}`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="nav-pill"
                      className="absolute inset-0 z-[-1] rounded-lg bg-cyan-400/10 shadow-[inset_0_0_12px_rgba(34,211,238,0.2)] border border-cyan-400/20"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  {link.name}
                </NavLink>
              );
            })}
          </div>
        )}

        {/* Right slot */}
        <div className="flex items-center gap-3">
          {/* GitHub icon button */}
          <a
            href="https://github.com/nilanshukumarsingh/algovia"
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub"
            className="group relative hidden h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-400 transition-all duration-300 hover:border-cyan-400/30 hover:bg-cyan-400/10 hover:text-cyan-300 hover:shadow-[0_0_15px_rgba(34,211,238,0.2)] no-underline sm:flex"
          >
            <Github size={18} className="transition-transform duration-300 group-hover:scale-110" />
          </a>

          {rightSlot ? rightSlot : (
            isAuthenticated ? (
              <NavLink
                to="/problems"
                className="group relative overflow-hidden rounded-xl bg-cyan-400 px-5 py-2.5 text-sm font-extrabold text-black transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_rgba(34,211,238,0.4)] no-underline"
              >
                <div className="absolute inset-0 flex h-full w-full justify-center [transform:skew(-12deg)_translateX(-150%)] group-hover:duration-1000 group-hover:[transform:skew(-12deg)_translateX(150%)]">
                  <div className="relative h-full w-8 bg-white/40" />
                </div>
                <span className="relative">Dashboard</span>
              </NavLink>
            ) : (
              <div className="flex items-center gap-2">
                <NavLink
                  to="/login"
                  className={({ isActive }) =>
                    `relative rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-300 no-underline hover:bg-white/5
                     ${isActive ? "text-cyan-300" : "text-slate-300 hover:text-white"}`
                  }
                >
                  Log in
                </NavLink>
                <NavLink
                  to="/signup"
                  className="group relative overflow-hidden rounded-xl bg-white px-5 py-2.5 text-sm font-extrabold text-black transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] no-underline"
                >
                  <div className="absolute inset-0 flex h-full w-full justify-center [transform:skew(-12deg)_translateX(-150%)] group-hover:duration-1000 group-hover:[transform:skew(-12deg)_translateX(150%)]">
                    <div className="relative h-full w-8 bg-black/10" />
                  </div>
                  <span className="relative">Sign up</span>
                </NavLink>
              </div>
            )
          )}
        </div>
      </motion.nav>
    </div>
  );
}
