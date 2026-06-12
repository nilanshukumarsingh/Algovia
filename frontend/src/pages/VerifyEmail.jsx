import { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router";
import { ArrowRight, Code2, KeyRound, MailWarning, ShieldCheck, AlertTriangle, Loader2, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../utils/axiosClient";
import { CinematicAutumnBackground } from "../components/ui/cinematic-autumn-background";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const inputClass =
  "h-12 w-full rounded-xl border border-white/10 bg-white/[0.03] py-3 pl-11 pr-4 text-sm text-white outline-none transition-all duration-300 placeholder:text-slate-600 focus:border-white/25 focus:bg-white/[0.05] focus:ring-4 focus:ring-white/5 backdrop-blur-sm";

export default function VerifyEmail() {
  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email;
  const emailId = location.state?.email;

  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendStatus, setResendStatus] = useState("");
  const [cooldown, setCooldown] = useState(0);
  const [toast, setToast] = useState({ show: false, message: "" });

  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  const handleVerify = async (event) => {
    event.preventDefault();
    setError("");
    setIsVerifying(true);

    try {
      const res = await api.post("/user/verify-otp", {
        emailId,
        otp,
      });

      setToast({ show: true, message: res.data.message });
      setTimeout(() => {
        setToast({ show: false, message: "" });
        navigate("/login");
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Verification failed");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    if (cooldown > 0 || isResending) return;
    setIsResending(true);
    setResendStatus("");
    setError("");

    try {
      const res = await api.post("/user/resend-otp", { emailId });
      setResendStatus("Verification code has been resent.");
      setCooldown(30);

      if (res.data.devOtp) {
        navigate(location.pathname, {
          state: { ...location.state, devOtp: res.data.devOtp },
          replace: true,
        });
      }
    } catch (err) {
      setError(err.response?.data?.message || "Resend failed");
    } finally {
      setIsResending(false);
    }
  };

  if (!email) {
    return (
      <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#030000] px-4 py-10 text-slate-100 select-none">
        <CinematicAutumnBackground />
        
        {/* Ambient glow */}
        <div className="pointer-events-none absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[400px] w-[400px] rounded-full bg-red-500/5 blur-[120px]" />

        <motion.section
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          transition={{ duration: 0.6 }}
          className="relative z-10 w-full max-w-[420px] rounded-3xl border border-white/[0.06] bg-black/40 p-5 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] backdrop-blur-xl sm:p-8 text-center"
        >
          <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-200 border border-amber-500/20">
            <MailWarning size={26} />
          </div>
          <h1 className="text-2xl font-extrabold text-white">No email to verify</h1>
          <p className="mt-3 text-xs leading-5 text-slate-500">
            Please create an account again so we can send a fresh verification code.
          </p>
          <NavLink
            to="/signup"
            className="group relative mt-7 inline-flex h-11 w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-white px-5 text-sm font-extrabold text-black transition-all duration-300 hover:shadow-[0_0_25px_rgba(255,255,255,0.2)] no-underline"
          >
            Create account <ArrowRight size={16} />
          </NavLink>
        </motion.section>
      </main>
    );
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#030000] px-4 py-6 text-slate-100 sm:px-6 lg:px-8 select-none">
      <CinematicAutumnBackground />

      {/* Ambient glow */}
      <div className="pointer-events-none absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[400px] w-[400px] rounded-full bg-red-500/5 blur-[120px]" />

      <div className="relative z-10 mx-auto flex w-full max-w-5xl items-center justify-center">
        <div className="grid w-full items-center gap-10 lg:grid-cols-[1fr_420px]">
          
          {/* Left Column (Desktop Only) */}
          <motion.section 
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            transition={{ duration: 0.6 }}
            className="hidden lg:block text-left"
          >
            <NavLink to="/" className="mb-10 inline-flex items-center gap-3 no-underline group">
              <img src="/logo.png" alt="Algovia" className="h-9 w-9 rounded-xl object-cover shadow-[0_0_15px_rgba(34,211,238,0.3)] transition-transform duration-300 group-hover:scale-105" />
              <span className="text-lg font-extrabold text-white transition-colors duration-300 group-hover:text-cyan-300">Algovia</span>
            </NavLink>
            
            <div className="mt-4">
              <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-red-500/15 bg-red-500/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-red-200">
                <ShieldCheck size={14} /> Final account step
              </p>
              <h1 className="max-w-2xl text-4xl font-extrabold leading-tight text-white xl:text-5xl">
                Confirm your email before entering the workspace.
              </h1>
              <p className="mt-6 max-w-xl text-base leading-7 text-slate-400">
                This keeps your submissions, progress, and practice history tied to the right account.
              </p>
            </div>
          </motion.section>

          {/* Right Column (Form Card) */}
          <motion.section 
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mx-auto w-full max-w-[420px]"
          >
            {/* Header (Mobile Only) */}
            <div className="mb-6 flex flex-col items-center text-center lg:hidden">
              <NavLink to="/" className="mb-4 inline-flex items-center gap-3 no-underline group">
                <img src="/logo.png" alt="Algovia" className="h-9 w-9 rounded-xl object-cover shadow-[0_0_15px_rgba(34,211,238,0.3)] transition-transform duration-300 group-hover:scale-105" />
                <span className="text-lg font-extrabold text-white transition-colors duration-300 group-hover:text-cyan-300">Algovia</span>
              </NavLink>
              <h1 className="text-2xl font-extrabold leading-tight text-white sm:text-3xl">Verify your email</h1>
            </div>

            {/* Form Card */}
            <div className="rounded-3xl border border-white/[0.06] bg-black/40 p-5 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] backdrop-blur-xl sm:p-6 text-left">
              
              {/* Card Header */}
              <div className="mb-6">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white">
                  <Code2 size={20} />
                </div>
                <h2 className="text-xl font-extrabold text-white">Enter verification code</h2>
                <p className="mt-2 text-xs leading-relaxed text-slate-500">
                  We sent a 6-digit OTP to <span className="font-semibold text-slate-300 break-all">{email}</span>.
                </p>
              </div>

              {/* Dev Fallback Banner */}
              {location.state?.devOtp && (
                <div className="mb-5 rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4 text-xs text-amber-200">
                  <p className="font-bold flex items-center gap-1.5 mb-1 text-amber-300">
                    <AlertTriangle size={14} className="text-amber-400" /> Dev Sandbox Mode
                  </p>
                  <p className="text-[11px] text-amber-400/90 leading-relaxed">
                    Brevo email API is unauthorized. Use this OTP to proceed:
                  </p>
                  <div className="mt-2">
                    <span className="rounded bg-black/40 px-3 py-1 font-mono text-sm font-bold tracking-[0.2em] text-amber-300 border border-amber-500/10">
                      {location.state.devOtp}
                    </span>
                  </div>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleVerify} className="space-y-4">
                <div>
                  <label htmlFor="otp-input" className="mb-1 block text-xs font-semibold text-slate-300">
                    One-time password
                  </label>
                  <div className="relative">
                    <KeyRound size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" />
                    <input
                      id="otp-input"
                      className={`${inputClass} pl-11 font-mono tracking-[0.25em]`}
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      placeholder="000000"
                      maxLength={6}
                    />
                  </div>
                </div>

                {error && (
                  <div className="rounded-xl border border-red-400/20 bg-red-500/10 px-4 py-2.5 text-xs font-semibold text-red-300" role="alert">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isVerifying || otp.length !== 6}
                  className="group relative inline-flex h-11 w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-white px-5 text-sm font-extrabold text-black transition-all duration-300 hover:shadow-[0_0_25px_rgba(255,255,255,0.2)] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <div className="pointer-events-none absolute inset-0 flex h-full w-full justify-center [transform:skew(-12deg)_translateX(-200%)] group-hover:duration-1000 group-hover:[transform:skew(-12deg)_translateX(200%)]">
                    <div className="relative h-full w-8 bg-black/5" />
                  </div>
                  <span className="relative flex items-center gap-2">
                    {isVerifying ? (
                      <><Loader2 size={16} className="animate-spin" /> Verifying</>
                    ) : (
                      <>Verify email <ArrowRight size={16} /></>
                    )}
                  </span>
                </button>
              </form>

              <div className="mt-4 text-center">
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={cooldown > 0 || isResending}
                  className="text-xs font-semibold text-slate-400 hover:text-white transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {isResending ? (
                    "Sending new code..."
                  ) : cooldown > 0 ? (
                    `Resend code in ${cooldown}s`
                  ) : (
                    "Resend verification code"
                  )}
                </button>
              </div>

              {resendStatus && (
                <div className="mt-3 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-2.5 text-xs font-semibold text-emerald-300 text-center" role="alert">
                  {resendStatus}
                </div>
              )}

              {/* Dev Console Tip */}
              <p className="mt-4 text-[10px] text-center leading-relaxed text-slate-600">
                Didn't get the email? In local development, the OTP is also printed in the backend terminal console.
              </p>
            </div>
          </motion.section>
        </div>
      </div>

      <AnimatePresence>
        {toast.show && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-6 right-6 z-50 flex items-center gap-3 rounded-2xl border border-white/[0.08] bg-black/80 px-4 py-3 shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-xl"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
              <CheckCircle2 size={16} />
            </div>
            <span className="text-sm font-semibold text-white">{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
