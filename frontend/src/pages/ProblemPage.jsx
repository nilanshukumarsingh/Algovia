import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import Editor from '@monaco-editor/react';
import { useParams, NavLink } from 'react-router';
import axiosClient from "../utils/axiosClient";
import SubmissionHistory from "../components/SubmissionHistory";
import ChatAi from '../components/ChatAi';
import Editorial from '../components/Editorial';
import { ArrowLeft, Lock, X } from 'lucide-react';

const langMap = {
  cpp: 'C++',
  java: 'Java',
  javascript: 'JavaScript'
};

const ProblemPage = () => {
  const [problem, setProblem] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState('cpp');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [runResult, setRunResult] = useState(null);
  const [submitResult, setSubmitResult] = useState(null);
  const [activeLeftTab, setActiveLeftTab] = useState('description');
  const [activeRightTab, setActiveRightTab] = useState('code');
  const [isSolved, setIsSolved] = useState(false);
  const editorRef = useRef(null);
  let { problemId } = useParams();

  const { handleSubmit } = useForm();

  useEffect(() => {
    const fetchProblemAndStatus = async () => {
      setLoading(true);
      try {
        const [problemRes, solvedRes] = await Promise.all([
          axiosClient.get(`/problem/problemById/${problemId}`),
          axiosClient.get('/problem/problemSolvedByUser').catch(() => ({ data: [] }))
        ]);
        
        const problemData = problemRes.data;
        const codeObj = problemData.startCode?.find(sc => sc.language === langMap[selectedLanguage]);
        const initialCode = codeObj ? codeObj.initialCode : "";
        
        setProblem(problemData);
        setCode(initialCode);
        
        const solvedList = solvedRes.data || [];
        setIsSolved(solvedList.some(p => p._id === problemId));
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching problem details:', error);
        setLoading(false);
      }
    };
    fetchProblemAndStatus();
  }, [problemId]);

  useEffect(() => {
    if (problem) {
      const codeObj = problem.startCode?.find(sc => sc.language === langMap[selectedLanguage]);
      setCode(codeObj ? codeObj.initialCode : "");
    }
  }, [selectedLanguage, problem]);

  const handleEditorChange = (value) => setCode(value || '');
  const handleEditorDidMount = (editor) => { editorRef.current = editor; };
  const handleLanguageChange = (language) => setSelectedLanguage(language);

  const handleRun = async () => {
    setLoading(true);
    setRunResult(null);
    try {
      const response = await axiosClient.post(`/submission/run/${problemId}`, { code, language: selectedLanguage });
      setRunResult(response.data);
      setLoading(false);
      setActiveRightTab('testcase');
    } catch (error) {
      console.error('Error running code:', error);
      setRunResult({ success: false, error: 'Internal server error' });
      setLoading(false);
      setActiveRightTab('testcase');
    }
  };

  const handleSubmitCode = async () => {
    setLoading(true);
    setSubmitResult(null);
    try {
      const response = await axiosClient.post(`/submission/submit/${problemId}`, { code, language: selectedLanguage });
      setSubmitResult(response.data);
      if (response.data?.accepted) {
        setIsSolved(true);
      }
      setLoading(false);
      setActiveRightTab('result');
    } catch (error) {
      console.error('Error submitting code:', error);
      setSubmitResult(null);
      setLoading(false);
      setActiveRightTab('result');
    }
  };

  const getLanguageForMonaco = (lang) => {
    switch (lang) {
      case 'javascript': return 'javascript';
      case 'java': return 'java';
      case 'cpp': return 'cpp';
      default: return 'javascript';
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return 'border-emerald-500/25 bg-emerald-500/10 text-emerald-400';
      case 'medium': return 'border-amber-500/25 bg-amber-500/10 text-amber-400';
      case 'hard': return 'border-red-500/25 bg-red-500/10 text-red-400';
      default: return 'border-slate-500/20 bg-slate-500/10 text-slate-400';
    }
  };

  if (loading && !problem) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#060101]">
        <div className="h-10 w-10 animate-[app-spin_0.8s_linear_infinite] rounded-full border-[3px] border-rose-500/10 border-t-[#f43f5e]" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#060101] text-slate-200 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* ── HEADER BAR ── */}
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-rose-500/10 bg-[#0f0707] px-6">
        <div className="flex items-center gap-4">
          <NavLink
            to="/problems"
            className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold text-slate-300 transition hover:bg-white/10 hover:text-white no-underline"
          >
            <ArrowLeft size={14} /> Back to Problems
          </NavLink>
          <div className="h-4 w-px bg-rose-500/10" />
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="Algovia Logo" className="h-6 w-6 rounded-lg object-cover" />
            <span className="text-sm font-extrabold text-white">Algovia</span>
          </div>
        </div>

        {problem && (
          <div className="hidden items-center gap-3 sm:flex">
            <h1 className="text-sm font-extrabold text-slate-100">{problem.title}</h1>
            <span className={`rounded-md border px-2 py-0.5 text-[10px] font-bold capitalize tracking-wider ${getDifficultyColor(problem.difficulty)}`}>
              {problem.difficulty}
            </span>
            <span className="rounded-md border border-rose-500/15 bg-rose-500/[0.08] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-rose-450 font-mono">
              {problem.tags === 'linkedList' ? 'Linked List' : problem.tags === 'dp' ? 'Dynamic Programming' : problem.tags}
            </span>
          </div>
        )}

        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Workspace</span>
        </div>
      </header>

      {/* ── MAIN WORKSPACE ── */}
      <div className="flex flex-1 flex-row overflow-hidden">
        {/* ── LEFT PANEL ── */}
        <div className="flex w-1/2 flex-col border-r border-rose-500/10 bg-[#060101]">
          <div className="flex shrink-0 items-center gap-0.5 border-b border-rose-500/10 bg-[#0f0707] px-3">
            {['description', 'editorial', 'solutions', 'submissions', 'chatAI'].map(tab => (
              <button
                key={tab}
                className={`px-4 py-2.5 text-[0.82rem] font-semibold whitespace-nowrap border-b-2 transition-colors duration-150 font-['Plus_Jakarta_Sans',sans-serif] ${activeLeftTab === tab ? 'border-rose-500 text-rose-400' : 'border-transparent text-slate-500 hover:text-slate-400'}`}
                onClick={() => setActiveLeftTab(tab)}
              >
                {tab === 'chatAI' ? 'Chat AI' : tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          <div className={`flex-1 flex flex-col ${activeLeftTab !== 'chatAI' ? 'overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-rose-500/20 scrollbar-track-transparent' : ''}`}>
            {problem && (
              <>
                {activeLeftTab === 'description' && (
                  <div>
                    <div className="mb-5 flex flex-wrap items-center gap-2.5">
                      <h1 className="text-xl font-extrabold text-slate-100">{problem.title}</h1>
                      <span className={`rounded-md border px-2.5 py-1 text-[0.72rem] font-semibold capitalize ${getDifficultyColor(problem.difficulty)}`}>
                        {problem.difficulty.charAt(0).toUpperCase() + problem.difficulty.slice(1)}
                      </span>
                      <span className="rounded-md border border-rose-500/20 bg-rose-500/10 px-2.5 py-1 text-[0.72rem] font-semibold text-rose-450">
                        {problem.tags === 'linkedList' ? 'Linked List' : problem.tags === 'dp' ? 'Dynamic Programming' : problem.tags}
                      </span>
                    </div>

                    <div className="whitespace-pre-wrap text-[0.95rem] sm:text-base leading-relaxed text-slate-200/90 font-medium">
                      {problem.description}
                    </div>

                    <div className="mb-4 mt-8 text-lg font-black text-white tracking-tight">Examples</div>
                    <div className="space-y-4">
                      {problem.visibleTestCases.map((example, index) => (
                        <div key={index} className="rounded-2xl border border-rose-500/10 bg-black/40 px-5 py-4 backdrop-blur-md">
                          <div className="mb-2.5 text-[0.92rem] font-black uppercase tracking-wider text-rose-400 font-mono">Example {index + 1}</div>
                          <div className="mb-1.5 text-sm leading-relaxed text-slate-350"><strong className="text-slate-400">Input:</strong> {example.input}</div>
                          <div className="mb-1.5 text-sm leading-relaxed text-slate-350"><strong className="text-slate-400">Output:</strong> {example.output}</div>
                          {example.explanation && (
                            <div className="text-sm leading-relaxed text-slate-350"><strong className="text-slate-400">Explanation:</strong> {example.explanation}</div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeLeftTab === 'editorial' && (
                  <div>
                    <div className="mb-4 text-lg font-bold text-slate-200">Editorial</div>
                    <div className="text-[0.88rem] leading-[1.75]">
                      <Editorial secureUrl={problem.secureUrl} thumbnailUrl={problem.thumbnailUrl} duration={problem.duration} />
                    </div>
                  </div>
                )}

                {activeLeftTab === 'solutions' && (
                  <div className="h-full flex flex-col">
                    <div className="mb-4 text-lg font-bold text-slate-200 shrink-0">Solutions</div>
                    {isSolved ? (
                      <div className="space-y-4">
                        {problem.referenceSolution?.map((solution, index) => (
                          <div key={index} className="overflow-hidden rounded-2xl border border-rose-500/10 bg-black/40">
                            <div className="border-b border-rose-500/10 bg-[#0f0707] px-4 py-2.5 text-[0.85rem] font-semibold text-slate-400">
                              {problem?.title} — {solution?.language}
                            </div>
                            <div className="overflow-x-auto bg-black/60 p-4 text-[0.8rem] leading-relaxed text-slate-300 font-mono">
                              <pre className="m-0"><code>{solution?.completeCode}</code></pre>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-16 px-6 text-center rounded-3xl border border-rose-500/10 bg-black/40 backdrop-blur-xl relative overflow-hidden my-4">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none h-48 w-48 rounded-full bg-rose-500/5 blur-[50px]" />
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-400 border border-rose-500/25 mb-4 shadow-lg shadow-rose-950/20">
                          <Lock size={24} />
                        </div>
                        <h3 className="text-lg font-black text-white">Solutions Locked</h3>
                        <p className="mt-2 max-w-sm text-xs text-slate-400 leading-relaxed">
                          To unlock the official and community solutions, you must first solve this problem successfully. Put your skills to the test and submit your code!
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {activeLeftTab === 'submissions' && (
                  <div>
                    <div className="mb-4 text-lg font-bold text-slate-200">My Submissions</div>
                    <SubmissionHistory problemId={problemId} />
                  </div>
                )}

                {activeLeftTab === 'chatAI' && (
                  <ChatAi problem={problem} />
                )}
              </>
            )}
          </div>
        </div>

        {/* ── RIGHT PANEL ── */}
        <div className="flex w-1/2 flex-col">
          <div className="flex shrink-0 items-center gap-0.5 border-b border-rose-500/10 bg-[#0f0707] px-3">
            {['code', 'testcase', 'result'].map(tab => (
              <button
                key={tab}
                className={`px-4 py-2.5 text-[0.82rem] font-semibold whitespace-nowrap border-b-2 transition-colors duration-150 font-['Plus_Jakarta_Sans',sans-serif] ${activeRightTab === tab ? 'border-rose-500 text-rose-400' : 'border-transparent text-slate-500 hover:text-slate-400'}`}
                onClick={() => setActiveRightTab(tab)}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          <div className="flex flex-1 flex-col overflow-hidden bg-[#060101]">
            {activeRightTab === 'code' && (
              <div className="flex flex-1 flex-col">
                <div className="flex shrink-0 items-center justify-between border-b border-rose-500/10 bg-[#0f0707] px-4 py-2.5">
                  <div className="flex gap-1.5">
                    {['javascript', 'java', 'cpp'].map(lang => (
                      <button
                        key={lang}
                        className={`rounded-md border px-3.5 py-1 text-[0.8rem] font-semibold transition-all duration-150 font-['Plus_Jakarta_Sans',sans-serif] ${selectedLanguage === lang ? 'border-rose-500/40 bg-rose-500/15 text-rose-450' : 'border-white/10 bg-transparent text-slate-500 hover:border-white/20 hover:text-slate-400'}`}
                        onClick={() => handleLanguageChange(lang)}
                      >
                        {lang === 'cpp' ? 'C++' : lang === 'javascript' ? 'JavaScript' : 'Java'}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex-1">
                  <Editor
                    height="100%"
                    language={getLanguageForMonaco(selectedLanguage)}
                    value={code}
                    onChange={handleEditorChange}
                    onMount={handleEditorDidMount}
                    theme="vs-dark"
                    options={{
                      fontSize: 14,
                      minimap: { enabled: false },
                      scrollBeyondLastLine: false,
                      automaticLayout: true,
                      tabSize: 2,
                      insertSpaces: true,
                      wordWrap: 'on',
                      lineNumbers: 'on',
                      glyphMargin: false,
                      folding: true,
                      lineDecorationsWidth: 10,
                      lineNumbersMinChars: 3,
                      renderLineHighlight: 'line',
                      selectOnLineNumbers: true,
                      roundedSelection: false,
                      readOnly: false,
                      cursorStyle: 'line',
                      mouseWheelZoom: true,
                    }}
                  />
                </div>

                <div className="flex shrink-0 items-center justify-between border-t border-rose-500/10 bg-[#0f0707] px-4 py-2.5">
                  <div>
                    <button className="rounded-lg border border-white/10 bg-transparent px-4.5 py-2 text-[0.82rem] font-semibold text-slate-500 transition-all duration-150 hover:border-white/20 hover:text-slate-400 font-['Plus_Jakarta_Sans',sans-serif]" onClick={() => setActiveRightTab('testcase')}>
                      Console
                    </button>
                  </div>
                  <div className="flex gap-2">
                    <button className="rounded-lg border border-rose-500/35 bg-transparent px-4.5 py-2 text-[0.82rem] font-semibold text-rose-450 transition-all duration-150 hover:bg-rose-500/10 disabled:cursor-not-allowed disabled:opacity-50 font-['Plus_Jakarta_Sans',sans-serif]" onClick={handleRun} disabled={loading}>
                      {loading ? 'Running...' : 'Run'}
                    </button>
                    <button className="rounded-lg border border-rose-500/50 bg-gradient-to-br from-rose-500 to-rose-600 px-4.5 py-2 text-[0.82rem] font-semibold text-white shadow-[0_2px_12px_rgba(244,63,94,0.25)] transition-all duration-150 hover:shadow-[0_4px_18px_rgba(244,63,94,0.35)] disabled:cursor-not-allowed disabled:opacity-50 font-['Plus_Jakarta_Sans',sans-serif]" onClick={handleSubmitCode} disabled={loading}>
                      {loading ? 'Submitting...' : 'Submit'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeRightTab === 'testcase' && (
              <div className="flex-grow flex flex-col overflow-hidden h-full bg-[#060101]">
                <div className="flex shrink-0 items-center justify-between border-b border-rose-500/10 bg-[#0f0707] px-6 py-3">
                  <span className="text-sm font-black uppercase tracking-wider text-slate-200">Test Results</span>
                  <button
                    onClick={() => setActiveRightTab('code')}
                    className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition"
                  >
                    <X size={16} />
                  </button>
                </div>
                <div className="flex-grow overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-rose-500/20 scrollbar-track-transparent">
                  {runResult ? (
                    <div className={`mb-3 rounded-2xl border p-5 backdrop-blur-md ${runResult.success ? 'border-green-500/20 bg-green-500/10' : 'border-red-500/20 bg-red-500/10'}`}>
                      {runResult.success ? (
                        <div>
                          <div className="mb-2 text-base font-bold text-[#4ade80]">✅ All test cases passed!</div>
                          <div className="mb-1 text-[0.82rem] text-slate-400">Runtime: {runResult.runtime} sec</div>
                          <div className="mb-1 text-[0.82rem] text-slate-400">Memory: {runResult.memory} KB</div>
                          <div className="mt-4 space-y-3">
                            {runResult.testCases.map((tc, i) => (
                              <div key={i} className="rounded-xl border border-white/5 bg-black/40 p-3.5 text-[0.82rem] leading-relaxed text-slate-350">
                                <div><strong className="text-slate-400">Input:</strong> {tc.stdin}</div>
                                <div><strong className="text-slate-400">Expected:</strong> {tc.expected_output}</div>
                                <div><strong className="text-slate-400">Output:</strong> {tc.stdout}</div>
                                <div className="font-semibold text-green-450 mt-1">✓ Passed</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div className="mb-2 text-base font-bold text-[#f87171]">❌ {runResult.error || 'Error'}</div>
                          {runResult.testCases && (
                            <div className="mt-4 space-y-3">
                              {runResult.testCases.map((tc, i) => (
                                <div key={i} className="rounded-xl border border-white/5 bg-black/40 p-3.5 text-[0.82rem] leading-relaxed text-slate-305">
                                  <div><strong className="text-slate-400">Input:</strong> {tc.stdin}</div>
                                  <div><strong className="text-slate-400">Expected:</strong> {tc.expected_output}</div>
                                  <div><strong className="text-slate-400">Output:</strong> {tc.stdout}</div>
                                  <div className={tc.status_id == 3 ? 'font-semibold text-green-450 mt-1' : 'font-semibold text-red-400 mt-1'}>
                                    {tc.status_id == 3 ? '✓ Passed' : '✗ Failed'}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="mt-3 text-[0.85rem] text-slate-550">Click "Run" to test your code with the example test cases.</p>
                  )}
                </div>
              </div>
            )}

            {activeRightTab === 'result' && (
              <div className="flex-grow flex flex-col overflow-hidden h-full bg-[#060101]">
                <div className="flex shrink-0 items-center justify-between border-b border-rose-500/10 bg-[#0f0707] px-6 py-3">
                  <span className="text-sm font-black uppercase tracking-wider text-slate-200">Submission Result</span>
                  <button
                    onClick={() => setActiveRightTab('code')}
                    className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition"
                  >
                    <X size={16} />
                  </button>
                </div>
                <div className="flex-grow overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-rose-500/20 scrollbar-track-transparent">
                  {submitResult ? (
                    <div className={`mb-3 rounded-2xl border p-5 backdrop-blur-md ${submitResult.accepted ? 'border-green-500/20 bg-green-500/10' : 'border-red-500/20 bg-red-500/10'}`}>
                      {submitResult.accepted ? (
                        <div>
                          <div className="mb-2 text-base font-bold text-[#4ade80]">🎉 Accepted</div>
                          <div className="mb-1 text-[0.82rem] text-slate-400">Test Cases Passed: {submitResult.passedTestCases}/{submitResult.totalTestCases}</div>
                          <div className="mb-1 text-[0.82rem] text-slate-400">Runtime: {submitResult.runtime} sec</div>
                          <div className="mb-1 text-[0.82rem] text-slate-400">Memory: {submitResult.memory} KB</div>
                        </div>
                      ) : (
                        <div>
                          <div className="mb-2 text-base font-bold text-[#f87171]">❌ {submitResult.error}</div>
                          <div className="mb-1 text-[0.82rem] text-slate-400">Test Cases Passed: {submitResult.passedTestCases}/{submitResult.totalTestCases}</div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="mt-3 text-[0.85rem] text-slate-550">Click "Submit" to submit your solution for evaluation.</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProblemPage;