
import React, { useState, useEffect } from 'react';
import { Course, UserProfile, Module, Lesson } from '../types';
import { getDeepDive } from '../geminiService';

const MOCK_COURSE_CONTENT: Record<string, Course> = {
  '1': {
    id: '1', title: 'Financial Freedom 101', instructor: 'Dave Ramsey', price: 0, rewardPool: 50, category: 'Finance', thumbnail: '', description: 'Master your money.',
    modules: [
      {
        id: 'm1', title: 'The Psychology of Money', lessons: [
          { id: 'l1', title: 'Mindset Shift', content: 'In this lesson, we explore how childhood experiences shape your spending habits. Money is 80% behavior and 20% head knowledge.', rewardPoints: 20, rewardCash: 5, completed: false },
          { id: 'l2', title: 'Scarcity vs Abundance', content: 'Learn to recognize when you are operating out of fear rather than strategy.', rewardPoints: 20, rewardCash: 5, completed: false }
        ]
      },
      {
        id: 'm2', title: 'Debt Elimination', lessons: [
          { id: 'l3', title: 'The Snowball Method', content: 'List your debts from smallest to largest. Pay off the small ones first to build momentum.', rewardPoints: 50, rewardCash: 15, completed: false }
        ]
      }
    ]
  },
  '2': {
    id: '2', title: 'Mastering React & TS', instructor: 'Kent Dodds', price: 49, rewardPool: 200, category: 'Tech', thumbnail: '', description: 'Professional web dev.',
    modules: [
      {
        id: 'r1', title: 'Hooks Foundation', lessons: [
          { id: 'rl1', title: 'useState Deep Dive', content: 'React state management basics. Learn how to trigger re-renders efficiently.', rewardPoints: 30, rewardCash: 10, completed: false },
          { id: 'rl2', title: 'useEffect Lifecycle', content: 'Managing side effects in functional components.', rewardPoints: 30, rewardCash: 10, completed: false }
        ]
      }
    ]
  }
};

interface LearningCenterProps {
  courseId: string;
  user: UserProfile;
  setUser: React.Dispatch<React.SetStateAction<UserProfile>>;
  onBack: () => void;
}

const LearningCenter: React.FC<LearningCenterProps> = ({ courseId, user, setUser, onBack }) => {
  const course = MOCK_COURSE_CONTENT[courseId] || MOCK_COURSE_CONTENT['1'];
  const [activeLesson, setActiveLesson] = useState<Lesson>(course.modules![0].lessons[0]);
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());
  const [deepDive, setDeepDive] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleComplete = () => {
    if (completedIds.has(activeLesson.id)) return;

    setCompletedIds(prev => new Set([...prev, activeLesson.id]));
    setUser(prev => ({
      ...prev,
      balance: prev.balance + activeLesson.rewardCash,
      learningPoints: prev.learningPoints + activeLesson.rewardPoints
    }));
  };

  const fetchDeepDive = async () => {
    setIsGenerating(true);
    const result = await getDeepDive(activeLesson.title, course.title);
    setDeepDive(result);
    setIsGenerating(false);
  };

  const progress = Math.round((completedIds.size / (course.modules?.reduce((acc, m) => acc + m.lessons.length, 0) || 1)) * 100);

  return (
    <div className="flex flex-col lg:flex-row gap-8 animate-in fade-in duration-500">
      {/* Sidebar Curriculum */}
      <div className="w-full lg:w-80 space-y-4">
        <button onClick={onBack} className="text-slate-400 text-sm hover:text-indigo-600 flex items-center mb-4 transition-colors">
          ← Back to Marketplace
        </button>
        
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
          <h3 className="font-bold text-slate-800 mb-4">{course.title}</h3>
          <div className="mb-6">
            <div className="flex justify-between text-xs font-bold text-slate-400 uppercase mb-2">
              <span>Overall Progress</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-indigo-600 transition-all duration-700 ease-out" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          <div className="space-y-6">
            {course.modules?.map(mod => (
              <div key={mod.id}>
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">{mod.title}</h4>
                <div className="space-y-1">
                  {mod.lessons.map(les => (
                    <button 
                      key={les.id}
                      onClick={() => { setActiveLesson(les); setDeepDive(null); }}
                      className={`w-full text-left px-3 py-2 rounded-xl text-sm transition-all flex items-center justify-between ${
                        activeLesson.id === les.id 
                        ? 'bg-indigo-50 text-indigo-600 font-bold' 
                        : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <span className="truncate">{les.title}</span>
                      {completedIds.has(les.id) && <span className="text-emerald-500 text-xs">✓</span>}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 space-y-6">
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 min-h-[500px] relative">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-slate-800">{activeLesson.title}</h2>
            <div className="flex items-center space-x-2">
               <span className="bg-indigo-100 text-indigo-600 text-xs font-bold px-3 py-1 rounded-full">
                 +{activeLesson.rewardPoints} LP
               </span>
               <span className="bg-emerald-100 text-emerald-600 text-xs font-bold px-3 py-1 rounded-full">
                 Earn ${activeLesson.rewardCash}
               </span>
            </div>
          </div>

          <div className="prose prose-slate max-w-none text-slate-600 mb-12">
            <p className="text-lg leading-relaxed">{activeLesson.content}</p>
          </div>

          <div className="border-t border-slate-50 pt-8 mt-auto flex flex-col sm:flex-row gap-4">
            <button 
              disabled={completedIds.has(activeLesson.id)}
              onClick={handleComplete}
              className={`flex-1 py-4 rounded-2xl font-bold transition-all shadow-lg flex items-center justify-center space-x-2 ${
                completedIds.has(activeLesson.id) 
                ? 'bg-emerald-50 text-emerald-600 cursor-default' 
                : 'bg-indigo-600 text-white hover:bg-indigo-700'
              }`}
            >
              <span>{completedIds.has(activeLesson.id) ? 'Lesson Completed' : 'Mark as Complete & Earn Rewards'}</span>
              {completedIds.has(activeLesson.id) && <span>🎉</span>}
            </button>
            <button 
              onClick={fetchDeepDive}
              disabled={isGenerating}
              className="px-8 py-4 bg-white border border-slate-200 text-slate-700 rounded-2xl font-bold hover:bg-slate-50 transition-colors flex items-center space-x-2"
            >
              <span>{isGenerating ? 'AI Thinking...' : 'AI Deep Dive'}</span>
              {!isGenerating && <span>🤖</span>}
            </button>
          </div>
        </div>

        {deepDive && (
          <div className="bg-indigo-900 rounded-3xl p-8 text-white shadow-xl animate-in slide-in-from-bottom-8 duration-500 overflow-hidden relative">
            <div className="absolute top-0 right-0 p-8 opacity-10 text-8xl pointer-events-none">🤖</div>
            <h3 className="text-xl font-bold mb-6 flex items-center space-x-3">
              <span className="bg-indigo-500 p-2 rounded-lg">✨</span>
              <span>Gemini AI Study Guide</span>
            </h3>
            <div className="prose prose-invert max-w-none whitespace-pre-wrap font-sans text-indigo-100 leading-relaxed">
              {deepDive}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LearningCenter;
