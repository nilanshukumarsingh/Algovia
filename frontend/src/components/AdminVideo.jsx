import { useEffect, useState } from 'react';
import axiosClient from '../utils/axiosClient';
import { NavLink } from 'react-router';
import { Video, Trash2, Upload, ArrowLeft, RefreshCw, AlertCircle } from 'lucide-react';
import { PageBackground } from './ui/Primitives';

const AdminVideo = () => {
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
      setError('Failed to load problem set');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete the video editorial for this problem?')) return;
    
    try {
      await axiosClient.delete(`/video/delete/${id}`);
      alert('Video deleted successfully');
      fetchProblems(); // Refresh list
    } catch (err) {
      alert('Failed to delete video: ' + (err.response?.data?.message || err.message));
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#07080d]">
        <PageBackground />
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-cyan-300/20 border-t-cyan-400" />
          <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Loading Library...</p>
        </div>
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
            <h1 className="text-3xl font-extrabold text-white">Video Editorial Library</h1>
            <p className="mt-2 text-slate-400">Manage video solutions and walkthroughs for all problems.</p>
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
              <tr className="border-bottom border-white/5 bg-white/5">
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">Problem</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">Status</th>
                <th className="px-6 py-4 text-center text-xs font-bold uppercase tracking-wider text-slate-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {problems.map((problem) => (
                <tr key={problem._id} className="group hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-5">
                    <div className="font-bold text-white">{problem.title}</div>
                    <div className="mt-1 flex gap-2">
                      <span className="text-[10px] font-bold uppercase text-slate-500">{problem.difficulty}</span>
                      <span className="text-[10px] font-bold uppercase text-cyan-500/70">{problem.tags}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    {problem.secureUrl ? (
                      <span className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-2 py-1 text-[10px] font-bold text-emerald-400 uppercase">
                        <Video size={12} /> Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 rounded-lg border border-slate-500/20 bg-slate-500/10 px-2 py-1 text-[10px] font-bold text-slate-400 uppercase">
                        Missing
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center justify-center gap-2">
                      <NavLink 
                        to={`/admin/upload/${problem._id}`}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-cyan-400 px-3 py-1.5 text-xs font-bold text-slate-950 no-underline transition hover:bg-cyan-300"
                      >
                        <Upload size={14} /> {problem.secureUrl ? 'Update' : 'Upload'}
                      </NavLink>
                      {problem.secureUrl && (
                        <button 
                          onClick={() => handleDelete(problem._id)}
                          className="inline-flex items-center gap-1.5 rounded-lg bg-red-500/10 px-3 py-1.5 text-xs font-bold text-red-400 transition hover:bg-red-500/20"
                        >
                          <Trash2 size={14} /> Delete
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {problems.length === 0 && (
            <div className="py-20 text-center">
              <p className="text-slate-500">No problems found in the database.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminVideo;