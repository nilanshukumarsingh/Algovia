import { useEffect, useState } from 'react';
import axiosClient from '../utils/axiosClient';
import { NavLink } from 'react-router';
import { Trash2, ArrowLeft, RefreshCw, AlertCircle, FileX } from 'lucide-react';
import { PageBackground } from './ui/Primitives';

const AdminDelete = () => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProblems();
  }, []);

  const fetchProblems = async () => {
    try {
      setLoading(true);
      const { data } = await axiosClient.get('/problem/getAllProblem');
      setProblems(data);
    } catch (err) {
      setError('Failed to fetch problems');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('WARNING: This will permanently delete the problem and all user submissions. Continue?')) return;
    
    try {
      await axiosClient.delete(`/problem/delete/${id}`);
      setProblems(problems.filter(problem => problem._id !== id));
      alert('Problem deleted successfully');
    } catch (err) {
      alert('Failed to delete problem: ' + (err.response?.data?.message || err.message));
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#07080d]">
        <PageBackground />
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-cyan-300/20 border-t-cyan-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#07080d] text-slate-200">
      <PageBackground />
      
      <div className="relative z-10 mx-auto max-w-5xl px-6 py-12">
        <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <NavLink to="/admin" className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-cyan-400 no-underline hover:text-cyan-300">
              <ArrowLeft size={16} /> Back to Admin
            </NavLink>
            <h1 className="text-3xl font-extrabold text-white">Delete Problems</h1>
            <p className="mt-2 text-slate-400">Permanently remove coding challenges from the platform.</p>
          </div>
          <button onClick={fetchProblems} className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-300 transition hover:bg-white/10 hover:text-white">
            <RefreshCw size={16} /> Refresh
          </button>
        </div>

        {error && (
          <div className="mb-8 flex items-center gap-3 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-red-200">
            <AlertCircle size={20} />
            <span className="text-sm font-semibold">{error}</span>
          </div>
        )}

        <div className="overflow-hidden rounded-2xl border border-white/10 bg-slate-950/50 backdrop-blur-sm">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/5 bg-white/5">
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">#</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">Problem Title</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">Difficulty</th>
                <th className="px-6 py-4 text-center text-xs font-bold uppercase tracking-wider text-slate-400">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {problems.map((problem, index) => (
                <tr key={problem._id} className="group hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-5 text-sm font-medium text-slate-500">{index + 1}</td>
                  <td className="px-6 py-5 text-sm font-bold text-white">{problem.title}</td>
                  <td className="px-6 py-5">
                    <span className={`inline-flex rounded-lg border px-2 py-1 text-[10px] font-bold uppercase tracking-wider ${
                      problem.difficulty === 'easy' 
                        ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400' 
                        : problem.difficulty === 'medium' 
                          ? 'border-amber-500/20 bg-amber-500/10 text-amber-400' 
                          : 'border-red-500/20 bg-red-500/10 text-red-400'
                    }`}>
                      {problem.difficulty}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <button 
                      onClick={() => handleDelete(problem._id)}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-red-500/10 px-4 py-2 text-xs font-bold text-red-400 transition hover:bg-red-500/20"
                    >
                      <Trash2 size={14} /> Delete Problem
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {problems.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <FileX size={48} className="mb-4 text-slate-700" />
              <p className="text-slate-500">No problems found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDelete;