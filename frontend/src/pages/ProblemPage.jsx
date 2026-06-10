import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import Editor from '@monaco-editor/react';
import { useParams, NavLink } from 'react-router';
import axiosClient from "../utils/axiosClient"
import SubmissionHistory from "../components/SubmissionHistory"
import ChatAi from '../components/ChatAi';
import Editorial from '../components/Editorial';
import { ArrowLeft } from 'lucide-react';

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
  const editorRef = useRef(null);
  let { problemId } = useParams();

  const { handleSubmit } = useForm();

  useEffect(() => {
    const fetchProblem = async () => {
      setLoading(true);
      try {
        const response = await axiosClient.get(`/problem/problemById/${problemId}`);
        const codeObj = response.data.startCode?.find(sc => sc.language === langMap[selectedLanguage]);
        const initialCode = codeObj ? codeObj.initialCode : "";
        setProblem(response.data);
        setCode(initialCode);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching problem:', error);
        setLoading(false);
      }
    };
    fetchProblem();
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
      case 'easy': return 'border-green-500/25 bg-green-500/10 text-green-400';
      case 'medium': return 'border-amber-500/25 bg-amber-500/10 text-amber-400';
      case 'hard': return 'border-red-500/25 bg-red-500/10 text-red-400';
      default: return 'border-slate-500/20 bg-slate-500/10 text-slate-400';
    }
  };

  if (loading && !problem) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#07080d]">
        <div className="h-10 w-10 animate-[app-spin_0.8s_linear_infinite] rounded-full border-[3px] border-cyan-300/15 border-t-[#22d3ee]" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#07080d] text-slate-200 font-['Syne',sans-serif]">
      {/* ── HEADER BAR ── */}
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-cyan-300/15 bg-[#111318] px-6">
        <div className="flex items-center gap-4">
          <NavLink
            to="/problems"
            className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold text-slate-300 transition hover:bg-white/10 hover:text-white no-underline"
          >
            <ArrowLeft size={14} /> Back to Problems
          </NavLink>
          <div className="h-4 w-px bg-cyan-300/15" />
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
            <span className="rounded-md border border-cyan-500/15 bg-cyan-500/[0.08] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-cyan-500">
              {problem.tags}
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
        <div className="flex w-1/2 flex-col border-r border-cyan-300/15">
        <div className="flex shrink-0 items-center gap-0.5 border-b border-cyan-300/15 bg-[#111318] px-3">
          {['description', 'editorial', 'solutions', 'submissions', 'chatAI'].map(tab => (
            <button
              key={tab}
              className={`px-4 py-2.5 text-[0.82rem] font-semibold whitespace-nowrap border-b-2 transition-colors duration-150 font-['Syne',sans-serif] ${activeLeftTab === tab ? 'border-cyan-400 text-cyan-300' : 'border-transparent text-slate-500 hover:text-slate-400'}`}
              onClick={() => setActiveLeftTab(tab)}
            >
              {tab === 'chatAI' ? 'Chat AI' : tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-cyan-300/30 scrollbar-track-transparent">
          {problem && (
            <>
              {activeLeftTab === 'description' && (
                <div>
                  <div className="mb-5 flex flex-wrap items-center gap-2.5">
                    <h1 className="text-xl font-extrabold text-slate-100">{problem.title}</h1>
                    <span className={`rounded-md border px-2.5 py-1 text-[0.72rem] font-semibold capitalize ${getDifficultyColor(problem.difficulty)}`}>
                      {problem.difficulty.charAt(0).toUpperCase() + problem.difficulty.slice(1)}
                    </span>
                    <span className="rounded-md border border-cyan-400/20 bg-cyan-400/10 px-2.5 py-1 text-[0.72rem] font-semibold text-cyan-300">
                      {problem.tags}
                    </span>
                  </div>

                  <div className="whitespace-pre-wrap text-[0.88rem] leading-relaxed text-slate-400">
                    {problem.description}
                  </div>

                  <div className="mb-3.5 mt-7 text-base font-bold text-slate-200">Examples</div>
                  <div>
                    {problem.visibleTestCases.map((example, index) => (
                      <div key={index} className="mb-2.5 rounded-lg border border-cyan-300/15 bg-[#161922]/80 px-4 py-3.5">
                        <div className="mb-2 text-sm font-bold text-cyan-300">Example {index + 1}</div>
                        <div className="mb-1 text-[0.82rem] leading-relaxed text-slate-400"><strong className="text-slate-300">Input:</strong> {example.input}</div>
                        <div className="mb-1 text-[0.82rem] leading-relaxed text-slate-400"><strong className="text-slate-300">Output:</strong> {example.output}</div>
                        <div className="mb-1 text-[0.82rem] leading-relaxed text-slate-400"><strong className="text-slate-300">Explanation:</strong> {example.explanation}</div>
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
                <div>
                  <div className="mb-4 text-lg font-bold text-slate-200">Solutions</div>
                  {problem.referenceSolution?.map((solution, index) => (
                    <div key={index} className="mb-4 overflow-hidden rounded-lg border border-cyan-300/15">
                      <div className="border-b border-cyan-300/15 bg-[#161922]/90 px-4 py-2.5 text-[0.85rem] font-semibold text-slate-400">
                        {problem?.title} — {solution?.language}
                      </div>
                      <div className="overflow-x-auto bg-[#0d0f14] p-4 text-[0.8rem] leading-relaxed text-slate-400">
                        <pre className="m-0"><code>{solution?.completeCode}</code></pre>
                      </div>
                    </div>
                  )) || <p className="mt-3 text-[0.85rem] text-slate-600">Solutions will be available after you solve the problem.</p>}
                </div>
              )}

              {activeLeftTab === 'submissions' && (
                <div>
                  <div className="mb-4 text-lg font-bold text-slate-200">My Submissions</div>
                  <SubmissionHistory problemId={problemId} />
                </div>
              )}

              {activeLeftTab === 'chatAI' && (
                <div>
                  <div className="mb-4 text-lg font-bold text-slate-200">Chat with AI</div>
                  <div className="text-[0.88rem] leading-[1.75]">
                    <ChatAi problem={problem} />
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div className="flex w-1/2 flex-col">
        <div className="flex shrink-0 items-center gap-0.5 border-b border-cyan-300/15 bg-[#111318] px-3">
          {['code', 'testcase', 'result'].map(tab => (
            <button
              key={tab}
              className={`px-4 py-2.5 text-[0.82rem] font-semibold whitespace-nowrap border-b-2 transition-colors duration-150 font-['Syne',sans-serif] ${activeRightTab === tab ? 'border-cyan-400 text-cyan-300' : 'border-transparent text-slate-500 hover:text-slate-400'}`}
              onClick={() => setActiveRightTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        <div className="flex flex-1 flex-col overflow-hidden">
          {activeRightTab === 'code' && (
            <div className="flex flex-1 flex-col">
              <div className="flex shrink-0 items-center justify-between border-b border-cyan-300/15 bg-[#111318] px-4 py-2.5">
                <div className="flex gap-1.5">
                  {['javascript', 'java', 'cpp'].map(lang => (
                    <button
                      key={lang}
                      className={`rounded-md border px-3.5 py-1 text-[0.8rem] font-semibold transition-all duration-150 font-['Syne',sans-serif] ${selectedLanguage === lang ? 'border-cyan-400/40 bg-cyan-300/15 text-cyan-300' : 'border-cyan-300/20 bg-transparent text-slate-500 hover:border-cyan-300/35 hover:text-slate-400'}`}
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

              <div className="flex shrink-0 items-center justify-between border-t border-cyan-300/15 bg-[#111318] px-4 py-2.5">
                <div>
                  <button className="rounded-lg border border-cyan-300/15 bg-transparent px-4.5 py-2 text-[0.82rem] font-semibold text-slate-500 transition-all duration-150 hover:border-cyan-300/30 hover:text-slate-400 font-['Syne',sans-serif]" onClick={() => setActiveRightTab('testcase')}>
                    Console
                  </button>
                </div>
                <div className="flex gap-2">
                  <button className="rounded-lg border border-cyan-300/35 bg-transparent px-4.5 py-2 text-[0.82rem] font-semibold text-cyan-300 transition-all duration-150 hover:bg-cyan-300/10 disabled:cursor-not-allowed disabled:opacity-50 font-['Syne',sans-serif]" onClick={handleRun} disabled={loading}>
                    {loading ? 'Running...' : 'Run'}
                  </button>
                  <button className="rounded-lg border border-indigo-500/50 bg-gradient-to-br from-cyan-400 to-indigo-600 px-4.5 py-2 text-[0.82rem] font-semibold text-white shadow-[0_2px_12px_rgba(99,102,241,0.25)] transition-all duration-150 hover:shadow-[0_4px_18px_rgba(99,102,241,0.35)] disabled:cursor-not-allowed disabled:opacity-50 font-['Syne',sans-serif]" onClick={handleSubmitCode} disabled={loading}>
                    {loading ? 'Submitting...' : 'Submit'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeRightTab === 'testcase' && (
            <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-cyan-300/30 scrollbar-track-transparent">
              <div className="mb-4 text-lg font-bold text-slate-200">Test Results</div>
              {runResult ? (
                <div className={`mb-3 rounded-lg border p-4 ${runResult.success ? 'border-green-500/20 bg-green-500/10' : 'border-red-500/20 bg-red-500/10'}`}>
                  {runResult.success ? (
                    <div>
                      <div className="mb-2 text-base font-bold text-[#4ade80]">✅ All test cases passed!</div>
                      <div className="mb-1 text-[0.82rem] text-slate-400">Runtime: {runResult.runtime} sec</div>
                      <div className="mb-1 text-[0.82rem] text-slate-400">Memory: {runResult.memory} KB</div>
                      <div className="mt-3">
                        {runResult.testCases.map((tc, i) => (
                          <div key={i} className="mt-2 rounded-lg border border-cyan-300/10 bg-[#0d0f14]/80 p-3 text-[0.78rem] leading-relaxed text-slate-400">
                            <div><strong className="text-slate-300">Input:</strong> {tc.stdin}</div>
                            <div><strong className="text-slate-300">Expected:</strong> {tc.expected_output}</div>
                            <div><strong className="text-slate-300">Output:</strong> {tc.stdout}</div>
                            <div className="font-semibold text-green-400">✓ Passed</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="mb-2 text-base font-bold text-[#f87171]">❌ {runResult.error || 'Error'}</div>
                      {runResult.testCases && (
                        <div className="mt-3">
                          {runResult.testCases.map((tc, i) => (
                            <div key={i} className="mt-2 rounded-lg border border-cyan-300/10 bg-[#0d0f14]/80 p-3 text-[0.78rem] leading-relaxed text-slate-400">
                              <div><strong className="text-slate-300">Input:</strong> {tc.stdin}</div>
                              <div><strong className="text-slate-300">Expected:</strong> {tc.expected_output}</div>
                              <div><strong className="text-slate-300">Output:</strong> {tc.stdout}</div>
                              <div className={tc.status_id == 3 ? 'font-semibold text-green-400' : 'font-semibold text-red-400'}>
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
                <p className="mt-3 text-[0.85rem] text-slate-600">Click "Run" to test your code with the example test cases.</p>
              )}
            </div>
          )}

          {activeRightTab === 'result' && (
            <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-cyan-300/30 scrollbar-track-transparent">
              <div className="mb-4 text-lg font-bold text-slate-200">Submission Result</div>
              {submitResult ? (
                <div className={`mb-3 rounded-lg border p-4 ${submitResult.accepted ? 'border-green-500/20 bg-green-500/10' : 'border-red-500/20 bg-red-500/10'}`}>
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
                <p className="mt-3 text-[0.85rem] text-slate-600">Click "Submit" to submit your solution for evaluation.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
);
};

export default ProblemPage;