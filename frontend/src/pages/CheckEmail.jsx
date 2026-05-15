import { Link, useLocation } from "react-router";
import { ArrowRight, MailCheck } from "lucide-react";
import { BrandMark, PageBackground } from "../components/ui/Primitives";

export default function CheckEmail() {
  const location = useLocation();
  const email = location.state?.email || "your email address";

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#07080d] px-4 py-10 text-slate-100">
      <PageBackground />
      <section className="relative z-10 w-full max-w-md rounded-3xl border border-white/10 bg-slate-950/75 p-6 text-center shadow-2xl shadow-black/30 backdrop-blur sm:p-8">
        <div className="mx-auto mb-6 flex justify-center">
          <BrandMark className="h-14 w-14 rounded-2xl" />
        </div>
        <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-300/10 text-emerald-200">
          <MailCheck size={24} />
        </div>
        <h1 className="text-2xl font-extrabold text-white">Check your email</h1>
        <p className="mt-3 text-sm leading-6 text-slate-400">
          We sent a verification message to <span className="font-semibold text-cyan-200 break-all">{email}</span>.
        </p>

        <div className="mt-8 space-y-3">
          <a
            href="https://mail.google.com"
            target="_blank"
            rel="noreferrer"
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-300 px-5 py-3 text-sm font-extrabold text-slate-950 shadow-lg shadow-cyan-950/30 transition hover:-translate-y-0.5 hover:bg-cyan-200 no-underline"
          >
            Open Gmail <ArrowRight size={16} />
          </a>

          <Link
            to="/login"
            className="inline-flex w-full items-center justify-center rounded-xl border border-white/10 px-5 py-3 text-sm font-semibold text-slate-300 transition hover:bg-white/5 hover:text-white no-underline"
          >
            Go to login
          </Link>
        </div>

        <p className="mt-6 text-sm leading-6 text-slate-500">
          No message yet? Check spam or promotions, then try signing in after verification.
        </p>
      </section>
    </main>
  );
}
