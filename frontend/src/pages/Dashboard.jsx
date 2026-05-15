import { NavLink } from "react-router";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import {
  Code2,
  Cpu,
  MessageSquare,
  Play,
  Video,
  History,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Terminal,
  BookOpen,
  Target,
  Trophy,
  Gauge,
} from "lucide-react";
import Navbar from "../components/ui/Navbar";
import Footer from "../components/ui/Footer";
import { ParticleTextEffect } from "../components/ui/particle-text-effect";
import { CinematicAutumnBackground } from "../components/ui/cinematic-autumn-background";

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

/* ─────────────────── Code Preview ─────────────────── */
function CodePreview() {
  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="mx-auto w-full max-w-[896px] overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md shadow-2xl shadow-black/30"
    >
      <div className="flex items-center gap-2 border-b border-white/10 bg-black/40 px-4 py-3 sm:px-5">
        <span className="h-3 w-3 rounded-full bg-red-400" />
        <span className="h-3 w-3 rounded-full bg-amber-300" />
        <span className="h-3 w-3 rounded-full bg-emerald-300" />
        <span className="ml-3 truncate font-mono text-xs text-slate-400">
          solution.js
        </span>
      </div>
      <div className="overflow-x-auto px-4 py-5 text-left sm:px-6 sm:py-6">
        <pre className="font-mono text-sm leading-7 text-slate-300 sm:text-[15px]">
          <span className="text-slate-500">{"// Two Sum — O(n) Solution"}</span>
          {"\n"}
          <span className="text-violet-400">function</span>{" "}
          <span className="text-cyan-400">twoSum</span>
          {"(nums, target) {"}
          {"\n"}
          {"  "}
          <span className="text-violet-400">const</span> map ={" "}
          <span className="text-violet-400">new</span>{" "}
          <span className="text-cyan-400">Map</span>();{"\n"}
          {"  "}
          <span className="text-violet-400">for</span> (
          <span className="text-violet-400">let</span> i ={" "}
          <span className="text-amber-400">0</span>; i {"<"} nums.length; i++){" "}
          {"{"}
          {"\n"}
          {"    "}
          <span className="text-violet-400">const</span> comp = target -
          nums[i];{"\n"}
          {"    "}
          <span className="text-violet-400">if</span> (map.
          <span className="text-cyan-400">has</span>(comp)){"\n"}
          {"      "}
          <span className="text-violet-400">return</span> [map.
          <span className="text-cyan-400">get</span>(comp), i];{"\n"}
          {"    "}map.<span className="text-cyan-400">set</span>(nums[i], i);
          {"\n"}
          {"  }"}
          {"\n"}
          {"}"}
        </pre>
      </div>
      <div className="flex flex-wrap items-center gap-3 border-t border-white/10 bg-black/40 px-4 py-3 sm:px-6">
        <span className="rounded-xl border border-cyan-300/25 bg-cyan-300/10 px-4 py-2 text-sm font-semibold text-cyan-200">
          Run Code
        </span>
        <span className="rounded-xl bg-[#67e8f9] px-4 py-2 text-sm font-extrabold text-black shadow-[0_0_10px_rgba(103,232,249,0.3)]">
          Submit
        </span>
        <span className="flex items-center gap-2 text-sm font-medium text-emerald-300 sm:ml-auto">
          <CheckCircle2 size={16} /> All tests passed
        </span>
      </div>
    </motion.div>
  );
}

