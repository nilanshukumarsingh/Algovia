import { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router";
import { ArrowRight, Code2, KeyRound, MailWarning, ShieldCheck } from "lucide-react";
import api from "../utils/axiosClient";
import { BrandMark, PageBackground, fieldClass } from "../components/ui/Primitives";

export default function VerifyEmail() {
  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email;
  const emailId = location.state?.email;

  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  if (!email) {
    return (
      <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#07080d] px-4 py-10 text-slate-100">
        <PageBackground />
        <section className="relative z-10 w-full max-w-md rounded-3xl border border-white/10 bg-slate-950/75 p-6 text-center shadow-2xl shadow-black/30 backdrop-blur sm:p-8">
          <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-300/10 text-amber-200">
            <MailWarning size={26} />
          </div>
          <h1 className="text-2xl font-extrabold text-white">No email to verify</h1>
          <p className="mt-3 text-sm leading-6 text-slate-400">
            Please create an account again so we can send a fresh verification code.
          </p>
          <NavLink to="/signup" className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-300 px-5 py-3 text-sm font-extrabold text-slate-950 shadow-lg shadow-cyan-950/30 transition hover:-translate-y-0.5 hover:bg-cyan-200 no-underline">
            Create account <ArrowRight size={16} />
          </NavLink>
        </section>
      </main>
    );
  }

  const handleVerify = async (event) => {
    event.preventDefault();
    setError("");
    setIsVerifying(true);

    try {
      const res = await api.post("/user/verify-otp", {
        emailId,
        otp,
      });

      alert(res.data.message);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Verification failed");
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#07080d] px-4 py-6 text-slate-100 sm:px-6 lg:px-8">
      <PageBackground />

      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-6xl items-center">
        <div className="grid w-full items-center gap-10 lg:grid-cols-[1fr_440px]">
          <section className="hidden lg:block">
            <NavLink to="/" className="mb-10 inline-flex items-center gap-3 no-underline">
              <BrandMark />
              <span className="text-xl font-extrabold text-white">Algovia</span>
            </NavLink>
            <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-300/15 bg-emerald-300/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-emerald-200">
              <ShieldCheck size={14} /> Final account step
            </p>
            <h1 className="max-w-2xl text-5xl font-extrabold leading-tight text-white">
              Confirm your email before entering the workspace.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-400">
              This keeps your submissions, progress, and practice history tied to the right account.
            </p>
          </section>

          <section className="mx-auto w-full max-w-[440px]">
            <div className="mb-8 flex flex-col items-center text-center lg:hidden">
              <NavLink to="/" className="mb-5 inline-flex items-center gap-3 no-underline">
                <BrandMark />
                <span className="text-xl font-extrabold text-white">Algovia</span>
              </NavLink>
              <h1 className="text-3xl font-extrabold leading-tight text-white">Verify your email</h1>
            </div>

            <div className="rounded-3xl border border-white/10 bg-slate-950/75 p-6 shadow-2xl shadow-black/30 backdrop-blur sm:p-8">
              <div className="mb-7">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-300/10 text-cyan-200">
                  <Code2 size={24} />
                </div>
                <h2 className="text-2xl font-extrabold text-white">Enter verification code</h2>
                <p className="mt-3 text-sm leading-6 text-slate-400">
                  We sent a 6-digit OTP to <span className="font-semibold text-cyan-200 break-all">{email}</span>.
                </p>
              </div>

              <form onSubmit={handleVerify} className="space-y-5">
                <div>
                  <label htmlFor="otp-input" className="mb-2 block text-sm font-semibold text-slate-200">
                    One-time password
                  </label>
                  <div className="relative">
                    <KeyRound size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                      id="otp-input"
                      className={`${fieldClass} pl-11 font-mono tracking-[0.25em]`}
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
                  <div className="rounded-2xl border border-red-400/25 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-200" role="alert">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isVerifying || otp.length !== 6}
                  className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-cyan-300 px-5 text-sm font-extrabold text-slate-950 shadow-lg shadow-cyan-950/30 transition hover:-translate-y-0.5 hover:bg-cyan-200 focus:outline-none focus:ring-4 focus:ring-cyan-300/30 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isVerifying ? "Verifying" : "Verify email"} <ArrowRight size={18} />
                </button>
              </form>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
