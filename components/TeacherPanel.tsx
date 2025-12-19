
import React, { useState } from 'react';
import { generateCourseOutline, askTutor } from '../geminiService';
import { Course, Lesson, UserProfile } from '../types';

interface TeacherPanelProps {
  user: UserProfile;
  setUser: React.Dispatch<React.SetStateAction<UserProfile | null>>;
  onGoToWallet: () => void;
}

const TeacherPanel: React.FC<TeacherPanelProps> = ({ user, setUser, onGoToWallet }) => {
  const [isCreating, setIsCreating] = useState(false);
  const [topic, setTopic] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedOutline, setGeneratedOutline] = useState<string | null>(null);

  const [newCourse, setNewCourse] = useState<Partial<Course>>({
    title: '',
    instructor: 'You',
    category: 'Finance',
    description: '',
    thumbnail: '',
    modules: []
  });
  const [activeModuleIndex, setActiveModuleIndex] = useState<number | null>(null);
  const [activeLessonIndex, setActiveLessonIndex] = useState<number | null>(null);
  const [isWritingLesson, setIsWritingLesson] = useState(false);

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    setIsGenerating(true);
    const result = await generateCourseOutline(topic);
    setGeneratedOutline(result);
    setIsGenerating(false);
  };

  const startManualCreation = () => {
    setIsCreating(true);
    setNewCourse({
      title: topic || 'New Course Title',
      instructor: 'You',
      category: 'General',
      description: '',
      thumbnail: '',
      modules: [{ id: 'm1', title: 'Introduction', lessons: [] }]
    });
    setActiveModuleIndex(0);
  };

  const addModule = () => {
    const nextId = `m${(newCourse.modules?.length || 0) + 1}`;
    setNewCourse(prev => ({
      ...prev,
      modules: [...(prev.modules || []), { id: nextId, title: 'New Module', lessons: [] }]
    }));
    setActiveModuleIndex(newCourse.modules?.length || 0);
    setActiveLessonIndex(null);
  };

  const addLesson = (moduleIdx: number) => {
    setNewCourse(prev => {
      const updatedModules = [...(prev.modules || [])];
      const nextId = `l${Date.now()}`;
      updatedModules[moduleIdx].lessons.push({
        id: nextId,
        title: 'New Lesson',
        content: '',
        rewardPoints: 10,
        rewardCash: 1,
        completed: false
      });
      return { ...prev, modules: updatedModules };
    });
    setActiveLessonIndex((newCourse.modules![moduleIdx].lessons.length));
  };

  const updateLesson = (field: keyof Lesson, value: any) => {
    if (activeModuleIndex === null || activeLessonIndex === null) return;
    setNewCourse(prev => {
      const updatedModules = [...(prev.modules || [])];
      const lesson = updatedModules[activeModuleIndex].lessons[activeLessonIndex];
      (lesson as any)[field] = value;
      return { ...prev, modules: updatedModules };
    });
  };

  const aiWriteLesson = async () => {
    if (activeModuleIndex === null || activeLessonIndex === null) return;
    const lessonTitle = newCourse.modules![activeModuleIndex].lessons[activeLessonIndex].title;
    setIsWritingLesson(true);
    try {
      const content = await askTutor(`Write a 300-word lesson for: "${lessonTitle}" within the course "${newCourse.title}".`);
      updateLesson('content', content);
    } catch (e) {
      console.error(e);
    } finally {
      setIsWritingLesson(false);
    }
  };

  const totalRewards = newCourse.modules?.reduce((acc, m) => 
    acc + m.lessons.reduce((lAcc, l) => lAcc + l.rewardCash, 0), 0) || 0;

  if (isCreating) {
    return (
      <div className="flex flex-col h-[calc(100vh-160px)] animate-in fade-in duration-500">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-6">
            <button onClick={() => setIsCreating(false)} className="text-slate-400 hover:text-slate-600 font-bold text-xs uppercase tracking-widest transition-colors">← Exit Studio</button>
            <h2 className="text-3xl font-black text-slate-800 tracking-tighter">Curriculum Studio</h2>
          </div>
          <div className="flex items-center space-x-6">
            <div className="text-right">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Estimated Pool</p>
              <p className="text-2xl font-black text-emerald-600 tabular-nums">${totalRewards.toFixed(2)}</p>
            </div>
            <button className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black text-sm shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all uppercase tracking-widest">Publish</button>
          </div>
        </div>

        <div className="flex flex-1 gap-10 overflow-hidden">
          <div className="w-80 bg-white rounded-[3rem] border-2 border-slate-50 flex flex-col overflow-hidden shadow-sm">
            <div className="p-8 border-b border-slate-50 space-y-6">
               <input 
                  value={newCourse.title}
                  onChange={e => setNewCourse(prev => ({...prev, title: e.target.value}))}
                  className="w-full text-xl font-black text-slate-800 focus:outline-none placeholder:text-slate-200"
                  placeholder="Masterpiece Title..."
                />
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {newCourse.modules?.map((mod, mIdx) => (
                <div key={mod.id} className="space-y-3">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-3">{mod.title}</p>
                  <div className="space-y-1">
                    {mod.lessons.map((les, lIdx) => (
                      <button 
                        key={les.id}
                        onClick={() => { setActiveModuleIndex(mIdx); setActiveLessonIndex(lIdx); }}
                        className={`w-full text-left px-4 py-3.5 rounded-[1.25rem] text-sm transition-all truncate flex items-center space-x-3 ${
                          activeModuleIndex === mIdx && activeLessonIndex === lIdx
                          ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100 font-black'
                          : 'text-slate-600 hover:bg-slate-50 font-bold'
                        }`}
                      >
                        <span className="opacity-50 text-[10px]">0{lIdx + 1}</span>
                        <span className="truncate">{les.title}</span>
                      </button>
                    ))}
                    <button onClick={() => addLesson(mIdx)} className="w-full text-left px-4 py-3 text-[10px] font-black text-indigo-500 hover:text-indigo-700 uppercase tracking-widest transition-colors">+ Add Lesson</button>
                  </div>
                </div>
              ))}
              <button onClick={addModule} className="w-full py-5 border-2 border-dashed border-slate-100 rounded-[2rem] text-slate-400 text-[10px] font-black uppercase tracking-widest hover:border-indigo-200 hover:text-indigo-500 transition-all">+ New Module</button>
            </div>
          </div>

          <div className="flex-1 bg-white rounded-[3.5rem] border-2 border-slate-50 shadow-sm flex flex-col overflow-hidden">
            {activeModuleIndex !== null && activeLessonIndex !== null ? (
              <div className="p-10 space-y-10 overflow-y-auto">
                <div className="flex justify-between items-start">
                  <div className="flex-1 mr-10 space-y-2">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Lesson Title</p>
                    <input 
                      value={newCourse.modules![activeModuleIndex].lessons[activeLessonIndex].title} 
                      onChange={e => updateLesson('title', e.target.value)} 
                      className="text-4xl font-black text-slate-800 w-full focus:outline-none tracking-tighter" 
                    />
                  </div>
                  <div className="flex space-x-4">
                    <div className="p-4 bg-slate-50 rounded-2xl text-center min-w-[100px]">
                      <p className="text-[10px] font-black text-slate-400 uppercase mb-1">LP</p>
                      <input type="number" value={newCourse.modules![activeModuleIndex].lessons[activeLessonIndex].rewardPoints} onChange={e => updateLesson('rewardPoints', parseInt(e.target.value))} className="bg-transparent text-indigo-600 font-black text-xl w-full text-center focus:outline-none" />
                    </div>
                    <div className="p-4 bg-slate-50 rounded-2xl text-center min-w-[100px]">
                      <p className="text-[10px] font-black text-slate-400 uppercase mb-1">USD</p>
                      <input type="number" value={newCourse.modules![activeModuleIndex].lessons[activeLessonIndex].rewardCash} onChange={e => updateLesson('rewardCash', parseFloat(e.target.value))} className="bg-transparent text-emerald-600 font-black text-xl w-full text-center focus:outline-none" />
                    </div>
                  </div>
                </div>
                <div className="relative group">
                  <div className="absolute -top-10 right-0">
                    <button onClick={aiWriteLesson} disabled={isWritingLesson} className="flex items-center space-x-2 bg-indigo-50 text-indigo-600 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all shadow-sm">
                      <span>{isWritingLesson ? 'Architecting...' : '✨ Gemini Content'}</span>
                    </button>
                  </div>
                  <textarea value={newCourse.modules![activeModuleIndex].lessons[activeLessonIndex].content} onChange={e => updateLesson('content', e.target.value)} placeholder="Enter the wisdom here..." className="w-full h-[500px] bg-slate-50 rounded-[2.5rem] p-10 text-slate-700 focus:outline-none border-2 border-transparent focus:border-indigo-100 font-serif leading-relaxed text-lg" />
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-400 p-20 text-center space-y-6">
                <div className="text-8xl opacity-20">✍️</div>
                <div>
                   <h3 className="text-2xl font-black text-slate-800 mb-2">Editor Dormant</h3>
                   <p className="max-w-sm font-medium text-slate-500">Select an asset from your curriculum structure to begin the architectural process.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12 animate-in fade-in duration-500 pb-20">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 bg-white p-12 rounded-[4rem] shadow-sm border-2 border-slate-50">
          <h3 className="text-3xl font-black text-slate-800 tracking-tighter mb-4">Deploy New Assets</h3>
          <p className="text-slate-500 text-lg leading-relaxed font-medium mb-10">Transform your expertise into automated income streams. Launch courses, live sessions, or interactive workshops.</p>
          <div className="space-y-6">
            <div className="space-y-3">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] ml-1">Asset Vision</label>
              <input value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="e.g. Masterclass on Neural Architecture Search" className="w-full bg-slate-50 border-2 border-slate-50 rounded-[1.5rem] px-8 py-6 text-slate-800 focus:border-indigo-500 focus:outline-none transition-all placeholder:text-slate-300 font-bold" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <button onClick={handleGenerate} disabled={isGenerating || !topic.trim()} className="bg-indigo-600 text-white font-black py-6 rounded-[1.5rem] shadow-2xl shadow-indigo-100 hover:bg-indigo-700 transition-all disabled:opacity-50 text-xs uppercase tracking-widest">
                {isGenerating ? 'AI Generating...' : 'AI Driven Builder'}
              </button>
              <button onClick={startManualCreation} className="bg-white border-2 border-slate-100 text-slate-700 font-black py-6 rounded-[1.5rem] hover:bg-slate-50 transition-all text-xs uppercase tracking-widest">Architect Manual</button>
            </div>
          </div>
        </div>

        <div className="bg-slate-900 p-12 rounded-[4rem] shadow-2xl text-white flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-[-20%] right-[-20%] w-64 h-64 bg-indigo-500/10 rounded-full blur-[80px]"></div>
          <div className="relative z-10">
            <div className="flex justify-between items-center mb-10">
              <p className="text-[10px] font-black text-indigo-300 uppercase tracking-widest">QRPay Settlement</p>
              <span className="bg-emerald-500 text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest">Online</span>
            </div>
            <p className="text-slate-400 text-xs font-black uppercase tracking-widest mb-2">Instructor Liquidity</p>
            <h3 className="text-5xl font-black mb-2 tabular-nums">${user.balance.toFixed(2)}</h3>
            <p className="text-xs text-indigo-400 font-black uppercase tracking-widest">Next payout: 14 Dec</p>
            
            <div className="mt-10 space-y-4 border-t border-white/10 pt-10">
               <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest opacity-60">
                  <span>Linked Node</span>
                  <span className="text-white">QRPay Instant</span>
               </div>
               <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest opacity-60">
                  <span>Active Yields</span>
                  <span className="text-white">4 Modules</span>
               </div>
            </div>
          </div>
          <button onClick={onGoToWallet} className="w-full bg-indigo-600 text-white py-6 rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-600/30 relative z-10 mt-10">
            Settlement Hub
          </button>
        </div>
      </div>

      <div className="bg-white p-12 rounded-[4rem] shadow-sm border-2 border-slate-50">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-10 mb-12">
          <div>
            <h3 className="text-3xl font-black text-slate-800 tracking-tighter">Yield Analytics</h3>
            <p className="text-slate-500 font-medium text-lg mt-1">Detailed performance audit across your ecosystem.</p>
          </div>
          <div className="flex items-center space-x-2 bg-slate-100 p-2 rounded-[1.5rem]">
            <button className="px-6 py-3 bg-white shadow-sm rounded-xl text-[10px] font-black text-slate-800 uppercase tracking-widest">Yield Ledger</button>
            <button className="px-6 py-3 text-[10px] font-black text-slate-400 hover:text-slate-600 uppercase tracking-widest">Global Heatmap</button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8 mb-12">
          <div className="p-8 bg-slate-50 rounded-[3rem] border-2 border-white shadow-sm hover:border-indigo-100 transition-all group">
            <div className="w-14 h-14 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center text-3xl mb-8 group-hover:scale-110 transition-transform">🎒</div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Direct Course Sales</p>
            <h4 className="text-4xl font-black text-slate-800 tabular-nums">$12,400</h4>
          </div>

          <div className="p-8 bg-slate-50 rounded-[3rem] border-2 border-white shadow-sm hover:border-emerald-100 transition-all group">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center text-3xl mb-8 group-hover:scale-110 transition-transform">🎥</div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Live Hosting Fees</p>
            <h4 className="text-4xl font-black text-slate-800 tabular-nums">$2,150</h4>
          </div>

          <div className="p-8 bg-slate-50 rounded-[3rem] border-2 border-white shadow-sm hover:border-violet-100 transition-all group">
            <div className="w-14 h-14 bg-violet-100 text-violet-600 rounded-2xl flex items-center justify-center text-3xl mb-8 group-hover:scale-110 transition-transform">🔗</div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Referral Bonuses</p>
            <h4 className="text-4xl font-black text-slate-800 tabular-nums">${user.totalReferralEarnings.toFixed(2)}</h4>
          </div>

          <div className="p-8 bg-indigo-600 rounded-[3rem] shadow-2xl text-white">
            <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center text-3xl mb-8">✨</div>
            <p className="text-[10px] font-black text-indigo-200 uppercase tracking-widest mb-1">Impact Multiplier</p>
            <h4 className="text-4xl font-black tabular-nums">1.2x</h4>
            <p className="text-[10px] font-bold mt-4 opacity-70 uppercase tracking-widest">Active Bonus Level</p>
          </div>
        </div>

        <div className="space-y-6">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] px-2">Micro-Revenue Attribution</p>
          <div className="overflow-x-auto rounded-[2.5rem] border-2 border-slate-50 shadow-sm">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/80 text-slate-400 text-[10px] uppercase font-black tracking-[0.25em]">
                  <th className="px-10 py-6">Knowledge Asset</th>
                  <th className="px-10 py-6">Engagement</th>
                  <th className="px-10 py-6">Direct Revenue</th>
                  <th className="px-10 py-6">Referral Commission</th>
                  <th className="px-10 py-6">Live Bonus</th>
                  <th className="px-10 py-6 text-right">Net Yield</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {[
                  { name: 'Advanced TypeScript Architecture', students: 482, revenue: 12400, referral: 320, live: 450 },
                  { name: 'UI/UX Design Masterclass', students: 128, revenue: 3050, referral: 85, live: 120 },
                  { name: 'Web3 Security Basics', students: 954, revenue: 8150, referral: 450, live: 890 },
                ].map((item, idx) => (
                  <tr key={idx} className="group hover:bg-slate-50 transition-colors">
                    <td className="px-10 py-8">
                       <p className="font-black text-slate-800 text-sm">{item.name}</p>
                    </td>
                    <td className="px-10 py-8">
                       <span className="text-xs font-bold text-slate-500 tabular-nums">{item.students.toLocaleString()} Students</span>
                    </td>
                    <td className="px-10 py-8 font-black text-slate-800 tabular-nums text-sm">${item.revenue.toLocaleString()}</td>
                    <td className="px-10 py-8 font-bold text-violet-600 tabular-nums text-sm">+${item.referral}</td>
                    <td className="px-10 py-8 font-bold text-emerald-600 tabular-nums text-sm">+${item.live}</td>
                    <td className="px-10 py-8 text-right font-black text-indigo-600 tabular-nums text-sm">
                       ${(item.revenue + item.referral + item.live).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {generatedOutline && (
        <div className="bg-white p-12 rounded-[4rem] shadow-sm border-2 border-slate-50 animate-in fade-in slide-in-from-bottom-8">
          <div className="flex justify-between items-center mb-10">
            <h3 className="text-3xl font-black text-slate-800 tracking-tighter">Architectural Preview</h3>
            <button onClick={() => setGeneratedOutline(null)} className="text-slate-400 hover:text-red-500 font-black uppercase text-[10px] tracking-widest transition-colors">Discard Build</button>
          </div>
          <div className="prose prose-slate max-w-none bg-slate-50 p-12 rounded-[3rem] border-2 border-slate-100 mb-10">
            <div className="whitespace-pre-wrap font-mono text-sm leading-relaxed text-slate-700">
              {generatedOutline}
            </div>
          </div>
          <button onClick={startManualCreation} className="w-full bg-indigo-600 text-white font-black py-8 rounded-[2.5rem] shadow-2xl shadow-indigo-100 hover:bg-indigo-700 transition-all text-xl uppercase tracking-widest">Commit to Studio Editor</button>
        </div>
      )}
    </div>
  );
};

export default TeacherPanel;
