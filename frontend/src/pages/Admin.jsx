import React from 'react';
import { Plus, Edit, Trash2, Video, ArrowLeft, ShieldCheck } from 'lucide-react';
import { NavLink } from 'react-router';
import Navbar from '../components/ui/Navbar';
import Footer from '../components/ui/Footer';
import { PageBackground } from '../components/ui/Primitives';
import { useSelector } from 'react-redux';

function Admin() {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const adminOptions = [
    {
      id: 'create',
      title: 'Create Problem',
      description: 'Add a new coding challenge with test cases and descriptions.',
      icon: Plus,
      accent: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
      border: 'hover:border-emerald-500/30',
      route: '/admin/create'
    },
    {
      id: 'update',
      title: 'Update Problem',
      description: 'Modify existing problem statements, constraints, or test data.',
      icon: Edit,
      accent: 'text-amber-400',
      bg: 'bg-amber-500/10',
      border: 'hover:border-amber-500/30',
      route: '/admin/update'
    },
    {
      id: 'delete',
      title: 'Delete Problem',
      description: 'Permanently remove a problem and all associated submissions.',
      icon: Trash2,
      accent: 'text-red-400',
      bg: 'bg-red-500/10',
      border: 'hover:border-red-500/30',
      route: '/admin/delete'
    },
    {
      id: 'video',
      title: 'Manage Videos',
      description: 'Upload video editorials and manage existing walkthroughs.',
      icon: Video,
      accent: 'text-cyan-400',
      bg: 'bg-cyan-500/10',
      border: 'hover:border-cyan-500/30',
      route: '/admin/video'
    }
  ];

  // User menu button for the navbar (consistent with Homepage)
  const userMenu = (
    <div className="flex items-center gap-3">
       <NavLink to="/problems" className="flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2 text-sm font-semibold text-slate-300 transition hover:bg-white/5 hover:text-white no-underline">
        <ArrowLeft size={16} /> Back to Problems
      </NavLink>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#07080d] text-slate-200">
      <PageBackground />
      <Navbar isAuthenticated={isAuthenticated} rightSlot={userMenu} />

      <main className="relative z-10 mx-auto max-w-[1120px] px-6 py-16">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-300/15 bg-cyan-300/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-cyan-200">
            <ShieldCheck size={14} /> Administrator Access
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-white md:text-5xl">
            Admin Management
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-slate-400">
            Platform control center for managing problem sets, editorials, and system content.
          </p>
        </div>

        {/* Admin Options Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-2 max-w-4xl mx-auto">
          {adminOptions.map((option) => {
            const IconComponent = option.icon;
            return (
              <div
                key={option.id}
                className={`group relative flex flex-col items-center text-center rounded-2xl border border-white/[0.06] bg-slate-950/50 p-8 transition-all duration-300 hover:-translate-y-1 hover:bg-slate-900/50 ${option.border}`}
              >
                {/* Icon Container */}
                <div className={`${option.bg} ${option.accent} mb-6 flex h-16 w-16 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-110`}>
                  <IconComponent size={32} />
                </div>
                
                {/* Content */}
                <h2 className="mb-3 text-xl font-bold text-white">
                  {option.title}
                </h2>
                <p className="mb-8 text-sm leading-relaxed text-slate-400">
                  {option.description}
                </p>
                
                {/* Action Link */}
                <NavLink 
                  to={option.route}
                  className="mt-auto inline-flex h-11 w-full items-center justify-center rounded-xl bg-white/5 px-6 text-sm font-bold text-white no-underline transition hover:bg-white/10 hover:text-cyan-300"
                >
                  Configure {option.title.split(' ')[0]}
                </NavLink>

                {/* Decorative hover effect */}
                <div className="absolute inset-x-0 bottom-0 h-1 rounded-b-2xl bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              </div>
            );
          })}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default Admin;