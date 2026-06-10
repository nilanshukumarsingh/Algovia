import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, NavLink } from "react-router";
import { registerUser } from "../authSlice";
import { motion } from "framer-motion";
import { User, Mail, Lock, Eye, EyeOff, Loader2, ArrowRight } from "lucide-react";
import { CinematicAutumnBackground } from "../components/ui/cinematic-autumn-background";

const signupSchema = z.object({
  firstName: z.string().min(3, "Name must be at least 3 characters"),
  emailId: z.string().email("Please enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const inputClass =
  "h-12 w-full rounded-xl border border-white/10 bg-white/[0.03] py-3 pl-11 pr-4 text-sm text-white outline-none transition-all duration-300 placeholder:text-slate-600 focus:border-white/25 focus:bg-white/[0.05] focus:ring-4 focus:ring-white/5 backdrop-blur-sm";

export default function Signup() {
  const [showPw, setShowPw] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, loading } = useSelector((s) => s.auth);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(signupSchema),
  });

  useEffect(() => {
    if (isAuthenticated) navigate("/problems");
  }, [isAuthenticated, navigate]);

  const onSubmit = async (data) => {
    try {
      const res = await dispatch(registerUser(data)).unwrap();
      alert(res.message);
      navigate("/verify-email", { state: { email: data.emailId } });
    } catch { /* handled by Redux */ }
  };

  return (
    <main className="relative flex h-screen w-screen items-center justify-center overflow-hidden bg-[#030000] px-4 text-slate-100 select-none">
      <CinematicAutumnBackground />

      {/* Ambient glow */}
      <div className="pointer-events-none absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[400px] w-[400px] rounded-full bg-red-500/5 blur-[120px]" />

      <motion.section
        initial="hidden"
        animate="visible"
        transition={{ staggerChildren: 0.08 }}
        className="relative z-10 w-full max-w-[420px]"
      >
        {/* Header */}
        <motion.div variants={fadeInUp} transition={{ duration: 0.6 }} className="mb-4 flex flex-col items-center text-center">
          <NavLink to="/" className="mb-3 inline-flex items-center gap-3 no-underline group">
            <img src="/logo.png" alt="Algovia" className="h-9 w-9 rounded-xl object-cover shadow-[0_0_15px_rgba(34,211,238,0.3)] transition-transform duration-300 group-hover:scale-105" />
            <span className="text-lg font-extrabold text-white transition-colors duration-300 group-hover:text-cyan-300">Algovia</span>
          </NavLink>
          <h1 className="text-2xl font-extrabold leading-tight text-white sm:text-3xl">Create account</h1>
          <p className="mt-1.5 max-w-sm text-xs leading-relaxed text-slate-500">
            Start solving, tracking submissions, and mastering DSA for free.
          </p>
        </motion.div>

        {/* Form Card */}
        <motion.div
          variants={fadeInUp}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="rounded-3xl border border-white/[0.06] bg-black/40 p-5 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] backdrop-blur-xl sm:p-6"
        >
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5" noValidate>
            <div>
              <label htmlFor="firstName" className="mb-1 block text-xs font-semibold text-slate-300">Full name</label>
              <div className="relative">
                <User size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" />
                <input
                  id="firstName"
                  type="text"
                  autoComplete="name"
                  placeholder="John Doe"
                  aria-invalid={Boolean(errors.firstName)}
                  {...register("firstName")}
                  className={`${inputClass} !h-11 ${errors.firstName ? "border-red-400/40 focus:border-red-400/60" : ""}`}
                />
              </div>
              {errors.firstName && <p className="mt-1 text-xs font-medium text-red-400">{errors.firstName.message}</p>}
            </div>

            <div>
              <label htmlFor="emailId" className="mb-1 block text-xs font-semibold text-slate-300">Email address</label>
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
              <label htmlFor="password" className="mb-1 block text-xs font-semibold text-slate-300">Password</label>
              <div className="relative">
                <Lock size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" />
                <input
                  id="password"
                  type={showPw ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="At least 8 characters"
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
                {loading ? <><Loader2 size={16} className="animate-spin" /> Creating account</> : <>Create account <ArrowRight size={16} /></>}
              </span>
            </button>
          </form>
        </motion.div>

        <motion.p variants={fadeInUp} transition={{ duration: 0.6, delay: 0.2 }} className="mt-4 text-center text-xs font-medium text-slate-600">
          Already have an account?{" "}
          <NavLink to="/login" className="font-bold text-white no-underline transition hover:text-cyan-300">
            Sign in
          </NavLink>
        </motion.p>
      </motion.section>
    </main>
  );
}
