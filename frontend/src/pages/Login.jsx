import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, NavLink } from "react-router";
import { loginUser, clearError } from "../authSlice";
import { useEffect, useState } from "react";
import { Mail, Lock, Eye, EyeOff, Loader2, ShieldCheck, ArrowRight } from "lucide-react";
import { BrandMark, PageBackground, iconFieldClass } from "../components/ui/Primitives";

const loginSchema = z.object({
  emailId: z.string().email("Please enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

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
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#07080d] px-4 py-10 text-slate-100 sm:px-6 lg:px-8">
      <PageBackground />

      <section className="relative z-10 w-full max-w-[460px]">
        <div className="mb-8 flex flex-col items-center text-center">
          <NavLink to="/" className="mb-5 inline-flex items-center gap-3 no-underline">
            <BrandMark />
            <span className="text-xl font-extrabold text-white">Algovia</span>
          </NavLink>
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-300/15 bg-cyan-300/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-cyan-200">
            <ShieldCheck size={14} /> Secure coding workspace
          </p>
          <h1 className="text-3xl font-extrabold leading-tight text-white sm:text-4xl">Welcome back</h1>
          <p className="mt-3 max-w-sm text-sm leading-6 text-slate-400">
            Sign in to continue your practice, submissions, and AI-assisted problem solving.
          </p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-slate-950/75 p-6 shadow-2xl shadow-black/30 backdrop-blur sm:p-8">
          {error && (
            <div className="mb-6 rounded-2xl border border-red-400/25 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-200" role="alert">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit((d) => dispatch(loginUser(d)))} className="space-y-5" noValidate>
            <div>
              <label htmlFor="emailId" className="mb-2 block text-sm font-semibold text-slate-200">
                Email address
              </label>
              <div className="relative">
                <Mail size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  id="emailId"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  aria-invalid={Boolean(errors.emailId)}
                  {...register("emailId")}
                  className={`${iconFieldClass} ${errors.emailId ? "border-red-400/60 focus:border-red-300 focus:ring-red-300/10" : ""}`}
                />
              </div>
              {errors.emailId && <p className="mt-2 text-sm font-medium text-red-300">{errors.emailId.message}</p>}
            </div>

            <div>
              <label htmlFor="password" className="mb-2 block text-sm font-semibold text-slate-200">
                Password
              </label>
              <div className="relative">
                <Lock size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  id="password"
                  type={showPw ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  aria-invalid={Boolean(errors.password)}
                  {...register("password")}
                  className={`${iconFieldClass} pr-12 ${errors.password ? "border-red-400/60 focus:border-red-300 focus:ring-red-300/10" : ""}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-slate-500 transition hover:bg-white/5 hover:text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-300/50"
                  aria-label={showPw ? "Hide password" : "Show password"}
                >
                  {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <p className="mt-2 text-sm font-medium text-red-300">{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-cyan-300 px-5 text-sm font-extrabold text-slate-950 shadow-lg shadow-cyan-950/30 transition hover:-translate-y-0.5 hover:bg-cyan-200 focus:outline-none focus:ring-4 focus:ring-cyan-300/30 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? <><Loader2 size={18} className="animate-spin" /> Signing in</> : <><span>Sign in</span><ArrowRight size={18} /></>}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-sm font-medium text-slate-500">
          Don't have an account?{" "}
          <NavLink to="/signup" className="font-bold text-cyan-200 no-underline transition hover:text-cyan-100">
            Create one
          </NavLink>
        </p>
      </section>
    </main>
  );
}
