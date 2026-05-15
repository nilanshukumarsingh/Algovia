import { useEffect, useState } from "react";
import { NavLink } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import axiosClient from "../utils/axiosClient";
import { logoutUser } from "../authSlice";
import Navbar from "../components/ui/Navbar";
import { PageBackground } from "../components/ui/Primitives";
import { ChevronDown, Check, LogOut, Shield } from "lucide-react";

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
    <div className="min-h-screen bg-[#07080d] text-slate-200">
      <PageBackground />
      <Navbar isAuthenticated rightSlot={userMenu} />

      <div className="relative z-10 mx-auto max-w-[1120px] px-6 py-12">
        {/* Header */}
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-white md:text-3xl">
              Problem Set
            </h1>
            <p className="mt-1.5 text-sm text-slate-500">
              Pick a challenge and start solving.
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3">
            {[
              {
                key: "status",
                value: filters.status,
                opts: [
                  ["all", "All Status"],
                  ["solved", "Solved"],
                ],
              },
              {
                key: "difficulty",
                value: filters.difficulty,
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
                opts: [
                  ["all", "All Tags"],
                  ["array", "Array"],
                  ["linkedList", "Linked List"],
                  ["graph", "Graph"],
                  ["dp", "DP"],
                ],
              },
            ].map((f) => (
              <select
                key={f.key}
                value={f.value}
                onChange={(e) =>
                  setFilters({ ...filters, [f.key]: e.target.value })
                }
                className="cursor-pointer appearance-none rounded-xl border border-white/10 bg-[#0c0c14] px-4 py-2.5 text-sm font-medium text-slate-400 outline-none transition hover:border-cyan-300/30 focus:border-cyan-300/50"
              >
                {f.opts.map(([v, l]) => (
                  <option key={v} value={v}>
                    {l}
                  </option>
                ))}
              </select>
            ))}
          </div>
        </div>

        {/* List */}
        <div className="space-y-3">
          {filtered.length === 0 ? (
            <div className="rounded-2xl border border-white/5 bg-[#0c0c14] py-24 text-center">
              <p className="text-sm font-medium text-slate-500">
                No problems found matching your filters.
              </p>
            </div>
          ) : (
            filtered.map((p) => (
              <div
                key={p._id}
                className="group relative flex items-center justify-between gap-4 overflow-hidden rounded-xl border border-white/[0.06] bg-[#0c0c14] px-6 py-5 transition-all hover:-translate-y-0.5 hover:border-cyan-300/20 hover:shadow-lg hover:shadow-cyan-950/20"
              >
                <div className="absolute bottom-0 left-0 top-0 w-[3px] bg-transparent transition-all group-hover:bg-gradient-to-b group-hover:from-cyan-400 group-hover:to-cyan-600" />
                <div className="min-w-0">
                  <NavLink
                    to={`/problem/${p._id}`}
                    className="block truncate text-[15px] font-bold text-white no-underline transition hover:text-cyan-300"
                  >
                    {p.title}
                  </NavLink>
                  <div className="mt-2.5 flex gap-2">
                    <span
                      className={`rounded-md border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${diffColor(p.difficulty)}`}
                    >
                      {p.difficulty}
                    </span>
                    <span className="rounded-md border border-cyan-500/15 bg-cyan-500/[0.08] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-cyan-500">
                      {p.tags}
                    </span>
                  </div>
                </div>
                {solved.some((s) => s._id === p._id) && (
                  <span className="flex flex-shrink-0 items-center gap-1.5 rounded-lg border border-emerald-500/20 bg-emerald-500/[0.08] px-3 py-1.5 text-xs font-bold text-emerald-400">
                    <Check size={14} /> Solved
                  </span>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
