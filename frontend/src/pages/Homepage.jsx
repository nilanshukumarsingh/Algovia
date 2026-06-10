import { useEffect, useState, useRef } from "react";
import { NavLink } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import axiosClient from "../utils/axiosClient";
import { logoutUser } from "../authSlice";
import Navbar from "../components/ui/Navbar";
import Footer from "../components/ui/Footer";
import { PageBackground } from "../components/ui/Primitives";
import { ChevronDown, Check, LogOut, Shield } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function CustomDropdown({ value, onChange, options, placeholder }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const activeLabel = options.find(o => o[0] === value)?.[1] || placeholder;

  return (
    <div className="relative inline-block text-left shadow-lg" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-40 rounded-xl border border-white/10 bg-[#0c0c14] px-4 py-2.5 text-xs font-semibold text-slate-300 transition hover:border-cyan-300/30 hover:bg-white/[0.02] focus:border-cyan-300/50 outline-none"
      >
        <span className="truncate">{activeLabel}</span>
        <ChevronDown size={14} className={`ml-2 text-slate-500 transition-transform duration-200 ${isOpen ? 'rotate-180 text-cyan-400' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute right-0 mt-2 z-50 w-40 origin-top-right rounded-xl border border-white/[0.08] bg-[#0d0d14] p-1 shadow-2xl shadow-black/80 backdrop-blur-xl"
          >
            <div className="py-0.5 space-y-0.5">
              {options.map(([val, label]) => {
                const isSelected = val === value;
                return (
                  <button
                    key={val}
                    onClick={() => {
                      onChange(val);
                      setIsOpen(false);
                    }}
                    className={`flex w-full items-center rounded-lg px-3 py-2 text-left text-xs font-medium transition-all duration-150
                      ${isSelected 
                        ? 'bg-cyan-300/10 text-cyan-300 font-bold' 
                        : 'text-slate-400 hover:bg-white/5 hover:text-white'
                      }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Homepage() {
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);
  const [problems, setProblems] = useState([]);
  const [solved, setSolved] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [filters, setFilters] = useState({
    difficulty: "all",
    tag: "all",
    status: "all",
  });

  useEffect(() => {
    axiosClient
      .get("/problem/getAllProblem")
      .then((r) => setProblems(r.data))
      .catch(() => {});
    if (user)
      axiosClient
        .get("/problem/problemSolvedByUser")
        .then((r) => setSolved(r.data))
        .catch(() => {});
  }, [user]);

  const filtered = problems.filter((p) => {
    if (filters.difficulty !== "all" && p.difficulty !== filters.difficulty)
      return false;
    if (filters.tag !== "all" && p.tags !== filters.tag) return false;
    if (filters.status === "solved" && !solved.some((s) => s._id === p._id))
      return false;
    return true;
  });

  const diffColor = (d) =>
    d === "easy"
      ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
      : d === "medium"
        ? "border-amber-500/20 bg-amber-500/10 text-amber-400"
        : d === "hard"
          ? "border-red-500/20 bg-red-500/10 text-red-400"
          : "border-slate-500/20 bg-slate-500/10 text-slate-400";

  /* User menu button for the navbar */
  const userMenu = (
    <div className="relative">
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="flex items-center gap-2 rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 text-sm font-medium text-slate-300 transition hover:bg-white/[0.06]"
      >
        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-cyan-600 text-[10px] font-bold text-slate-950">
          {user?.firstName?.[0]?.toUpperCase()}
        </div>
        {user?.firstName}
        <ChevronDown size={14} className="text-slate-500" />
      </button>

      {menuOpen && (
        <div className="absolute right-0 top-full z-50 mt-2 w-44 overflow-hidden rounded-xl border border-white/[0.08] bg-[#12141c] shadow-2xl shadow-black/50">
          <button
            onClick={() => {
              dispatch(logoutUser());
              setSolved([]);
            }}
            className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-slate-400 transition hover:bg-cyan-300/10 hover:text-white"
          >
            <LogOut size={14} /> Logout
          </button>
          {user?.role === "admin" && (
            <NavLink
              to="/admin"
              className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-400 no-underline transition hover:bg-cyan-300/10 hover:text-white"
            >
              <Shield size={14} /> Admin Panel
            </NavLink>
          )}
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#07080d] text-slate-200">
      <PageBackground />
      <Navbar isAuthenticated rightSlot={userMenu} />

      <div className="relative z-10 mx-auto w-full max-w-[1120px] px-6 py-12 flex-grow">
        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Left Side: Stats and Progress */}
          <aside className="w-full lg:w-1/3 flex flex-col gap-6">
            {/* Welcome Greeting */}
            <div className="rounded-2xl border border-white/[0.06] bg-[#0c0c14]/50 p-6 backdrop-blur-md">
              <h2 className="text-xl font-extrabold text-white">Hello, {user?.firstName || 'Developer'}!</h2>
              <p className="mt-1.5 text-xs text-slate-400">Ready to tackle your next DSA challenge?</p>
            </div>

            {/* Overall Progress */}
            <div className="rounded-2xl border border-white/[0.06] bg-[#0c0c14]/50 p-6 backdrop-blur-md">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-slate-300">Overall Progress</span>
                <span className="text-xs font-black text-cyan-400">{solved.length}/{problems.length} Solved</span>
              </div>
              <div className="mt-3 h-2 w-full rounded-full bg-white/5 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-cyan-400 to-cyan-500 transition-all duration-500" 
                  style={{ width: `${problems.length > 0 ? (solved.length / problems.length) * 100 : 0}%` }}
                />
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
                <div className="rounded-lg bg-emerald-500/5 border border-emerald-500/10 p-2">
                  <span className="block font-black text-emerald-400">
                    {solved.filter(p => p.difficulty === 'easy').length}/{problems.filter(p => p.difficulty === 'easy').length}
                  </span>
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Easy</span>
                </div>
                <div className="rounded-lg bg-amber-500/5 border border-amber-500/10 p-2">
                  <span className="block font-black text-amber-400">
                    {solved.filter(p => p.difficulty === 'medium').length}/{problems.filter(p => p.difficulty === 'medium').length}
                  </span>
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Medium</span>
                </div>
                <div className="rounded-lg bg-red-500/5 border border-red-500/10 p-2">
                  <span className="block font-black text-red-400">
                    {solved.filter(p => p.difficulty === 'hard').length}/{problems.filter(p => p.difficulty === 'hard').length}
                  </span>
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Hard</span>
                </div>
              </div>
            </div>

            {/* Topics Covered */}
            <div className="rounded-2xl border border-white/[0.06] bg-[#0c0c14]/50 p-6 backdrop-blur-md">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Topics Covered</h3>
              <div className="space-y-4">
                {[
                  { name: "Array", tag: "array", color: "from-cyan-400 to-cyan-600", total: problems.filter(p => p.tags === 'array').length },
                  { name: "Linked List", tag: "linkedList", color: "from-indigo-400 to-indigo-600", total: problems.filter(p => p.tags === 'linkedList').length },
                  { name: "Graph", tag: "graph", color: "from-pink-400 to-pink-600", total: problems.filter(p => p.tags === 'graph').length },
                  { name: "Dynamic Programming", tag: "dp", color: "from-red-400 to-red-600", total: problems.filter(p => p.tags === 'dp').length },
                ].map((cat) => {
                  const catSolved = solved.filter(p => p.tags === cat.tag).length;
                  const pct = cat.total > 0 ? (catSolved / cat.total) * 100 : 0;
                  return (
                    <div key={cat.tag} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-bold">
                        <span className="text-slate-300">{cat.name}</span>
                        <span className="text-slate-500">{catSolved}/{cat.total}</span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-white/5 overflow-hidden">
                        <div 
                          className={`h-full bg-gradient-to-r ${cat.color} transition-all duration-500`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </aside>

          {/* Right Side: Filters & Problem Grid */}
          <main className="w-full lg:w-2/3 flex flex-col gap-6">
            {/* Header and filters */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-white/5 pb-4">
              <div>
                <h1 className="text-2xl font-extrabold tracking-tight text-white">Problem Set</h1>
                <p className="mt-1 text-xs text-slate-400">Choose a challenge and start coding.</p>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap gap-2">
                {[
                  {
                    key: "status",
                    value: filters.status,
                    placeholder: "All Status",
                    opts: [
                      ["all", "All Status"],
                      ["solved", "Solved"],
                    ],
                  },
                  {
                    key: "difficulty",
                    value: filters.difficulty,
                    placeholder: "All Difficulty",
                    opts: [
                      ["all", "All Difficulty"],
                      ["easy", "Easy"],
                      ["medium", "Medium"],
                      ["hard", "Hard"],
                    ],
                  },
                  {
                    key: "tag",
                    value: filters.tag,
                    placeholder: "All Tags",
                    opts: [
                      ["all", "All Tags"],
                      ["array", "Array"],
                      ["linkedList", "Linked List"],
                      ["graph", "Graph"],
                      ["dp", "DP"],
                    ],
                  },
                ].map((f) => (
                  <CustomDropdown
                    key={f.key}
                    value={f.value}
                    placeholder={f.placeholder}
                    options={f.opts}
                    onChange={(val) => setFilters({ ...filters, [f.key]: val })}
                  />
                ))}
              </div>
            </div>

            {/* List */}
            <div className="space-y-3">
              {filtered.length === 0 ? (
                <div className="rounded-2xl border border-white/5 bg-[#0c0c14]/30 py-20 text-center">
                  <p className="text-sm font-medium text-slate-500">
                    No problems found matching your filters.
                  </p>
                </div>
              ) : (
                filtered.map((p) => {
                  const isSolved = solved.some((s) => s._id === p._id);
                  return (
                    <div
                      key={p._id}
                      className="group relative flex items-center justify-between gap-4 overflow-hidden rounded-xl border border-white/[0.06] bg-[#0c0c14]/40 px-6 py-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-cyan-300/20 hover:bg-slate-900/10 hover:shadow-lg hover:shadow-cyan-950/10"
                    >
                      <div className="absolute bottom-0 left-0 top-0 w-[3px] bg-transparent transition-all group-hover:bg-gradient-to-b group-hover:from-cyan-400 group-hover:to-cyan-600" />
                      <div className="min-w-0">
                        <NavLink
                          to={`/problem/${p._id}`}
                          className="block truncate text-base font-bold text-white no-underline transition hover:text-cyan-300"
                        >
                          {p.title}
                        </NavLink>
                        <div className="mt-2 flex items-center gap-2">
                          <span
                            className={`rounded-md border px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${diffColor(p.difficulty)}`}
                          >
                            {p.difficulty}
                          </span>
                          <span className="rounded-md border border-cyan-500/10 bg-cyan-500/[0.04] px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-cyan-400">
                            {p.tags === 'linkedList' ? 'Linked List' : p.tags === 'dp' ? 'Dynamic Programming' : p.tags}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {isSolved ? (
                          <NavLink
                            to={`/problem/${p._id}`}
                            className="flex items-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1.5 text-xs font-bold text-emerald-400 no-underline transition hover:bg-emerald-500/20 hover:border-emerald-500/50 hover:text-emerald-300"
                          >
                            <Check size={12} /> Solved
                          </NavLink>
                        ) : (
                          <NavLink
                            to={`/problem/${p._id}`}
                            className="rounded-lg bg-white/5 border border-white/10 px-3.5 py-1.5 text-xs font-bold text-slate-300 no-underline transition hover:bg-white/10 hover:text-white"
                          >
                            Solve
                          </NavLink>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </main>
        </div>
      </div>
      <Footer />
    </div>
  );
}
