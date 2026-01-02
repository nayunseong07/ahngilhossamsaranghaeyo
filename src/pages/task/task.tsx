
import React, { useState } from 'react';
import { analyzeAssignment, getDraftFeedback, AssignmentResult, FeedbackResult } from './services/geminiService';

const App: React.FC = () => {
  const [step, setStep] = useState<'input' | 'loading' | 'result' | 'drafting' | 'feedback_loading' | 'feedback_result'>('input');
  const [topic, setTopic] = useState('');
  const [length, setLength] = useState('');
  const [format, setFormat] = useState('');
  const [draft, setDraft] = useState('');
  const [result, setResult] = useState<AssignmentResult | null>(null);
  const [feedback, setFeedback] = useState<FeedbackResult | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic || !length || !format) return;
    setStep('loading');
    try {
      const data = await analyzeAssignment(topic, length, format);
      setResult(data);
      setStep('result');
    } catch (error) {
      console.error(error);
      alert('분석 중 오류가 발생했습니다.');
      setStep('input');
    }
  };

  const handleGoToDraft = () => {
    setStep('drafting');
  };

  const handleFeedbackSubmit = async () => {
    if (!draft) return;
    setStep('feedback_loading');
    try {
      const data = await getDraftFeedback(topic, draft);
      setFeedback(data);
      setStep('feedback_result');
    } catch (error) {
      console.error(error);
      alert('피드백 생성 중 오류가 발생했습니다.');
      setStep('drafting');
    }
  };

  const handleReset = () => {
    setStep('input');
    setTopic('');
    setLength('');
    setFormat('');
    setDraft('');
    setResult(null);
    setFeedback(null);
  };

  return (
    <div className="min-h-screen p-4 md:p-8 flex flex-col items-center">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-indigo-600 mb-2">🚀 TaskHero</h1>
        <p className="text-slate-600">중2 과제, 이제 AI 멘토와 함께 시작해봐!</p>
      </header>

      <main className="w-full max-w-2xl bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
        {step === 'input' && (
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700">📌 과제 주제가 뭐야?</label>
              <input 
                type="text" 
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="예: 기후 변화가 우리 마을에 미치는 영향"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-400 focus:border-transparent outline-none transition-all"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700">📏 분량은 어느 정도?</label>
                <input 
                  type="text" 
                  value={length}
                  onChange={(e) => setLength(e.target.value)}
                  placeholder="예: A4 1장 내외"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-400 focus:border-transparent outline-none transition-all"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700">📂 제출 형식</label>
                <input 
                  type="text" 
                  value={format}
                  onChange={(e) => setFormat(e.target.value)}
                  placeholder="예: PPT, 한글 문서"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-400 focus:border-transparent outline-none transition-all"
                  required
                />
              </div>
            </div>
            <button 
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl shadow-lg transform active:scale-95 transition-all duration-200"
            >
              분석 시작하기
            </button>
          </form>
        )}

        {(step === 'loading' || step === 'feedback_loading') && (
          <div className="p-12 flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            <p className="text-indigo-600 font-semibold animate-pulse text-center">
              {step === 'loading' ? 'AI 멘토가 과제를 읽고 분석하는 중...' : '작성한 초안을 꼼꼼히 읽어보고 있어!'}
            </p>
          </div>
        )}

        {step === 'result' && result && (
          <div className="p-6 space-y-6 animate-in fade-in duration-500">
            <section className="bg-indigo-50 p-4 rounded-xl border-l-4 border-indigo-500">
              <h2 className="text-indigo-900 font-bold mb-1">📝 한줄 요약</h2>
              <p className="text-indigo-800 text-sm">{result.summary}</p>
            </section>
            <section className="space-y-4">
              <h2 className="text-xl font-bold text-slate-800 border-b pb-2">📂 논리 구조 제안</h2>
              {result.outline.map((item, idx) => (
                <div key={idx} className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <h3 className="font-bold text-indigo-600 flex items-center gap-2 mb-2">
                    <span className="flex items-center justify-center w-6 h-6 bg-indigo-100 rounded-full text-xs">{idx + 1}</span>
                    {item.title}
                  </h3>
                  <ul className="list-disc list-inside space-y-1">
                    {item.points.map((point, pIdx) => (
                      <li key={pIdx} className="text-sm text-slate-600 pl-2">{point}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </section>
            <div className="space-y-3">
              <button onClick={handleGoToDraft} className="w-full bg-indigo-600 text-white font-bold py-4 rounded-xl shadow-md hover:bg-indigo-700 transition-all transform active:scale-95">
                초안 작성하러 가기
              </button>
              <button onClick={handleReset} className="w-full border-2 border-slate-200 text-slate-500 font-bold py-3 rounded-xl hover:bg-slate-50 transition-colors">
                다시 입력하기
              </button>
            </div>
          </div>
        )}

        {step === 'drafting' && (
          <div className="p-6 space-y-4 animate-in slide-in-from-right duration-300">
            <h2 className="text-xl font-bold text-slate-800">✍️ 초안을 작성해봐!</h2>
            <p className="text-sm text-slate-500">생각나는 대로 편하게 적어도 돼. AI가 도와줄 거야.</p>
            <textarea 
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="여기에 내용을 입력하거나 붙여넣어줘..."
              className="w-full h-64 p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-400 focus:border-transparent outline-none transition-all resize-none"
            />
            <div className="grid grid-cols-2 gap-4">
              <button onClick={() => setStep('result')} className="border-2 border-slate-200 text-slate-500 font-bold py-3 rounded-xl">뒤로가기</button>
              <button onClick={handleFeedbackSubmit} disabled={!draft} className={`font-bold py-3 rounded-xl shadow-md transition-all ${draft ? 'bg-indigo-600 text-white active:scale-95' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}>피드백 받기</button>
            </div>
          </div>
        )}

        {step === 'feedback_result' && feedback && (
          <div className="p-6 space-y-6 animate-in zoom-in duration-300">
            <h2 className="text-2xl font-bold text-slate-800 text-center">🎉 AI 피드백 도착!</h2>
            
            <section className="space-y-3">
              <h3 className="font-bold text-green-600 flex items-center gap-2">👍 잘한 점</h3>
              <ul className="space-y-2">
                {feedback.positives.map((p, i) => (
                  <li key={i} className="text-sm bg-green-50 p-3 rounded-lg border border-green-100">{p}</li>
                ))}
              </ul>
            </section>

            <section className="space-y-3">
              <h3 className="font-bold text-orange-600 flex items-center gap-2">💡 이렇게 개선해보자</h3>
              <ul className="space-y-2">
                {feedback.improvements.map((imp, i) => (
                  <li key={i} className="text-sm bg-orange-50 p-3 rounded-lg border border-orange-100">{imp}</li>
                ))}
              </ul>
            </section>

            <section className="space-y-3">
              <h3 className="font-bold text-indigo-600">✨ AI가 다듬어본 예시</h3>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 italic text-slate-700 text-sm whitespace-pre-wrap leading-relaxed">
                "{feedback.revisedText}"
              </div>
            </section>

            <div className="pt-4 space-y-3">
              <button onClick={() => setStep('drafting')} className="w-full bg-indigo-600 text-white font-bold py-4 rounded-xl">고치러 가기</button>
              <button onClick={handleReset} className="w-full text-slate-400 text-sm">처음으로 돌아가기</button>
            </div>
          </div>
        )}
      </main>

      <footer className="mt-12 text-center text-slate-400 text-xs">
        <p>&copy; 2024 TaskHero. 중학교 2학년을 위해 제작됨.</p>
      </footer>
    </div>
  );
};

export default App;
