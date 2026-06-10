import { NavLink } from "react-router";
import { useSelector } from "react-redux";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import {
  Code2,
  Cpu,
  MessageSquare,
  Play,
  Video,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Terminal,
  Zap,
  Shield,
  Users,
  BookOpen,
} from "lucide-react";
import Navbar from "../components/ui/Navbar";
import Footer from "../components/ui/Footer";
import { ParticleTextEffect } from "../components/ui/particle-text-effect";
import { CinematicAutumnBackground } from "../components/ui/cinematic-autumn-background";

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12 } },
};

/* ─────────────────── Glow Button ─────────────────── */
function GlowButton({ to, children, variant = "primary", className = "" }) {
  const base = "group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-2xl px-8 py-4 text-base font-extrabold transition-all duration-300 hover:scale-[1.03] no-underline";
  const styles = {
    primary: `${base} bg-white text-black hover:shadow-[0_0_30px_rgba(255,255,255,0.25)] ${className}`,
    ghost: `${base} border border-white/15 bg-white/5 text-white backdrop-blur-sm hover:border-white/30 hover:bg-white/10 ${className}`,
  };

  return (
    <NavLink to={to} className={styles[variant]}>
      {/* Shine sweep */}
      <div className="pointer-events-none absolute inset-0 flex h-full w-full justify-center [transform:skew(-12deg)_translateX(-200%)] group-hover:duration-1000 group-hover:[transform:skew(-12deg)_translateX(200%)]">
        <div className="relative h-full w-8 bg-black/10" />
      </div>
      <span className="relative flex items-center gap-2">{children}</span>
    </NavLink>
  );
}

/* ─────────────────── Code Preview ─────────────────── */
function CodePreview() {
  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="mx-auto w-full max-w-[896px] overflow-hidden rounded-2xl border border-white/10 bg-black/60 backdrop-blur-xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)]"
    >
      <div className="flex items-center gap-2 border-b border-white/10 bg-white/[0.02] px-4 py-3 sm:px-5">
        <span className="h-3 w-3 rounded-full bg-red-400/80" />
        <span className="h-3 w-3 rounded-full bg-amber-300/80" />
        <span className="h-3 w-3 rounded-full bg-emerald-300/80" />
        <span className="ml-3 truncate font-mono text-xs text-slate-500">
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
      <div className="flex flex-wrap items-center gap-3 border-t border-white/10 bg-white/[0.02] px-4 py-3 sm:px-6">
        <span className="cursor-default select-none rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-400">
          Run Code
        </span>
        <span className="cursor-default select-none rounded-xl bg-white/90 px-4 py-2 text-sm font-extrabold text-black">
          Submit
        </span>
        <span className="flex items-center gap-2 text-sm font-medium text-emerald-400 sm:ml-auto">
          <CheckCircle2 size={16} /> All tests passed
        </span>
      </div>
    </motion.div>
  );
}

/* ─────────────────── Hero ─────────────────── */
function Hero({ isAuthenticated }) {
  return (
    <section className="relative w-full py-20 sm:py-28 lg:py-32">
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="relative z-10 mx-auto flex max-w-[1152px] flex-col items-center px-4 text-center sm:px-6"
      >
        <motion.div variants={fadeInUp} className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-slate-400 backdrop-blur-sm">
          <Sparkles size={14} className="text-red-400" /> The Modern DSA Platform
        </motion.div>

        <motion.h1 variants={fadeInUp} className="max-w-[896px] text-5xl font-extrabold leading-[1.1] text-white sm:text-6xl lg:text-7xl">
          Start building{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-rose-400 to-cyan-400">
            your future.
          </span>
        </motion.h1>

        <motion.p variants={fadeInUp} className="mt-6 max-w-[600px] text-base leading-relaxed text-slate-400 sm:text-lg">
          Join Algovia and begin your data structures and algorithms journey today. Free forever, no catch.
        </motion.p>

        <motion.div variants={fadeInUp} className="mt-10 mb-16 flex w-full flex-col items-stretch justify-center gap-3 sm:w-auto sm:flex-row sm:items-center">
          {isAuthenticated ? (
            <GlowButton to="/problems">
              Go to Dashboard <ArrowRight size={18} />
            </GlowButton>
          ) : (
            <>
              <GlowButton to="/signup">
                Get Started Free <ArrowRight size={18} />
              </GlowButton>
              <GlowButton to="/login" variant="ghost">
                Sign in
              </GlowButton>
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
          { icon: <Terminal size={18} />, label: "Judge0 Engine", c: "text-cyan-400" },
          { icon: <Cpu size={18} />, label: "Gemini AI", c: "text-red-400" },
          { icon: <Code2 size={18} />, label: "Monaco Editor", c: "text-emerald-400" },
        ].map((t) => (
          <div key={t.label} className="flex items-center justify-center gap-3 text-sm font-semibold text-slate-500 sm:text-base">
            <span className={t.c}>{t.icon}</span> {t.label}
          </div>
        ))}
      </div>
    </section>
  );
}

/* ─────────────────── Languages Marquee ─────────────────── */
function LanguagesMarquee() {
  const languages = ["C++", "Java", "Python", "JavaScript", "TypeScript", "Go", "Rust", "Swift", "Kotlin", "Ruby", "C#"];
  return (
    <section className="relative z-10 w-full py-16 overflow-hidden">
      <div className="mx-auto max-w-[1152px] px-4 text-center mb-10">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-600">
          Solve in any language
        </p>
      </div>
      <div className="flex overflow-hidden relative">
        <div className="absolute inset-y-0 left-0 w-40 bg-gradient-to-r from-[#030000] to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-40 bg-gradient-to-l from-[#030000] to-transparent z-10 pointer-events-none" />
        <motion.div
          className="flex w-max items-center gap-16 pr-16"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 30, ease: "linear", repeat: Infinity }}
        >
          {[...languages, ...languages].map((lang, i) => (
            <span key={i} className="whitespace-nowrap text-3xl font-black text-white/[0.06] uppercase tracking-widest select-none sm:text-4xl">
              {lang}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ─────────────────── Feature Showcase (alternating split) ─────────────────── */
function FeatureShowcase() {
  const features = [
    {
      tag: "Editor",
      title: "A code editor that gets out of your way",
      desc: "Built on Monaco — the same engine behind VS Code. Syntax highlighting, autocomplete, live error markers, and intelligent formatting across all major languages.",
      icon: <Code2 className="h-6 w-6" />,
      color: "cyan",
      visual: (
        <div className="relative w-full h-full min-h-[280px] rounded-2xl border border-white/10 bg-black/60 overflow-hidden">
          <div className="bg-white/[0.02] h-9 flex items-center px-4 border-b border-white/5 gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-red-400/60" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-300/60" />
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-300/60" />
            <span className="ml-3 text-xs text-slate-600 font-mono">main.py</span>
          </div>
          <div className="p-5 space-y-3">
            <div className="flex items-center gap-3"><span className="text-slate-600 text-xs font-mono w-5 text-right">1</span><div className="h-2 w-28 bg-violet-400/20 rounded" /></div>
            <div className="flex items-center gap-3"><span className="text-slate-600 text-xs font-mono w-5 text-right">2</span><div className="h-2 w-40 bg-cyan-400/15 rounded" /></div>
            <div className="flex items-center gap-3"><span className="text-slate-600 text-xs font-mono w-5 text-right">3</span><div className="h-2 w-20 bg-slate-700/30 rounded" /></div>
            <div className="flex items-center gap-3"><span className="text-slate-600 text-xs font-mono w-5 text-right">4</span><div className="h-2 w-52 bg-slate-700/30 rounded" /></div>
            <div className="flex items-center gap-3"><span className="text-slate-600 text-xs font-mono w-5 text-right">5</span><div className="h-2 w-36 bg-emerald-400/15 rounded" /></div>
            <div className="flex items-center gap-3"><span className="text-slate-600 text-xs font-mono w-5 text-right">6</span><div className="h-2 w-16 bg-amber-400/15 rounded" /></div>
          </div>
        </div>
      ),
    },
    {
      tag: "AI",
      title: "Your personal AI coding coach",
      desc: "Powered by Gemini. Get contextual hints, approach suggestions, and time-space complexity analysis — without spoiling the answer. Like having a senior engineer on demand.",
      icon: <MessageSquare className="h-6 w-6" />,
      color: "red",
      visual: (
        <div className="relative w-full h-full min-h-[280px] rounded-2xl border border-white/10 bg-black/60 overflow-hidden p-5 flex flex-col gap-4">
          <div className="self-end max-w-[70%] rounded-2xl rounded-br-sm bg-white/[0.06] border border-white/5 px-4 py-3 text-sm text-slate-400">
            How do I optimize this to O(n)?
          </div>
          <div className="self-start max-w-[80%] rounded-2xl rounded-bl-sm bg-red-500/10 border border-red-500/10 px-4 py-3 text-sm text-slate-300">
            <span className="text-red-400 font-semibold text-xs block mb-1">Gemini AI</span>
            Use a hash map to store complements as you iterate. This avoids the nested loop and gives you O(n) time with O(n) space.
          </div>
          <div className="self-start max-w-[60%] rounded-2xl rounded-bl-sm bg-red-500/5 border border-red-500/5 px-4 py-3 text-xs text-slate-500">
            💡 Hint: Think about what information you need at each step...
          </div>
        </div>
      ),
    },
    {
      tag: "Execution",
      title: "Instant feedback, zero waiting",
      desc: "Powered by Judge0. Run your code against visible test cases, then submit against hidden datasets. Track runtime, memory usage, and get detailed verdict breakdowns.",
      icon: <Play className="h-6 w-6" />,
      color: "emerald",
      visual: (
        <div className="relative w-full h-full min-h-[280px] rounded-2xl border border-white/10 bg-black/60 overflow-hidden p-5 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-slate-500">Test Case 1</span>
              <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1"><CheckCircle2 size={12} /> Passed</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-slate-500">Test Case 2</span>
              <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1"><CheckCircle2 size={12} /> Passed</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-slate-500">Test Case 3</span>
              <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1"><CheckCircle2 size={12} /> Passed</span>
            </div>
          </div>
          <div className="mt-6 grid grid-cols-3 gap-3">
            <div className="rounded-xl bg-white/[0.03] border border-white/5 p-3 text-center">
              <p className="text-lg font-black text-emerald-400">4ms</p>
              <p className="text-[10px] text-slate-600 uppercase tracking-wider mt-1">Runtime</p>
            </div>
            <div className="rounded-xl bg-white/[0.03] border border-white/5 p-3 text-center">
              <p className="text-lg font-black text-cyan-400">42MB</p>
              <p className="text-[10px] text-slate-600 uppercase tracking-wider mt-1">Memory</p>
            </div>
            <div className="rounded-xl bg-white/[0.03] border border-white/5 p-3 text-center">
              <p className="text-lg font-black text-white">3/3</p>
              <p className="text-[10px] text-slate-600 uppercase tracking-wider mt-1">Passed</p>
            </div>
          </div>
        </div>
      ),
    },
  ];

  const colorMap = {
    cyan: { tag: "text-cyan-400 border-cyan-400/20 bg-cyan-400/5", icon: "text-cyan-400" },
    red: { tag: "text-red-400 border-red-400/20 bg-red-400/5", icon: "text-red-400" },
    emerald: { tag: "text-emerald-400 border-emerald-400/20 bg-emerald-400/5", icon: "text-emerald-400" },
  };

  return (
    <section className="relative z-10 w-full py-20 lg:py-28">
      <div className="mx-auto max-w-[1152px] px-4 sm:px-6">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="space-y-20 lg:space-y-32"
        >
          {features.map((f, i) => {
            const isReversed = i % 2 === 1;
            const colors = colorMap[f.color];

            return (
              <motion.div
                variants={fadeInUp}
                key={f.tag}
                className={`flex flex-col items-center gap-10 lg:gap-16 ${isReversed ? "lg:flex-row-reverse" : "lg:flex-row"}`}
              >
                {/* Text */}
                <div className="flex-1 text-center lg:text-left">
                  <span className={`mb-4 inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-bold uppercase tracking-widest ${colors.tag}`}>
                    {f.icon} {f.tag}
                  </span>
                  <h3 className="mt-4 text-3xl font-extrabold leading-tight text-white sm:text-4xl">
                    {f.title}
                  </h3>
                  <p className="mt-4 max-w-md text-base leading-relaxed text-slate-400">
                    {f.desc}
                  </p>
                </div>

                {/* Visual */}
                <div className="flex-1 w-full">
                  {f.visual}
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

/* ─────────────────── Stats Counter ─────────────────── */
function StatsCounter() {
  const stats = [
    { value: "500+", label: "Curated Problems", icon: <BookOpen size={18} /> },
    { value: "11", label: "Languages", icon: <Code2 size={18} /> },
    { value: "∞", label: "Free Practice", icon: <Zap size={18} /> },
    { value: "24/7", label: "AI Assistance", icon: <Shield size={18} /> },
  ];

  return (
    <section className="relative z-10 w-full py-16 border-y border-white/5">
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="mx-auto max-w-[1024px] px-4 sm:px-6"
      >
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {stats.map((s) => (
            <motion.div variants={fadeInUp} key={s.label} className="text-center">
              <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-slate-500">
                {s.icon}
              </div>
              <p className="text-3xl font-black text-white sm:text-4xl">{s.value}</p>
              <p className="mt-1 text-xs font-semibold uppercase tracking-widest text-slate-600">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

/* ─────────────────── How It Works ─────────────────── */
function HowItWorks() {
  const steps = [
    { n: "01", title: "Create an account", desc: "Sign up with your email. Verify with a one-time code." },
    { n: "02", title: "Pick a challenge", desc: "Browse problems by difficulty or topic like Arrays and DP." },
    { n: "03", title: "Solve & submit", desc: "Write code, run tests, ask AI for hints, and submit." },
  ];

  return (
    <section className="relative z-10 w-full py-20 lg:py-28">
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="mx-auto max-w-[1152px] px-4 sm:px-6"
      >
        <motion.div variants={fadeInUp} className="text-center mb-16">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-slate-500">How it works</p>
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">Three steps to mastery</h2>
        </motion.div>

        <div className="relative">
          {/* Vertical connector line */}
          <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-cyan-400/30 via-white/10 to-transparent hidden md:block" />

          <div className="space-y-12">
            {steps.map((s, i) => (
              <motion.div variants={fadeInUp} key={s.n} className="flex gap-8 items-start">
                {/* Step number */}
                <div className="relative hidden md:flex flex-col items-center">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-black/60 text-xl font-black text-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.1)]">
                    {s.n}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 rounded-2xl border border-white/5 bg-white/[0.02] p-6 sm:p-8 backdrop-blur-sm">
                  <span className="md:hidden text-sm font-black text-cyan-400 mb-2 block">Step {s.n}</span>
                  <h3 className="text-xl font-bold text-white">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-400">{s.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}

/* ─────────────────── CTA ─────────────────── */
function CTA() {
  return (
    <section className="relative z-10 w-full py-24 lg:py-32 overflow-hidden">
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="mx-auto max-w-[896px] px-4 text-center sm:px-6"
      >
        {/* Glowing backdrop */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-64 w-64 rounded-full bg-cyan-500/10 blur-[100px]" />
          <div className="absolute h-48 w-48 rounded-full bg-red-500/10 blur-[80px] translate-x-20" />
        </div>

        <motion.h2 variants={fadeInUp} className="relative text-4xl font-extrabold leading-tight text-white sm:text-5xl lg:text-6xl">
          Ready to{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-red-500">
            level up?
          </span>
        </motion.h2>
        <motion.p variants={fadeInUp} className="relative mx-auto mt-6 mb-10 max-w-[500px] text-lg leading-relaxed text-slate-400">
          Join thousands of developers mastering DSA with Algovia. Free forever.
        </motion.p>
        <motion.div variants={fadeInUp} className="relative">
          <GlowButton to="/signup">
            Create Free Account <ArrowRight size={18} />
          </GlowButton>
        </motion.div>
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
        <LanguagesMarquee />
        <FeatureShowcase />
        <StatsCounter />
        <HowItWorks />
        {!isAuthenticated && <CTA />}
        <Footer />
      </div>
    </div>
  );
}
