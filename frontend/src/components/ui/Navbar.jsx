import { NavLink } from "react-router";
import { Github } from "lucide-react";
import { motion } from "framer-motion";

export default function Navbar({ isAuthenticated, rightSlot }) {

  const navLinkClass = ({ isActive }) =>
    `relative px-3 py-2 text-sm font-semibold transition-colors duration-200 no-underline sm:px-4
     ${isActive
      ? "text-cyan-300 after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:h-0.5 after:w-4/5 after:rounded-full after:bg-cyan-400 after:content-['']"
      : "text-slate-400 hover:text-white"
    }`;

  return (
    <nav className="sticky top-0 z-50 h-16 border-b border-white/10 backdrop-blur-md overflow-hidden">
      {/* Navbar Base */}
      <div className="absolute inset-0 z-0 bg-black/50"></div>

      {/* Animated Shader Effect */}
      <motion.div
        className="absolute inset-0 z-0 opacity-30 mix-blend-screen blur-xl"
        animate={{
          background: [
            "linear-gradient(90deg, rgba(225,29,72,0.3) 0%, rgba(103,232,249,0.3) 100%)",
            "linear-gradient(90deg, rgba(103,232,249,0.3) 0%, rgba(225,29,72,0.3) 100%)",
            "linear-gradient(90deg, rgba(225,29,72,0.3) 0%, rgba(103,232,249,0.3) 100%)"
          ]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
      />

      <div className="relative z-10 mx-auto flex h-full max-w-[1152px] items-center justify-between px-4 sm:px-6">

        {/* Logo */}
        <NavLink to="/" className="flex items-center gap-3 no-underline">
          <img src="/logo.png" alt="Algovia Logo" className="h-9 w-9 rounded-lg object-cover drop-shadow-[0_0_5px_rgba(103,232,249,0.5)]" />
          <span className="text-xl font-extrabold tracking-tight text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">Algovia</span>
        </NavLink>

        {/* Center nav links (only when authenticated) */}
        {isAuthenticated && (
          <div className="hidden items-center gap-1 md:flex">
            <NavLink to="/" className={navLinkClass}>Home</NavLink>
            <NavLink to="/problems" className={navLinkClass}>Problems</NavLink>
          </div>
        )}

        {/* Right slot */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* GitHub icon button */}
          <a
            href="https://github.com/nilanshukumarsingh"
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 text-slate-400 transition hover:border-white/20 hover:bg-white/5 hover:text-white no-underline"
          >
            <Github size={16} />
          </a>

          {rightSlot ? rightSlot : (
            isAuthenticated ? (
              <NavLink
                to="/problems"
                className="rounded-xl bg-[#67e8f9] px-4 py-2 text-sm font-extrabold text-black shadow-[0_0_15px_rgba(103,232,249,0.5)] transition-all duration-300 hover:scale-105 hover:bg-cyan-300 no-underline sm:px-5"
              >
                Dashboard
              </NavLink>
            ) : (
              <>
                <NavLink
                  to="/login"
                  className={({ isActive }) =>
                    `rounded-xl border border-white/20 bg-transparent px-4 py-2 text-sm font-semibold text-white transition-all duration-300 hover:bg-white/5 no-underline sm:px-5
                     ${isActive ? "text-cyan-300" : ""}`
                  }
                >
                  Log in
                </NavLink>
                <NavLink
                  to="/signup"
                  className="rounded-xl bg-[#67e8f9] px-4 py-2 text-sm font-extrabold text-black shadow-[0_0_15px_rgba(103,232,249,0.5)] transition-all duration-300 hover:scale-105 hover:bg-cyan-300 no-underline sm:px-5"
                >
                  Sign up
                </NavLink>
              </>
            )
          )}
        </div>
      </div>
    </nav>
  );
}
