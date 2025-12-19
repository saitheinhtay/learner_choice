
import React, { useState } from 'react';
import { UserRole, ClassSession } from '../types';
import { getClassDiscussionPrompt } from '../geminiService';

const MOCK_CLASSES: ClassSession[] = [
  { id: 'c1', title: 'Future of Decentralized Finance', teacher: 'Prof. Nakamoto', startTime: '10:00 AM', duration: '45m', studentCount: 128, isLive: true, reward: 15 },
  { id: 'c2', title: 'Advanced CSS Animation Workshop', teacher: 'Sarah J. Styles', startTime: '02:30 PM', duration: '60m', studentCount: 54, isLive: false, reward: 20 },
  { id: 'c3', title: 'AI Ethics in 2024', teacher: 'Dr. Turing', startTime: 'Tomorrow, 11:00 AM', duration: '30m', studentCount: 210, isLive: false, reward: 10 },
  { id: 'c4', title: 'Healthy Habits for High Performers', teacher: 'Coach K', startTime: 'Friday, 09:00 AM', duration: '45m', studentCount: 88, isLive: false, reward: 15 },
];

const Classes: React.FC<{ role: UserRole }> = ({ role }) => {
  const [discussionPrompt, setDiscussionPrompt] = useState<string | null>(null);
  const [loadingPrompt, setLoadingPrompt] = useState<string | null>(null);

  const handleGeneratePrompt = async (classTitle: string) => {
    setLoadingPrompt(classTitle);
    const prompt = await getClassDiscussionPrompt(classTitle);
    setDiscussionPrompt(prompt);
    setLoadingPrompt(null);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Live & Upcoming Classes</h2>
          <p className="text-slate-500 text-sm">Join a session to learn interactively and earn instant rewards.</p>
        </div>
        {role === UserRole.TEACHER && (
          <button className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold shadow-lg hover:bg-indigo-700 transition-all">
            Schedule a Class
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {MOCK_CLASSES.map((cls) => (
          <div key={cls.id} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col md:flex-row gap-6 hover:shadow-md transition-shadow">
            <div className="w-full md:w-32 h-32 bg-slate-100 rounded-2xl flex items-center justify-center text-3xl overflow-hidden">
               <img src={`https://picsum.photos/seed/${cls.id}/128`} className="w-full h-full object-cover" alt="Class" />
            </div>
            
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  {cls.isLive ? (
                    <span className="bg-red-100 text-red-600 text-[10px] font-bold px-2 py-1 rounded-full flex items-center">
                      <span className="w-1.5 h-1.5 bg-red-600 rounded-full mr-1 animate-pulse"></span>
                      LIVE NOW
                    </span>
                  ) : (
                    <span className="bg-slate-100 text-slate-500 text-[10px] font-bold px-2 py-1 rounded-full uppercase">
                      Upcoming
                    </span>
                  )}
                  <span className="text-xs font-bold text-emerald-600 tracking-tight">Earn ${cls.reward} Reward</span>
                </div>
                <h3 className="text-lg font-bold text-slate-800">{cls.title}</h3>
                <p className="text-slate-500 text-sm mb-4">Hosted by {cls.teacher}</p>
                
                <div className="flex items-center space-x-4 text-xs text-slate-400 font-medium">
                  <span className="flex items-center">🕒 {cls.startTime} ({cls.duration})</span>
                  <span className="flex items-center">👥 {cls.studentCount} attending</span>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-2">
                <button className={`flex-1 py-2 px-4 rounded-xl font-bold text-sm transition-all ${
                  cls.isLive ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                }`}>
                  {cls.isLive ? 'Join Class' : 'Remind Me'}
                </button>
                {role === UserRole.TEACHER && (
                  <button 
                    onClick={() => handleGeneratePrompt(cls.title)}
                    className="py-2 px-4 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold text-sm hover:bg-slate-50"
                  >
                    {loadingPrompt === cls.title ? 'AI Generating...' : 'Discussion Ideas'}
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {discussionPrompt && (
        <div className="bg-indigo-50 border border-indigo-100 rounded-3xl p-8 relative animate-in slide-in-from-bottom-4 duration-300">
          <button 
            onClick={() => setDiscussionPrompt(null)}
            className="absolute top-4 right-4 text-indigo-400 hover:text-indigo-600"
          >
            ✕
          </button>
          <div className="flex items-center space-x-2 mb-4">
            <span className="text-2xl">💡</span>
            <h3 className="text-lg font-bold text-indigo-900">AI-Powered Discussion Guide</h3>
          </div>
          <div className="prose prose-indigo prose-sm max-w-none whitespace-pre-wrap text-indigo-800">
            {discussionPrompt}
          </div>
          <div className="mt-6 flex justify-end">
             <button className="text-indigo-600 font-bold text-sm hover:underline">Copy to Teacher Dashboard</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Classes;