/* ─────────────────── Hero ─────────────────── */
function Hero({ isAuthenticated }) {
  return (
    <section className="relative w-full py-16 sm:py-20 lg:py-24">
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="relative z-10 mx-auto flex max-w-[1152px] flex-col items-center px-4 text-center sm:px-6"
      >
        <motion.div variants={fadeInUp} className="mb-6 inline-flex items-center gap-2 rounded-full border border-red-500/20 bg-red-500/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-red-400">
          <Sparkles size={14} /> The Modern DSA Platform
        </motion.div>

        <motion.h1 variants={fadeInUp} className="max-w-[896px] text-5xl font-extrabold leading-tight text-white sm:text-6xl lg:text-7xl drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">
          Start building <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-[#67e8f9]">your future.</span>
        </motion.h1>

        <motion.p variants={fadeInUp} className="mt-6 max-w-[672px] text-base leading-7 text-slate-300 sm:text-lg">
          Join Algovia and begin your data structures and algorithms journey today. Free forever, no catch.
        </motion.p>

        <motion.div variants={fadeInUp} className="mt-9 mb-12 flex w-full flex-col items-stretch justify-center gap-3 sm:w-auto sm:flex-row sm:items-center">
          {isAuthenticated ? (
            <NavLink
              to="/problems"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#67e8f9] px-6 py-3 text-sm font-extrabold text-black shadow-[0_0_15px_rgba(103,232,249,0.5)] transition-all duration-300 hover:scale-105 hover:bg-cyan-300 no-underline"
            >
              Go to Dashboard <ArrowRight size={18} />
            </NavLink>
          ) : (
            <>
              <NavLink
                to="/signup"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#67e8f9] px-8 py-4 text-base font-extrabold text-black shadow-[0_0_20px_rgba(103,232,249,0.4)] transition-all duration-300 hover:scale-105 hover:bg-cyan-300 no-underline"
              >
                Create Free Account
              </NavLink>
              <NavLink
                to="/login"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-transparent px-6 py-3 text-sm font-semibold text-white transition-all duration-300 hover:bg-white/5 no-underline"
              >
                Sign in
              </NavLink>
            </>
          )}
        </motion.div>

        <CodePreview />
      </motion.div>
    </section>
  );
}

/* ─────────────────── Tech Bar ─────────────────── */
function TechBar() {
  return (
    <section className="relative z-10">
      <div className="mx-auto grid max-w-[1024px] grid-cols-1 gap-4 px-4 py-6 sm:grid-cols-3 sm:px-6">
        {[
          {
            icon: <Terminal size={18} />,
            label: "Judge0 Engine",
            c: "text-cyan-300",
          },
          { icon: <Cpu size={18} />, label: "Gemini AI", c: "text-red-400" },
          {
            icon: <Code2 size={18} />,
            label: "Monaco Editor",
            c: "text-emerald-300",
          },
        ].map((t) => (
          <div
            key={t.label}
            className="flex items-center justify-center gap-3 text-sm font-semibold text-slate-300 sm:text-base"
          >
            <span className={t.c}>{t.icon}</span> {t.label}
          </div>
        ))}
      </div>
    </section>
  );
}

/* ─────────────────── Features ─────────────────── */
function Features() {
  const features = [
    {
      icon: <Code2 size={24} />,
      title: "VS Code Editor",
      desc: "Write code in a fully-featured Monaco editor with syntax highlighting, autocomplete, and live error detection.",
    },
    {
      icon: <Play size={24} />,
      title: "Instant Execution",
      desc: "Run your code against visible test cases and get instant pass/fail feedback before doing a final submission.",
    },
    {
      icon: <MessageSquare size={24} />,
      title: "AI Chat Assistant",
      desc: "Stuck on a problem? Get contextual hints, code reviews, and approach suggestions directly from Gemini AI.",
    },
    {
      icon: <Video size={24} />,
      title: "Video Editorials",
      desc: "Watch step-by-step video solutions explaining the thought process and optimal approach for complex problems.",
    },
    {
      icon: <History size={24} />,
      title: "Submission Tracking",
      desc: "Keep track of all your past submissions with status, runtime, and memory usage metrics for every problem.",
    },
    {
      icon: <Sparkles size={24} />,
      title: "Smart Filters",
      desc: "Filter problems by difficulty, tags, and solved status so you can focus exactly on what matters most.",
    },
  ];

  return (
    <section className="relative z-10 w-full py-16 sm:py-20 lg:py-24">
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="mx-auto max-w-[1152px] px-4 sm:px-6"
      >
        <motion.div variants={fadeInUp} className="mb-12 text-center">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-[#67e8f9]">
            Features
          </p>
          <h2 className="text-3xl font-extrabold leading-tight text-white sm:text-4xl">
            Built for serious coders
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <motion.div
              variants={fadeInUp}
              key={f.title}
              className="group rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-6 transition-all duration-300 hover:border-[#67e8f9]/50 hover:shadow-[0_0_20px_rgba(103,232,249,0.15)] hover:bg-white/10"
            >
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-[#67e8f9]/10 text-[#67e8f9]">
                {f.icon}
              </div>
              <h3 className="mb-3 text-lg font-bold text-white">{f.title}</h3>
              <p className="text-sm leading-6 text-slate-300">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

function LearningTracks() {
  const tracks = [
    {
      icon: <BookOpen size={22} />,
      title: "Structured topics",
      desc: "Move from arrays and strings into recursion, graphs, dynamic programming, and system-style problem solving.",
    },
    {
      icon: <Target size={22} />,
      title: "Focused practice",
      desc: "Use difficulty and tag filters to build short daily sets instead of scrolling through a long problem list.",
    },
    {
      icon: <Gauge size={22} />,
      title: "Fast feedback",
      desc: "Run sample tests before submitting, then review status, runtime, memory, and previous attempts.",
    },
    {
      icon: <Trophy size={22} />,
      title: "Interview readiness",
      desc: "Track solved questions and revisit weak areas so your preparation feels measurable.",
    },
  ];

  return (
    <section className="relative z-10 w-full py-16 sm:py-20 lg:py-24">
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="mx-auto max-w-[1152px] px-4 sm:px-6"
      >
        <motion.div variants={fadeInUp} className="mx-auto mb-12 max-w-[768px] text-center flex flex-col items-center">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-red-400">
            Practice system
          </p>
          <h2 className="text-3xl font-extrabold leading-tight text-white sm:text-4xl">
            Everything you need after signup
          </h2>
          <p className="mt-4 text-base leading-7 text-slate-300">
            Algovia should feel like a real coding workspace: choose a topic,
            solve in the editor, use hints carefully, and keep a clean record of
            progress.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {tracks.map((track) => (
            <motion.article
              variants={fadeInUp}
              key={track.title}
              className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-6 text-left transition-all duration-300 hover:border-red-500/50 hover:shadow-[0_0_20px_rgba(239,68,68,0.15)] hover:bg-white/10"
            >
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-red-500/10 text-red-400">
                {track.icon}
              </div>
              <h3 className="text-lg font-bold text-white">{track.title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                {track.desc}
              </p>
            </motion.article>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

/* ─────────────────── How It Works ─────────────────── */
function HowItWorks() {
  const steps = [
    {
      n: "1",
      title: "Create an account",
      desc: "Sign up with your email. Verify with a one-time code.",
    },
    {
      n: "2",
      title: "Pick a challenge",
      desc: "Browse problems by difficulty or topic like Arrays and DP.",
    },
    {
      n: "3",
      title: "Solve & submit",
      desc: "Write code, run tests, ask AI for hints, and submit.",
    },
  ];

  return (
    <section className="relative z-10 w-full py-16 sm:py-20 lg:py-24">
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="mx-auto max-w-[1152px] px-4 text-center sm:px-6"
      >
        <motion.p variants={fadeInUp} className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-[#67e8f9]">
          Workflow
        </motion.p>
        <motion.h2 variants={fadeInUp} className="mb-12 text-3xl font-extrabold leading-tight text-white sm:text-4xl">
          Three steps to mastery
        </motion.h2>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {steps.map((s, index) => (
            <motion.div
              variants={fadeInUp}
              key={s.n}
              className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-6 transition-all duration-300 hover:border-[#67e8f9]/50 hover:shadow-[0_0_20px_rgba(103,232,249,0.15)] hover:bg-white/10"
            >
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: index * 0.5 }}
                className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-[#67e8f9] text-lg font-black text-black shadow-[0_0_15px_rgba(103,232,249,0.4)]"
              >
                {s.n}
              </motion.div>
              <h3 className="mb-3 text-xl font-bold text-white">{s.title}</h3>
              <p className="text-sm leading-6 text-slate-300">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

/* ─────────────────── CTA ─────────────────── */
function CTA() {
  return (
    <section className="relative z-10 w-full py-16 sm:py-20 lg:py-24">
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="mx-auto max-w-[896px] px-4 text-center sm:px-6"
      >
        <motion.h2 variants={fadeInUp} className="text-3xl font-extrabold leading-tight text-white sm:text-4xl">
          Ready to level up?
        </motion.h2>
        <motion.p variants={fadeInUp} className="mx-auto mt-4 mb-8 max-w-[576px] text-base leading-7 text-slate-300">
          Join Algovia and begin your data structures and algorithms journey
          today. Free forever, no catch.
        </motion.p>
        <motion.div variants={fadeInUp}>
          <NavLink
            to="/signup"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#67e8f9] px-8 py-4 text-base font-extrabold text-black shadow-[0_0_15px_rgba(103,232,249,0.5)] transition-all duration-300 hover:scale-105 hover:bg-cyan-300 no-underline"
          >
            Create Free Account
          </NavLink>
        </motion.div>
      </motion.div>
    </section>
  );
}

function FinalDetails() {
  const details = [
    "Email verification keeps accounts clean before users enter the problem dashboard.",
    "The editor-first flow helps users focus on solving, testing, and submitting without clutter.",
    "The 404 and auth pages now share the same visual language as the main dashboard.",
  ];

  return (
    <section className="relative z-10 w-full py-16 sm:py-20">
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="mx-auto max-w-[1024px] px-4 text-center sm:px-6"
      >
        <motion.p variants={fadeInUp} className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-[#67e8f9]">
          Platform notes
        </motion.p>
        <motion.h2 variants={fadeInUp} className="text-3xl font-extrabold leading-tight text-white sm:text-4xl">
          Clean pages, consistent flow
        </motion.h2>
        <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-3">
          {details.map((detail) => (
            <motion.div
              variants={fadeInUp}
              key={detail}
              className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-5 text-sm leading-6 text-slate-300 transition-all duration-300 hover:border-white/20 hover:bg-white/10"
            >
              {detail}
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

/* ─────────────────── Dashboard Page ─────────────────── */
export default function Dashboard() {
  const { isAuthenticated } = useSelector((state) => state.auth);

  return (
    <div className="relative min-h-screen bg-[#030000] text-slate-200 selection:bg-red-500/30">
      <CinematicAutumnBackground />
      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar isAuthenticated={isAuthenticated} />
        <Hero isAuthenticated={isAuthenticated} />
        <TechBar />
        <section className="relative z-10 w-full py-16 sm:py-24">
          <ParticleTextEffect words={["ALGOVIA", "MASTER", "DATA", "STRUCTURES", "AND", "ALGORITHMS"]} />
        </section>
        <Features />
        <LearningTracks />
        <HowItWorks />
        <FinalDetails />
        {!isAuthenticated && <CTA />}
        <Footer />
      </div>
    </div>
  );
}
