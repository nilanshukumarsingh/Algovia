import { useState, useEffect } from 'react';
import axiosClient from '../utils/axiosClient';
import { Clock, Code2, CheckCircle2, XCircle, AlertTriangle, ChevronRight, X } from 'lucide-react';

const SubmissionHistory = ({ problemId }) => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSubmission, setSelectedSubmission] = useState(null);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        setLoading(true);
        const response = await axiosClient.get(`/problem/submittedProblem/${problemId}`);
        setSubmissions(response.data || []);
      } catch (err) {
        setError('Failed to fetch history');
      } finally {
        setLoading(false);
      }
    };
    fetchSubmissions();
  }, [problemId]);

  const getStatusStyle = (status) => {
    switch (status) {
      case 'accepted': return { icon: <CheckCircle2 size={14} />, class: 'text-emerald-400 border-emerald-500/20 bg-emerald-500/10' };
      case 'wrong': return { icon: <XCircle size={14} />, class: 'text-red-400 border-red-500/20 bg-red-500/10' };
      case 'error': return { icon: <AlertTriangle size={14} />, class: 'text-amber-400 border-amber-500/20 bg-amber-500/10' };
      default: return { icon: <Clock size={14} />, class: 'text-slate-400 border-slate-500/20 bg-slate-500/10' };
    }
  };

  const formatMemory = (memory) => {
    if (memory < 1024) return `${memory} KB`;
    return `${(memory / 1024).toFixed(1)} MB`;
  };

  if (loading) return <div className="flex justify-center py-10"><div className="h-8 w-8 animate-spin rounded-full border-2 border-cyan-300/20 border-t-cyan-400" /></div>;

  if (submissions.length === 0) {
    return (
      <div className="rounded-xl border border-white/5 bg-white/[0.02] py-12 text-center">
        <p className="text-sm font-medium text-slate-500">No submissions yet. Solve it first!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-xl border border-white/5 bg-slate-950/40">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-white/5 bg-white/[0.02]">
              <th className="px-4 py-3 font-bold text-slate-400">Status</th>
              <th className="px-4 py-3 font-bold text-slate-400">Runtime</th>
              <th className="px-4 py-3 font-bold text-slate-400">Memory</th>
              <th className="px-4 py-3 text-right font-bold text-slate-400">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {submissions.map((sub) => {
              const style = getStatusStyle(sub.status);
              return (
                <tr 
                  key={sub._id} 
                  className="group cursor-pointer hover:bg-white/[0.03] transition-colors"
                  onClick={() => setSelectedSubmission(sub)}
                >
                  <td className="px-4 py-4">
                    <div className={`inline-flex items-center gap-1.5 rounded-lg border px-2 py-1 text-[10px] font-bold uppercase tracking-wider ${style.class}`}>
                      {style.icon} {sub.status}
                    </div>
                  </td>
                  <td className="px-4 py-4 font-mono text-slate-300">{sub.runtime}s</td>
                  <td className="px-4 py-4 font-mono text-slate-300">{formatMemory(sub.memory)}</td>
                  <td className="px-4 py-4 text-right text-slate-500 tabular-nums">
                    {new Date(sub.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Code Modal */}
      {selectedSubmission && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-6 backdrop-blur-sm">
          <div className="relative w-full max-w-4xl max-h-[80vh] flex flex-col rounded-3xl border border-white/10 bg-[#07080d] shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between border-b border-white/10 p-6">
              <div className="flex items-center gap-3">
                <Code2 className="text-cyan-400" />
                <div>
                  <h3 className="font-extrabold text-white">Submission Code</h3>
                  <p className="text-xs text-slate-500 font-mono uppercase">{selectedSubmission.language}</p>
                </div>
              </div>
              <button onClick={() => setSelectedSubmission(null)} className="h-10 w-10 flex items-center justify-center rounded-xl hover:bg-white/5 text-slate-400 hover:text-white transition">
                <X size={20} />
              </button>
            </div>
            
            <div className="flex-1 overflow-auto p-6 bg-slate-950/50">
               <pre className="font-mono text-sm leading-relaxed text-slate-300">
                 <code>{selectedSubmission.code}</code>
               </pre>
            </div>

            <div className="border-t border-white/10 p-6 flex gap-4 bg-slate-900/40">
                <div className="flex-1 grid grid-cols-3 gap-4">
                   <div className="rounded-xl border border-white/5 bg-white/5 p-3">
                      <p className="text-[10px] font-bold text-slate-500 uppercase">Runtime</p>
                      <p className="text-sm font-bold text-white">{selectedSubmission.runtime}s</p>
                   </div>
                   <div className="rounded-xl border border-white/5 bg-white/5 p-3">
                      <p className="text-[10px] font-bold text-slate-500 uppercase">Memory</p>
                      <p className="text-sm font-bold text-white">{formatMemory(selectedSubmission.memory)}</p>
                   </div>
                   <div className="rounded-xl border border-white/5 bg-white/5 p-3">
                      <p className="text-[10px] font-bold text-slate-500 uppercase">Passed</p>
                      <p className="text-sm font-bold text-white">{selectedSubmission.testCasesPassed}/{selectedSubmission.testCasesTotal}</p>
                   </div>
                </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubmissionHistory;