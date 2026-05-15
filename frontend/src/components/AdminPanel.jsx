import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import axiosClient from '../utils/axiosClient';
import { useNavigate } from 'react-router';
import { Plus, Trash2, Save, ArrowLeft, Layout, FileCode, Beaker } from 'lucide-react';
import { NavLink } from 'react-router';
import { PageBackground } from './ui/Primitives';

const problemSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  tags: z.enum(['array', 'linkedList', 'graph', 'dp']),
  visibleTestCases: z.array(
    z.object({
      input: z.string().min(1, 'Input is required'),
      output: z.string().min(1, 'Output is required'),
      explanation: z.string().min(1, 'Explanation is required')
    })
  ).min(1, 'At least one visible test case required'),
  hiddenTestCases: z.array(
    z.object({
      input: z.string().min(1, 'Input is required'),
      output: z.string().min(1, 'Output is required')
    })
  ).min(1, 'At least one hidden test case required'),
  startCode: z.array(
    z.object({
      language: z.enum(['C++', 'Java', 'JavaScript']),
      initialCode: z.string().min(1, 'Initial code is required')
    })
  ).length(3, 'All three languages required'),
  referenceSolution: z.array(
    z.object({
      language: z.enum(['C++', 'Java', 'JavaScript']),
      completeCode: z.string().min(1, 'Complete code is required')
    })
  ).length(3, 'All three languages required')
});

function AdminPanel() {
  const navigate = useNavigate();
  const {
    register,
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(problemSchema),
    defaultValues: {
      startCode: [
        { language: 'C++', initialCode: '' },
        { language: 'Java', initialCode: '' },
        { language: 'JavaScript', initialCode: '' }
      ],
      referenceSolution: [
        { language: 'C++', completeCode: '' },
        { language: 'Java', completeCode: '' },
        { language: 'JavaScript', completeCode: '' }
      ],
      visibleTestCases: [{ input: '', output: '', explanation: '' }],
      hiddenTestCases: [{ input: '', output: '' }]
    }
  });

  const { fields: visibleFields, append: appendVisible, remove: removeVisible } = useFieldArray({ control, name: 'visibleTestCases' });
  const { fields: hiddenFields, append: appendHidden, remove: removeHidden } = useFieldArray({ control, name: 'hiddenTestCases' });

  const onSubmit = async (data) => {
    try {
      await axiosClient.post('/problem/create', data);
      alert('Problem created successfully!');
      navigate('/admin');
    } catch (error) {
      alert(`Error: ${error.response?.data?.message || error.message}`);
    }
  };

  const inputClass = "w-full rounded-xl border border-white/10 bg-slate-900/50 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-300/50 focus:ring-4 focus:ring-cyan-300/5";
  const labelClass = "mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400";

  return (
    <div className="min-h-screen bg-[#07080d] text-slate-200 selection:bg-cyan-300/25">
      <PageBackground />
      
      <div className="relative z-10 mx-auto max-w-5xl px-6 py-12">
        <div className="mb-10 flex items-center justify-between">
          <div>
            <NavLink to="/admin" className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-cyan-400 no-underline hover:text-cyan-300">
              <ArrowLeft size={16} /> Back to Admin
            </NavLink>
            <h1 className="text-3xl font-extrabold text-white">Create New Problem</h1>
          </div>
          <button onClick={handleSubmit(onSubmit)} className="inline-flex items-center gap-2 rounded-xl bg-cyan-300 px-6 py-3 text-sm font-extrabold text-slate-950 shadow-lg shadow-cyan-950/30 transition hover:-translate-y-0.5 hover:bg-cyan-200">
            <Save size={18} /> Save Problem
          </button>
        </div>

        <form className="space-y-8">
          {/* Section 1: Basic Info */}
          <section className="rounded-2xl border border-white/10 bg-slate-950/50 p-8 backdrop-blur-sm">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-300/10 text-cyan-200">
                <Layout size={20} />
              </div>
              <h2 className="text-xl font-bold text-white">Basic Information</h2>
            </div>
            
            <div className="grid gap-6">
              <div>
                <label className={labelClass}>Problem Title</label>
                <input {...register('title')} className={inputClass} placeholder="e.g. Two Sum" />
                {errors.title && <p className="mt-2 text-xs text-red-400">{errors.title.message}</p>}
              </div>

              <div>
                <label className={labelClass}>Description (Markdown supported)</label>
                <textarea {...register('description')} className={`${inputClass} min-h-[200px] font-mono text-[13px]`} placeholder="Describe the problem, constraints, and requirements..." />
                {errors.description && <p className="mt-2 text-xs text-red-400">{errors.description.message}</p>}
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label className={labelClass}>Difficulty</label>
                  <select {...register('difficulty')} className={inputClass}>
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Category Tag</label>
                  <select {...register('tags')} className={inputClass}>
                    <option value="array">Array</option>
                    <option value="linkedList">Linked List</option>
                    <option value="graph">Graph</option>
                    <option value="dp">Dynamic Programming</option>
                  </select>
                </div>
              </div>
            </div>
          </section>

          {/* Section 2: Test Cases */}
          <section className="rounded-2xl border border-white/10 bg-slate-950/50 p-8 backdrop-blur-sm">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-300/10 text-cyan-200">
                <Beaker size={20} />
              </div>
              <h2 className="text-xl font-bold text-white">Test Cases</h2>
            </div>

            <div className="space-y-8">
              {/* Visible Cases */}
              <div>
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200">Visible Examples</h3>
                  <button type="button" onClick={() => appendVisible({ input: '', output: '', explanation: '' })} className="inline-flex items-center gap-2 text-xs font-bold text-cyan-400 hover:text-cyan-300">
                    <Plus size={14} /> Add Example
                  </button>
                </div>
                <div className="space-y-4">
                  {visibleFields.map((field, index) => (
                    <div key={field.id} className="relative rounded-xl border border-white/5 bg-white/[0.02] p-5">
                      <button type="button" onClick={() => removeVisible(index)} className="absolute right-4 top-4 text-slate-500 transition hover:text-red-400">
                        <Trash2 size={16} />
                      </button>
                      <div className="grid gap-4 md:grid-cols-2">
                        <div>
                          <label className="mb-1 block text-[10px] font-bold text-slate-500 uppercase">Input</label>
                          <input {...register(`visibleTestCases.${index}.input`)} className={inputClass} />
                        </div>
                        <div>
                          <label className="mb-1 block text-[10px] font-bold text-slate-500 uppercase">Output</label>
                          <input {...register(`visibleTestCases.${index}.output`)} className={inputClass} />
                        </div>
                        <div className="md:col-span-2">
                          <label className="mb-1 block text-[10px] font-bold text-slate-500 uppercase">Explanation</label>
                          <input {...register(`visibleTestCases.${index}.explanation`)} className={inputClass} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Hidden Cases */}
              <div>
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200">Hidden Test Cases</h3>
                  <button type="button" onClick={() => appendHidden({ input: '', output: '' })} className="inline-flex items-center gap-2 text-xs font-bold text-cyan-400 hover:text-cyan-300">
                    <Plus size={14} /> Add Hidden Case
                  </button>
                </div>
                <div className="space-y-4">
                  {hiddenFields.map((field, index) => (
                    <div key={field.id} className="relative rounded-xl border border-white/5 bg-white/[0.02] p-5">
                      <button type="button" onClick={() => removeHidden(index)} className="absolute right-4 top-4 text-slate-500 transition hover:text-red-400">
                        <Trash2 size={16} />
                      </button>
                      <div className="grid gap-4 md:grid-cols-2">
                        <div>
                          <label className="mb-1 block text-[10px] font-bold text-slate-500 uppercase">Input</label>
                          <input {...register(`hiddenTestCases.${index}.input`)} className={inputClass} />
                        </div>
                        <div>
                          <label className="mb-1 block text-[10px] font-bold text-slate-500 uppercase">Output</label>
                          <input {...register(`hiddenTestCases.${index}.output`)} className={inputClass} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Section 3: Code Templates */}
          <section className="rounded-2xl border border-white/10 bg-slate-950/50 p-8 backdrop-blur-sm">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-300/10 text-cyan-200">
                <FileCode size={20} />
              </div>
              <h2 className="text-xl font-bold text-white">Code Templates & Solutions</h2>
            </div>

            <div className="space-y-10">
              {[0, 1, 2].map((index) => (
                <div key={index} className="space-y-4 border-l-2 border-cyan-300/20 pl-6">
                  <h3 className="text-lg font-bold text-white">
                    {index === 0 ? 'C++' : index === 1 ? 'Java' : 'JavaScript'}
                  </h3>
                  
                  <div className="grid gap-6 md:grid-cols-2">
                    <div>
                      <label className={labelClass}>Initial Starter Code</label>
                      <textarea {...register(`startCode.${index}.initialCode`)} className={`${inputClass} min-h-[160px] font-mono text-[13px]`} />
                    </div>
                    <div>
                      <label className={labelClass}>Reference Solution</label>
                      <textarea {...register(`referenceSolution.${index}.completeCode`)} className={`${inputClass} min-h-[160px] font-mono text-[13px]`} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <button type="button" onClick={handleSubmit(onSubmit)} className="inline-flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-cyan-300 text-base font-extrabold text-slate-950 shadow-xl shadow-cyan-950/40 transition hover:-translate-y-1 hover:bg-cyan-200">
            <Save size={20} /> Finalize and Create Problem
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdminPanel;