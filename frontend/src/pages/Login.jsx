import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, NavLink } from "react-router";
import { loginUser, clearError } from "../authSlice";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, Loader2, ArrowRight } from "lucide-react";
import { CinematicAutumnBackground } from "../components/ui/cinematic-autumn-background";

const loginSchema = z.object({
  emailId: z.string().email("Please enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const inputClass =
  "h-12 w-full rounded-xl border border-white/10 bg-white/[0.03] py-3 pl-11 pr-4 text-sm text-white outline-none transition-all duration-300 placeholder:text-slate-600 focus:border-white/25 focus:bg-white/[0.05] focus:ring-4 focus:ring-white/5 backdrop-blur-sm";

export default function Login() {
  const [showPw, setShowPw] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, loading, error } = useSelector((s) => s.auth);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(loginSchema),
  });

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  useEffect(() => {
    if (isAuthenticated) navigate("/problems");
  }, [isAuthenticated, navigate]);

  return (
    <main className="relative flex h-screen w-screen items-center justify-center overflow-hidden bg-[#030000] px-4 text-slate-100 select-none">
      <CinematicAutumnBackground />

      {/* Ambient glow */}
      <div className="pointer-events-none absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[400px] w-[400px] rounded-full bg-cyan-500/5 blur-[120px]" />

      <motion.section
        initial="hidden"
        animate="visible"
        transition={{ staggerChildren: 0.08 }}
        className="relative z-10 w-full max-w-[420px]"
      >
        {/* Header */}
        <motion.div variants={fadeInUp} transition={{ duration: 0.6 }} className="mb-6 flex flex-col items-center text-center">
          <NavLink to="/" className="mb-4 inline-flex items-center gap-3 no-underline group">
            <img src="/logo.png" alt="Algovia" className="h-9 w-9 rounded-xl object-cover shadow-[0_0_15px_rgba(34,211,238,0.3)] transition-transform duration-300 group-hover:scale-105" />
            <span className="text-lg font-extrabold text-white transition-colors duration-300 group-hover:text-cyan-300">Algovia</span>
          </NavLink>
          <h1 className="text-2xl font-extrabold leading-tight text-white sm:text-3xl">Welcome back</h1>
          <p className="mt-2 max-w-sm text-xs leading-relaxed text-slate-500">
            Sign in to continue your practice and AI-assisted problem solving.
          </p>
        </motion.div>

        {/* Form Card */}
        <motion.div
          variants={fadeInUp}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="rounded-3xl border border-white/[0.06] bg-black/40 p-6 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] backdrop-blur-xl sm:p-6"
        >
          {error && (
            <div className="mb-4 rounded-xl border border-red-400/20 bg-red-500/10 px-4 py-2.5 text-xs font-semibold text-red-300" role="alert">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit((d) => dispatch(loginUser(d)))} className="space-y-4" noValidate>
            <div>
              <label htmlFor="emailId" className="mb-1.5 block text-xs font-semibold text-slate-300">
                Email address
              </label>
              <div className="relative">
                <Mail size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" />
                <input
                  id="emailId"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  aria-invalid={Boolean(errors.emailId)}
                  {...register("emailId")}
                  className={`${inputClass} !h-11 ${errors.emailId ? "border-red-400/40 focus:border-red-400/60" : ""}`}
                />
              </div>
              {errors.emailId && <p className="mt-1 text-xs font-medium text-red-400">{errors.emailId.message}</p>}
            </div>

            <div>
              <label htmlFor="password" className="mb-1.5 block text-xs font-semibold text-slate-300">
                Password
              </label>
              <div className="relative">
                <Lock size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" />
                <input
                  id="password"
                  type={showPw ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  aria-invalid={Boolean(errors.password)}
                  {...register("password")}
                  className={`${inputClass} !h-11 pr-12 ${errors.password ? "border-red-400/40 focus:border-red-400/60" : ""}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-slate-600 transition hover:bg-white/5 hover:text-slate-300 focus:outline-none"
                  aria-label={showPw ? "Hide password" : "Show password"}
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-xs font-medium text-red-400">{errors.password.message}</p>}
              <div className="mt-2 text-right">
                <NavLink
                  to="/forgot-password"
                  className="text-xs font-bold text-rose-400 transition hover:text-rose-300 no-underline font-['Plus_Jakarta_Sans',sans-serif]"
                >
                  Forgot password?
                </NavLink>
              </div>
            </div>


            <button
              type="submit"
              disabled={loading}
              className="group relative inline-flex h-11 w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-white px-5 text-sm font-extrabold text-black transition-all duration-300 hover:shadow-[0_0_25px_rgba(255,255,255,0.2)] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <div className="pointer-events-none absolute inset-0 flex h-full w-full justify-center [transform:skew(-12deg)_translateX(-200%)] group-hover:duration-1000 group-hover:[transform:skew(-12deg)_translateX(200%)]">
                <div className="relative h-full w-8 bg-black/5" />
              </div>
              <span className="relative flex items-center gap-2">
                {loading ? <><Loader2 size={16} className="animate-spin" /> Signing in</> : <>Sign in <ArrowRight size={16} /></>}
              </span>
            </button>
          </form>
        </motion.div>

        <motion.p variants={fadeInUp} transition={{ duration: 0.6, delay: 0.2 }} className="mt-4 text-center text-xs font-medium text-slate-600">
          Don't have an account?{" "}
          <NavLink to="/signup" className="font-bold text-white no-underline transition hover:text-cyan-300">
            Create one
          </NavLink>
        </motion.p>
      </motion.section>
    </main>
  );
}
