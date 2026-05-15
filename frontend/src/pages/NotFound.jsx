import { NavLink } from "react-router";
import { ArrowLeft, Search, Home } from "lucide-react";
import { BrandMark, PageBackground } from "../components/ui/Primitives";

export default function NotFound() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#07080d] px-4 py-10 text-slate-100">
      <PageBackground />
      <section className="relative z-10 w-full max-w-2xl rounded-3xl border border-white/10 bg-slate-950/75 p-6 text-center shadow-2xl shadow-black/30 backdrop-blur sm:p-10">
        <div className="mx-auto mb-6 flex justify-center">
          <BrandMark className="h-14 w-14 rounded-2xl" />
        </div>
        <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-cyan-300/15 bg-cyan-300/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-cyan-200">
          <Search size={14} /> Error 404
        </p>
        <h1 className="text-4xl font-extrabold leading-tight text-white sm:text-5xl">This route does not exist</h1>
        <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-slate-400 sm:text-base">
          The page may have been moved, deleted, or typed incorrectly. You can return home or continue to the problem dashboard.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <NavLink to="/" className="inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-300 px-5 py-3 text-sm font-extrabold text-slate-950 shadow-lg shadow-cyan-950/30 transition hover:-translate-y-0.5 hover:bg-cyan-200 no-underline">
            <Home size={16} /> Back home
          </NavLink>
          <NavLink to="/problems" className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 px-5 py-3 text-sm font-semibold text-slate-300 transition hover:bg-white/5 hover:text-white no-underline">
            Problems <ArrowLeft size={16} className="rotate-180" />
          </NavLink>
        </div>
      </section>
    </main>
  );
}
