import { useEffect, useState, useRef } from "react";
import { NavLink } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import axiosClient from "../utils/axiosClient";
import { logoutUser } from "../authSlice";
import Navbar from "../components/ui/Navbar";
import Footer from "../components/ui/Footer";
import { CinematicAutumnBackground } from "../components/ui/cinematic-autumn-background";
import { 
  ChevronDown, 
  ChevronLeft,
  ChevronRight,
  Search,
  ExternalLink,
  Check, 
  LogOut, 
  Shield, 
  Sparkles, 
  Award, 
  Flame, 
  Cpu, 
  Code2, 
  ArrowRight, 
  BookOpen, 
  Terminal, 
  Activity, 
  User, 
  Hourglass 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

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
        className="flex items-center justify-between w-40 rounded-xl border border-white/10 bg-black/50 px-4 py-2.5 text-xs font-semibold text-slate-300 transition hover:border-cyan-300/30 hover:bg-white/[0.02] focus:border-cyan-300/50 outline-none backdrop-blur-md"
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
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 5;

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

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handleSearchChange = (query) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const filtered = problems.filter((p) => {
    if (filters.difficulty !== "all" && p.difficulty !== filters.difficulty)
      return false;
    if (filters.tag !== "all" && p.tags !== filters.tag) return false;
    if (filters.status === "solved" && !solved.some((s) => s._id === p._id))
      return false;
    if (searchQuery && !p.title.toLowerCase().includes(searchQuery.toLowerCase()))
      return false;
    return true;
  });

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedProblems = filtered.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const diffColor = (d) =>
    d === "easy"
      ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
      : d === "medium"
        ? "border-amber-500/20 bg-amber-500/10 text-amber-400"
        : d === "hard"
          ? "border-red-500/20 bg-red-500/10 text-red-400"
          : "border-slate-500/20 bg-slate-500/10 text-slate-400";

  // Dynamic recommendation logic
  const unsolvedProblems = problems.filter(p => !solved.some(s => s._id === p._id));
  const recommendedProblem = unsolvedProblems[0] || problems[0];

  // Daily Challenge logic
  const dailyChallenge = problems.find(p => p.title === "Valid Parentheses") || problems[0];

  /* User menu button for the navbar */
  const userMenu = (
    <div className="relative">
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 text-sm font-semibold text-slate-300 transition hover:bg-white/[0.06] backdrop-blur-md"
      >
        <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-400 to-cyan-600 text-[10px] font-black text-slate-950">
          {user?.firstName?.[0]?.toUpperCase()}
        </div>
        {user?.firstName}
        <ChevronDown size={14} className="text-slate-500" />
      </button>

      {menuOpen && (
        <div className="absolute right-0 top-full z-50 mt-2 w-44 overflow-hidden rounded-xl border border-white/[0.08] bg-[#12141c] shadow-2xl shadow-black/50 backdrop-blur-xl">
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
    <div className="min-h-screen flex flex-col bg-[#030000] text-slate-200 overflow-x-hidden">
      <CinematicAutumnBackground />
      
      {/* Ambient glow */}
      <div className="pointer-events-none absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-rose-500/5 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-1/4 right-1/4 h-[500px] w-[500px] rounded-full bg-cyan-500/5 blur-[120px]" />

      <Navbar isAuthenticated rightSlot={userMenu} />

      <div className="relative z-10 mx-auto w-full max-w-[1140px] px-6 py-10 flex-grow">
        <div className="flex flex-col gap-8 lg:flex-row">
          
          {/* Left Side: Stats and Progress */}
          <aside className="w-full lg:w-1/3 flex flex-col gap-6 lg:sticky lg:top-24 lg:self-start">
            
            {/* User Profile Summary */}
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
              className="rounded-3xl border border-white/[0.06] bg-black/40 p-6 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.6)] backdrop-blur-xl"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-rose-500 to-rose-600 font-extrabold text-white shadow-lg shadow-rose-950/40">
                  {user?.firstName?.[0]?.toUpperCase()}
                </div>
                <div>
                  <h2 className="text-lg font-extrabold text-white">Hello, {user?.firstName || 'Developer'}!</h2>
                  <p className="text-xs text-slate-500">Ready for today's challenge?</p>
                </div>
              </div>

              {/* Streaks & Ranks Info (Gamified) */}
              <div className="mt-5 border-t border-white/5 pt-4 grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500">
                    <Flame size={16} className="animate-pulse" />
                  </div>
                  <div>
                    <span className="block text-[10px] text-slate-500 uppercase font-bold tracking-wider">Streak</span>
                    <span className="text-xs font-extrabold text-white">4 Days</span>
                  </div>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400">
                    <Award size={16} />
                  </div>
                  <div>
                    <span className="block text-[10px] text-slate-500 uppercase font-bold tracking-wider">Rank</span>
                    <span className="text-xs font-extrabold text-white">#1,204</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Overall Progress */}
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
              className="rounded-3xl border border-white/[0.06] bg-black/40 p-6 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.6)] backdrop-blur-xl"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-slate-300">Overall Progress</span>
                <span className="text-xs font-black text-cyan-400">{solved.length}/{problems.length} Solved</span>
              </div>
              <div className="mt-3.5 h-2 w-full rounded-full bg-white/5 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-cyan-400 to-cyan-500 transition-all duration-500" 
                  style={{ width: `${problems.length > 0 ? (solved.length / problems.length) * 100 : 0}%` }}
                />
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2.5 text-center text-xs">
                <div className="rounded-xl bg-emerald-500/5 border border-emerald-500/10 p-2.5">
                  <span className="block font-black text-emerald-400">
                    {solved.filter(p => p.difficulty === 'easy').length}/{problems.filter(p => p.difficulty === 'easy').length}
                  </span>
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Easy</span>
                </div>
                <div className="rounded-xl bg-amber-500/5 border border-amber-500/10 p-2.5">
                  <span className="block font-black text-amber-400">
                    {solved.filter(p => p.difficulty === 'medium').length}/{problems.filter(p => p.difficulty === 'medium').length}
                  </span>
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Medium</span>
                </div>
                <div className="rounded-xl bg-red-500/5 border border-red-500/10 p-2.5">
                  <span className="block font-black text-red-400">
                    {solved.filter(p => p.difficulty === 'hard').length}/{problems.filter(p => p.difficulty === 'hard').length}
                  </span>
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Hard</span>
                </div>
              </div>
            </motion.div>

            {/* Topics Covered */}
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
              className="rounded-3xl border border-white/[0.06] bg-black/40 p-6 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.6)] backdrop-blur-xl"
            >
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Topics Covered</h3>
              <div className="space-y-4">
                {[
                  { name: "Array", tag: "array", color: "from-cyan-400 to-cyan-600", total: problems.filter(p => p.tags === 'array').length },
                  { name: "Linked List", tag: "linkedList", color: "from-indigo-400 to-indigo-600", total: problems.filter(p => p.tags === 'linkedList').length },
                  { name: "Graph", tag: "graph", color: "from-pink-400 to-pink-600", total: problems.filter(p => p.tags === 'graph').length },
                  { name: "Dynamic Programming", tag: "dp", color: "from-rose-400 to-rose-600", total: problems.filter(p => p.tags === 'dp').length },
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
            </motion.div>

            {/* Recent Activity */}
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
              className="rounded-3xl border border-white/[0.06] bg-black/40 p-6 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.6)] backdrop-blur-xl"
            >
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-1.5">
                <Activity size={14} /> Recent Submissions
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs border-b border-white/5 pb-2.5">
                  <div>
                    <p className="font-bold text-white">Two Sum</p>
                    <p className="text-[10px] text-slate-500">JavaScript &bull; 4ms</p>
                  </div>
                  <span className="text-[10px] font-black text-emerald-400">Accepted</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <div>
                    <p className="font-bold text-white">Binary Search</p>
                    <p className="text-[10px] text-slate-500">C++ &bull; 12ms</p>
                  </div>
                  <span className="text-[10px] font-black text-red-400">Time Limit</span>
                </div>
              </div>
            </motion.div>

            {/* Quick Reference / Developer Tips */}
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
              className="rounded-3xl border border-rose-500/10 bg-rose-500/[0.01] p-6 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.6)] backdrop-blur-xl relative overflow-hidden text-left"
            >
              <h3 className="text-xs font-bold uppercase tracking-wider text-rose-400 mb-4 flex items-center gap-1.5">
                <BookOpen size={14} /> Developer Quick Notes
              </h3>
              <ul className="space-y-3 text-xs text-slate-450 pl-0 list-none">
                <li className="flex items-start gap-2">
                  <span className="text-rose-400 mt-1">&bull;</span>
                  <span><strong>Complexity:</strong> Aim for O(N) or O(log N) for arrays. Avoid O(N²) nested loops.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-400 mt-1">&bull;</span>
                  <span><strong>Edge Cases:</strong> Always handle empty inputs, single elements, and integer overflows.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-400 mt-1">&bull;</span>
                  <span><strong>Gemini AI:</strong> Stuck? Click the AI Chat tab inside the problem editor for a quick hint.</span>
                </li>
              </ul>
            </motion.div>

            {/* DSA Learning Resources */}
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
              className="rounded-3xl border border-cyan-500/10 bg-cyan-500/[0.01] p-6 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.6)] backdrop-blur-xl relative overflow-hidden text-left"
            >
              <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-400 mb-4 flex items-center gap-1.5">
                <Code2 size={14} /> DSA Learning Resources
              </h3>
              <p className="text-[11px] text-slate-400 mb-4 leading-relaxed">
                Hand-picked high-quality platforms to master algorithms and data structures.
              </p>
              <div className="space-y-3">
                {[
                  {
                    name: "Visualgo.net",
                    desc: "Visualize data structures & algorithms through animation.",
                    url: "https://visualgo.net"
                  },
                  {
                    name: "NeetCode.io",
                    desc: "Sleek practice roadmaps, coding problems, & clean video solutions.",
                    url: "https://neetcode.io"
                  },
                  {
                    name: "GeeksforGeeks",
                    desc: "A massive library of computer science tutorials & documentation.",
                    url: "https://geeksforgeeks.org"
                  },
                  {
                    name: "Roadmap.sh (CS)",
                    desc: "Visual roadmap guiding you through the computer science core.",
                    url: "https://roadmap.sh/computer-science"
                  }
                ].map((res) => (
                  <a
                    key={res.name}
                    href={res.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex flex-col gap-1 rounded-2xl border border-white/[0.04] bg-white/[0.01] p-3 text-xs no-underline transition-all duration-300 hover:border-cyan-500/20 hover:bg-[#070b12]/30"
                  >
                    <div className="flex items-center justify-between font-bold text-slate-200 group-hover:text-cyan-300 transition-colors">
                      <span className="flex items-center gap-1">
                        {res.name}
                      </span>
                      <ExternalLink size={12} className="opacity-50 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <span className="text-[10px] text-slate-500 leading-normal">{res.desc}</span>
                  </a>
                ))}
              </div>
            </motion.div>
          </aside>

          {/* Right Side: Filters & Problem Grid */}
          <main className="w-full lg:w-2/3 flex flex-col gap-6">
            
            {/* Top Widget Layout (Daily Challenge & AI Coach) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Daily Challenge Card */}
              {dailyChallenge && (
                <motion.div 
                  initial="hidden"
                  animate="visible"
                  variants={fadeInUp}
                  className="rounded-3xl border border-rose-500/20 bg-rose-500/[0.02] p-5 shadow-lg relative overflow-hidden backdrop-blur-xl"
                >
                  <div className="absolute top-0 right-0 p-3 text-rose-500/10 pointer-events-none">
                    <Sparkles size={80} />
                  </div>
                  <div className="flex items-center gap-1.5 text-rose-400 font-extrabold text-xs uppercase tracking-wider">
                    <Award size={14} /> Daily Challenge
                  </div>
                  <h3 className="mt-2 text-base font-black text-white">{dailyChallenge.title}</h3>
                  <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                    Test your logic. Earn extra XP points.
                  </p>
                  <div className="mt-5 flex items-center justify-between">
                    <span className="text-[10px] font-black px-2 py-0.5 rounded border border-rose-500/30 bg-rose-500/10 text-rose-300">
                      +15 Points
                    </span>
                    <NavLink 
                      to={`/problem/${dailyChallenge._id}`} 
                      className="text-xs font-black text-black bg-white hover:bg-slate-200 transition px-3.5 py-1.5 rounded-xl no-underline flex items-center gap-1 shadow-md shadow-black/30"
                    >
                      Solve Now <ArrowRight size={12} />
                    </NavLink>
                  </div>
                </motion.div>
              )}

              {/* AI Coach Card */}
              {recommendedProblem && (
                <motion.div 
                  initial="hidden"
                  animate="visible"
                  variants={fadeInUp}
                  className="rounded-3xl border border-white/[0.06] bg-black/40 p-5 relative overflow-hidden backdrop-blur-xl"
                >
                  <div className="flex items-center gap-1.5 text-cyan-400 font-extrabold text-xs uppercase tracking-wider mb-2.5">
                    <Cpu size={14} /> AI Recommendation
                  </div>
                  <div className="flex gap-3 items-start bg-cyan-950/10 border border-cyan-500/10 rounded-2xl p-3.5">
                    <div className="h-6 w-6 rounded-lg bg-cyan-400/10 text-cyan-400 flex items-center justify-center shrink-0 mt-0.5 border border-cyan-400/10">
                      <Sparkles size={11} />
                    </div>
                    <div>
                      <p className="text-xs font-extrabold text-cyan-300">"Learn by Topic"</p>
                      <p className="mt-1 text-[11px] leading-relaxed text-slate-400">
                        Based on your progress, I recommend solving <strong className="text-white">{recommendedProblem.title}</strong> to strengthen your concepts.
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Header and filters */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b border-white/5 pb-4 mt-2">
              <div>
                <h1 className="text-2xl font-extrabold tracking-tight text-white">Problem Set</h1>
                <p className="mt-1 text-xs text-slate-400">Choose a challenge and start coding.</p>
              </div>

              {/* Search and Filters */}
              <div className="flex flex-col sm:flex-row gap-3 items-center w-full md:w-auto">
                {/* Search Bar */}
                <div className="relative w-full sm:w-64 shadow-lg">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    placeholder="Search problems..."
                    className="w-full h-10 pl-9 pr-4 bg-black/50 border border-white/10 rounded-xl outline-none text-xs text-white placeholder-slate-500 focus:border-rose-500/30 transition backdrop-blur-md"
                  />
                </div>

                {/* Filters */}
                <div className="flex flex-wrap gap-2 w-full sm:w-auto justify-end">
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
                      onChange={(val) => handleFilterChange({ ...filters, [f.key]: val })}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* List */}
            <div className="space-y-3">
              {filtered.length === 0 ? (
                <div className="rounded-3xl border border-white/5 bg-black/40 py-20 text-center backdrop-blur-xl">
                  <p className="text-sm font-medium text-slate-500">
                    No problems found matching your filters.
                  </p>
                </div>
              ) : (
                paginatedProblems.map((p) => {
                  const isSolved = solved.some((s) => s._id === p._id);
                  return (
                    <motion.div
                      layoutId={p._id}
                      key={p._id}
                      className="group relative flex items-center justify-between gap-6 overflow-hidden rounded-3xl border border-white/[0.06] bg-black/40 p-5 sm:p-6 transition-all duration-300 hover:-translate-y-1 hover:border-rose-500/20 hover:bg-[#070101]/30 hover:shadow-[0_15px_35px_rgba(0,0,0,0.6)]"
                    >
                      <div className="absolute bottom-0 left-0 top-0 w-[3px] bg-transparent transition-all group-hover:bg-gradient-to-b group-hover:from-rose-500 group-hover:to-rose-600" />
                      <div className="min-w-0 text-left flex-1">
                        <NavLink
                          to={`/problem/${p._id}`}
                          className="block truncate text-lg sm:text-xl font-black text-white no-underline transition-all duration-300 group-hover:text-rose-400 group-hover:translate-x-0.5"
                        >
                          {p.title}
                        </NavLink>
                        
                        {/* Custom descriptions for each problem */}
                        <p className="mt-1.5 text-xs text-slate-500 line-clamp-1 leading-relaxed">
                          {p.title === "Two Sum" && "Find two numbers in an array that sum up to a specific target value."}
                          {p.title === "Valid Parentheses" && "Validate string brackets closure using a stack data structure."}
                          {p.title === "Reverse Linked List" && "Reverse a singly linked list in-place with O(1) extra memory."}
                          {p.title === "Binary Search" && "Find the index of a target element in a sorted array in O(log n) time."}
                          {p.title === "Climbing Stairs" && "Find the number of distinct ways to climb a staircase of n steps."}
                          {p.title === "Merge Two Sorted Lists" && "Merge two sorted linked lists into a single sorted list."}
                          {p.title === "Course Schedule" && "Determine if you can finish all courses given prerequisite dependencies."}
                          {p.title === "House Robber" && "Maximize the amount of money you can rob from houses along a street without alerting security."}
                          {p.title === "Best Time to Buy and Sell Stock" && "Find the best day to buy and sell stock to maximize profit."}
                          {p.title === "Longest Substring Without Repeating Characters" && "Find the length of the longest substring without repeating characters."}
                          {p.title === "Linked List Cycle" && "Determine if a linked list contains a cycle."}
                          {!["Two Sum", "Valid Parentheses", "Reverse Linked List", "Binary Search", "Climbing Stairs", "Merge Two Sorted Lists", "Course Schedule", "House Robber", "Best Time to Buy and Sell Stock", "Longest Substring Without Repeating Characters", "Linked List Cycle"].includes(p.title) && "Practice and solve this curated algorithm challenge with AI assistance."}
                        </p>

                        <div className="mt-3.5 flex flex-wrap items-center gap-2">
                          <span
                            className={`rounded-lg border px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-wider ${diffColor(p.difficulty)}`}
                          >
                            {p.difficulty}
                          </span>
                          <span className="rounded-lg border border-rose-500/10 bg-rose-500/[0.04] px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-wider text-rose-400">
                            {p.tags === 'linkedList' ? 'Linked List' : p.tags === 'dp' ? 'Dynamic Programming' : p.tags}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        {isSolved ? (
                          <NavLink
                            to={`/problem/${p._id}`}
                            className="flex items-center gap-1.5 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-5 py-2.5 text-xs font-black text-emerald-400 no-underline transition hover:bg-emerald-500/20 hover:border-emerald-500/30"
                          >
                            <Check size={14} /> Solved
                          </NavLink>
                        ) : (
                          <NavLink
                            to={`/problem/${p._id}`}
                            className="rounded-2xl bg-white/5 border border-white/10 px-5 py-2.5 text-xs font-black text-slate-300 no-underline transition-all duration-300 hover:bg-white hover:text-black hover:border-white hover:shadow-[0_0_15px_rgba(255,255,255,0.25)] flex items-center gap-1 shrink-0"
                          >
                            Solve <ArrowRight size={14} />
                          </NavLink>
                        )}
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-1.5 mt-6 py-2">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((c) => Math.max(1, c - 1))}
                  className={`flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-black/50 text-slate-405 transition-all duration-300
                    ${currentPage === 1 
                      ? 'opacity-40 cursor-not-allowed' 
                      : 'hover:border-rose-500/30 hover:bg-rose-500/10 hover:text-rose-400'}`}
                >
                  <ChevronLeft size={16} />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                  const isCurrent = page === currentPage;
                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`h-9 w-9 rounded-xl text-xs font-black transition-all duration-300 border
                        ${isCurrent
                          ? 'border-rose-500/20 bg-rose-500/10 text-rose-400'
                          : 'border-white/5 bg-black/30 text-slate-400 hover:border-white/10 hover:bg-white/5 hover:text-white'}`}
                    >
                      {page}
                    </button>
                  );
                })}

                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((c) => Math.min(totalPages, c + 1))}
                  className={`flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-black/50 text-slate-405 transition-all duration-300
                    ${currentPage === totalPages 
                      ? 'opacity-40 cursor-not-allowed' 
                      : 'hover:border-rose-500/30 hover:bg-rose-500/10 hover:text-rose-400'}`}
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
      <Footer />
    </div>
  );
}
