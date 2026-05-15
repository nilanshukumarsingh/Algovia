import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, NavLink } from "react-router";
import { registerUser } from "../authSlice";
import { User, Mail, Lock, Eye, EyeOff, Loader2, ArrowRight, CheckCircle2 } from "lucide-react";
import { BrandMark, PageBackground, iconFieldClass } from "../components/ui/Primitives";

const signupSchema = z.object({
  firstName: z.string().min(3, "Name must be at least 3 characters"),
  emailId: z.string().email("Please enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

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
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#07080d] px-4 py-10 text-slate-100 sm:px-6 lg:px-8">
      <PageBackground />

      <section className="relative z-10 w-full max-w-[460px]">
        <div className="mb-8 flex flex-col items-center text-center">
          <NavLink to="/" className="mb-5 inline-flex items-center gap-3 no-underline">
            <BrandMark />
            <span className="text-xl font-extrabold text-white">Algovia</span>
          </NavLink>
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-300/15 bg-emerald-300/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-emerald-200">
            <CheckCircle2 size={14} /> Practice path included
          </p>
          <h1 className="text-3xl font-extrabold leading-tight text-white sm:text-4xl">Create your account</h1>
          <p className="mt-3 max-w-sm text-sm leading-6 text-slate-400">
            Save your progress, track submissions, and unlock the coding workspace.
          </p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-slate-950/75 p-6 shadow-2xl shadow-black/30 backdrop-blur sm:p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
            <div>
              <label htmlFor="firstName" className="mb-2 block text-sm font-semibold text-slate-200">Full name</label>
              <div className="relative">
                <User size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  id="firstName"
                  type="text"
                  autoComplete="name"
                  placeholder="John Doe"
                  aria-invalid={Boolean(errors.firstName)}
                  {...register("firstName")}
                  className={`${iconFieldClass} ${errors.firstName ? "border-red-400/60 focus:border-red-300 focus:ring-red-300/10" : ""}`}
                />
              </div>
              {errors.firstName && <p className="mt-2 text-sm font-medium text-red-300">{errors.firstName.message}</p>}
            </div>

            <div>
              <label htmlFor="emailId" className="mb-2 block text-sm font-semibold text-slate-200">Email address</label>
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
              <label htmlFor="password" className="mb-2 block text-sm font-semibold text-slate-200">Password</label>
              <div className="relative">
                <Lock size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  id="password"
                  type={showPw ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="At least 8 characters"
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
              {loading ? <><Loader2 size={18} className="animate-spin" /> Creating account</> : <><span>Create account</span><ArrowRight size={18} /></>}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-sm font-medium text-slate-500">
          Already have an account?{" "}
          <NavLink to="/login" className="font-bold text-cyan-200 no-underline transition hover:text-cyan-100">
            Sign in
          </NavLink>
        </p>
      </section>
    </main>
  );
}
