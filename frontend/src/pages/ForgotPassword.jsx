import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router";
import { ArrowLeft, ArrowRight, Mail, KeyRound, Lock, Eye, EyeOff, ShieldAlert, Loader2, CheckCircle2, Code2, AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axiosClient from "../utils/axiosClient";
import { CinematicAutumnBackground } from "../components/ui/cinematic-autumn-background";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const inputClass =
  "h-12 w-full rounded-xl border border-white/10 bg-white/[0.03] py-3 pl-11 pr-4 text-sm text-white outline-none transition-all duration-300 placeholder:text-slate-650 focus:border-white/25 focus:bg-white/[0.05] focus:ring-4 focus:ring-white/5 backdrop-blur-sm";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Request OTP, 2: Reset Password
  const [emailId, setEmailId] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [devOtp, setDevOtp] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState({ show: false, message: "" });
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    if (!emailId) return setError("Email is required");
    setError("");
    setLoading(true);

    try {
      const res = await axiosClient.post("/user/forgot-password", { emailId });
      setToast({ show: true, message: res.data.message });
      if (res.data.devOtp) {
        setDevOtp(res.data.devOtp);
      }
      setCooldown(30);
      setTimeout(() => {
        setToast({ show: false, message: "" });
        setStep(2);
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send reset code");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!otp || !newPassword || !confirmPassword) {
      return setError("All fields are required");
    }
    if (newPassword !== confirmPassword) {
      return setError("Passwords do not match");
    }
    if (newPassword.length < 8) {
      return setError("Password must be at least 8 characters");
    }
    setError("");
    setLoading(true);

    try {
      const res = await axiosClient.post("/user/reset-password", {
        emailId,
        otp,
        newPassword,
      });

      setToast({ show: true, message: res.data.message || "Password reset successfully!" });
      setTimeout(() => {
        setToast({ show: false, message: "" });
        navigate("/login");
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative flex h-screen w-screen items-center justify-center overflow-hidden bg-[#030000] px-4 text-slate-100 select-none">
      <CinematicAutumnBackground />

      {/* Ambient glow */}
      <div className="pointer-events-none absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[400px] w-[400px] rounded-full bg-rose-500/5 blur-[120px]" />

      <motion.section
        initial="hidden"
        animate="visible"
        transition={{ staggerChildren: 0.08 }}
        className="relative z-10 w-full max-w-[420px]"
      >
        {/* Header */}
        <motion.div variants={fadeInUp} transition={{ duration: 0.6 }} className="mb-6 flex flex-col items-center text-center">
          <NavLink to="/login" className="mb-4 inline-flex items-center gap-3 no-underline group">
            <img src="/logo.png" alt="Algovia" className="h-9 w-9 rounded-xl object-cover shadow-[0_0_15px_rgba(244,63,94,0.3)] transition-transform duration-300 group-hover:scale-105" />
            <span className="text-lg font-extrabold text-white transition-colors duration-300 group-hover:text-rose-450">Algovia</span>
          </NavLink>
          <h1 className="text-2xl font-extrabold leading-tight text-white sm:text-3xl">
            {step === 1 ? "Reset password" : "Set new password"}
          </h1>
          <p className="mt-2 max-w-sm text-xs leading-relaxed text-slate-550">
            {step === 1
              ? "Enter your email address to receive a password reset code."
              : "Verify your reset code and set your new account password."}
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

          {step === 1 ? (
            <form onSubmit={handleRequestOtp} className="space-y-4" noValidate>
              <div>
                <label htmlFor="emailId" className="mb-1.5 block text-xs font-semibold text-slate-300">
                  Email address
                </label>
                <div className="relative">
                  <Mail size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" />
                  <input
                    id="emailId"
                    type="email"
                    placeholder="you@example.com"
                    value={emailId}
                    onChange={(e) => setEmailId(e.target.value)}
                    className={inputClass}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !emailId}
                className="group relative inline-flex h-11 w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-white px-5 text-sm font-extrabold text-black transition-all duration-300 hover:shadow-[0_0_25px_rgba(255,255,255,0.2)] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <span className="relative flex items-center gap-2">
                  {loading ? (
                    <><Loader2 size={16} className="animate-spin" /> Sending...</>
                  ) : (
                    <>Send reset code <ArrowRight size={16} /></>
                  )}
                </span>
              </button>
            </form>
          ) : (
            <form onSubmit={handleResetPassword} className="space-y-4" noValidate>
              {/* Dev Sandbox Banner */}
              {devOtp && (
                <div className="mb-4 rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4 text-xs text-amber-200">
                  <p className="font-bold flex items-center gap-1.5 mb-1 text-amber-300">
                    <AlertTriangle size={14} className="text-amber-400" /> Dev Sandbox Mode
                  </p>
                  <p className="text-[11px] text-amber-400/90 leading-relaxed">
                    Brevo email API is unauthorized. Use this reset OTP:
                  </p>
                  <div className="mt-2">
                    <span className="rounded bg-black/40 px-3 py-1 font-mono text-sm font-bold tracking-[0.2em] text-amber-300 border border-amber-500/10">
                      {devOtp}
                    </span>
                  </div>
                </div>
              )}

              <div>
                <label htmlFor="otp" className="mb-1.5 block text-xs font-semibold text-slate-300">
                  Verification code
                </label>
                <div className="relative">
                  <KeyRound size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" />
                  <input
                    id="otp"
                    type="text"
                    placeholder="000000"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    className={`${inputClass} font-mono tracking-[0.25em]`}
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="newPassword" className="mb-1.5 block text-xs font-semibold text-slate-300">
                  New Password
                </label>
                <div className="relative">
                  <Lock size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" />
                  <input
                    id="newPassword"
                    type={showPw ? "text" : "password"}
                    placeholder="At least 8 characters"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className={inputClass}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(!showPw)}
                    className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-slate-650 transition hover:bg-white/5 hover:text-slate-300 focus:outline-none"
                  >
                    {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="mb-1.5 block text-xs font-semibold text-slate-300">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" />
                  <input
                    id="confirmPassword"
                    type={showPw ? "text" : "password"}
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={inputClass}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || otp.length !== 6 || !newPassword || !confirmPassword}
                className="group relative inline-flex h-11 w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-white px-5 text-sm font-extrabold text-black transition-all duration-300 hover:shadow-[0_0_25px_rgba(255,255,255,0.2)] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <span className="relative flex items-center gap-2">
                  {loading ? (
                    <><Loader2 size={16} className="animate-spin" /> Resetting...</>
                  ) : (
                    <>Reset password <ArrowRight size={16} /></>
                  )}
                </span>
              </button>

              <div className="mt-2 text-center">
                <button
                  type="button"
                  onClick={handleRequestOtp}
                  disabled={cooldown > 0 || loading}
                  className="text-xs font-semibold text-slate-400 hover:text-white transition disabled:opacity-50"
                >
                  {cooldown > 0 ? `Resend code in ${cooldown}s` : "Resend code"}
                </button>
              </div>
            </form>
          )}
        </motion.div>

        <motion.div variants={fadeInUp} transition={{ duration: 0.6, delay: 0.2 }} className="mt-4 text-center">
          <NavLink to="/login" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 no-underline transition hover:text-white">
            <ArrowLeft size={14} /> Back to Login
          </NavLink>
        </motion.div>
      </motion.section>

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
