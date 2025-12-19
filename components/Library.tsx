
import React, { useState } from 'react';
import { EBook, BookChapter, UserProfile } from '../types';
import { summarizeBookChapter } from '../geminiService';

const MOCK_BOOKS: EBook[] = [
  {
    id: 'b1',
    title: 'The Intelligent Investor 2024',
    author: 'Benjamin Graham & AI',
    cover: 'https://picsum.photos/seed/invest/300/400',
    category: 'Finance',
    description: 'A modern take on value investing principles updated for the digital economy.',
    rewardPerChapter: 15,
    chapters: [
      { id: 'c1', title: 'Investment vs Speculation', content: 'In this chapter, we define the clear line between investing—which involves thorough analysis and safety of principal—and speculation. Modern markets have blurred these lines with high-frequency trading and crypto assets...' },
      { id: 'c2', title: 'The Investor and Inflation', content: 'Inflation is the silent thief of purchasing power. We discuss how to position a portfolio to thrive during inflationary periods using a mix of equities and real assets...' }
    ]
  },
  {
    id: 'b2',
    title: 'Algorithms to Live By',
    author: 'Brian Christian',
    cover: 'https://picsum.photos/seed/algo/300/400',
    category: 'Tech',
    description: 'How computer science principles can help you make better decisions in daily life.',
    rewardPerChapter: 20,
    chapters: [
      { id: 'c1', title: 'Optimal Stopping', content: 'When should you stop searching and start committing? This chapter explores the 37% rule in secretary problems, apartment hunting, and dating...' }
    ]
  },
  {
    id: 'b3',
    title: 'Atomic Habits',
    author: 'James Clear',
    cover: 'https://picsum.photos/seed/habits/300/400',
    category: 'Wellness',
    description: 'Tiny changes, remarkable results. Learn how to build better habits through systems.',
    rewardPerChapter: 10,
    chapters: [
      { id: 'c1', title: 'The Power of 1%', content: 'Compounding is not just for money. Improving 1% every day results in a 37x improvement over a year...' }
    ]
  }
];

interface LibraryProps {
  user: UserProfile;
  setUser: React.Dispatch<React.SetStateAction<UserProfile>>;
}

const Library: React.FC<LibraryProps> = ({ user, setUser }) => {
  const [selectedBook, setSelectedBook] = useState<EBook | null>(null);
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);
  const [summary, setSummary] = useState<string | null>(null);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [completedChapters, setCompletedChapters] = useState<Set<string>>(new Set());

  const handleClaimReward = () => {
    const chapterId = selectedBook!.chapters[activeChapterIndex].id;
    if (completedChapters.has(chapterId)) return;

    setCompletedChapters(prev => new Set([...prev, chapterId]));
    setUser(prev => ({
      ...prev,
      learningPoints: prev.learningPoints + selectedBook!.rewardPerChapter
    }));
  };

  const handleSummarize = async () => {
    if (!selectedBook) return;
    setIsSummarizing(true);
    const result = await summarizeBookChapter(
      selectedBook.chapters[activeChapterIndex].title,
      selectedBook.chapters[activeChapterIndex].content
    );
    setSummary(result);
    setIsSummarizing(false);
  };

  if (selectedBook) {
    const currentChapter = selectedBook.chapters[activeChapterIndex];
    return (
      <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in zoom-in-95 duration-300">
        <button 
          onClick={() => { setSelectedBook(null); setSummary(null); }}
          className="text-slate-400 hover:text-indigo-600 font-bold flex items-center space-x-2 transition-colors"
        >
          <span>← Back to Library</span>
        </button>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Reader Pane */}
          <div className="flex-1 bg-white rounded-[2.5rem] shadow-sm border border-slate-100 p-8 md:p-12 min-h-[600px] flex flex-col">
            <div className="flex justify-between items-start mb-10">
              <div>
                <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest mb-1">{selectedBook.title}</p>
                <h2 className="text-3xl font-black text-slate-800">{currentChapter.title}</h2>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-bold text-slate-400 uppercase">Rewards for Reading</p>
                <p className="text-lg font-bold text-emerald-600">+{selectedBook.rewardPerChapter} LP</p>
              </div>
            </div>

            <div className="prose prose-slate max-w-none flex-1">
              <p className="text-xl leading-relaxed text-slate-700 font-serif">
                {currentChapter.content}
              </p>
            </div>

            <div className="mt-12 pt-8 border-t border-slate-50 flex items-center justify-between">
              <div className="flex space-x-2">
                <button 
                  disabled={activeChapterIndex === 0}
                  onClick={() => { setActiveChapterIndex(prev => prev - 1); setSummary(null); }}
                  className="px-6 py-3 rounded-xl border border-slate-200 text-slate-500 font-bold hover:bg-slate-50 disabled:opacity-30"
                >
                  Previous
                </button>
                <button 
                  disabled={activeChapterIndex === selectedBook.chapters.length - 1}
                  onClick={() => { setActiveChapterIndex(prev => prev + 1); setSummary(null); }}
                  className="px-6 py-3 rounded-xl border border-slate-200 text-slate-500 font-bold hover:bg-slate-50 disabled:opacity-30"
                >
                  Next Chapter
                </button>
              </div>

              <button 
                onClick={handleClaimReward}
                disabled={completedChapters.has(currentChapter.id)}
                className={`px-8 py-3 rounded-xl font-bold transition-all shadow-lg ${
                  completedChapters.has(currentChapter.id)
                  ? 'bg-emerald-50 text-emerald-600 cursor-default'
                  : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-200'
                }`}
              >
                {completedChapters.has(currentChapter.id) ? 'Reward Claimed ✓' : 'Finish & Claim LP'}
              </button>
            </div>
          </div>

          {/* AI Helper Sidebar */}
          <div className="w-full lg:w-72 space-y-4">
            <button 
              onClick={handleSummarize}
              disabled={isSummarizing}
              className="w-full bg-slate-900 text-white p-6 rounded-3xl font-bold flex items-center justify-between hover:bg-slate-800 transition-all group"
            >
              <div className="text-left">
                <p className="text-[10px] text-slate-400 uppercase mb-1">AI Assistant</p>
                <p className="text-sm">Summarize Chapter</p>
              </div>
              <span className="text-xl group-hover:scale-125 transition-transform">🤖</span>
            </button>

            {summary && (
              <div className="bg-indigo-50 border border-indigo-100 rounded-3xl p-6 animate-in slide-in-from-top-4">
                <h4 className="font-bold text-indigo-900 text-sm mb-3">Chapter Key Points</h4>
                <div className="text-xs text-indigo-800 space-y-3 leading-relaxed whitespace-pre-wrap">
                  {summary}
                </div>
              </div>
            )}

            <div className="bg-white border border-slate-100 rounded-3xl p-6">
              <h4 className="font-bold text-slate-800 text-sm mb-4">Book Info</h4>
              <div className="space-y-4">
                <img src={selectedBook.cover} className="w-full rounded-2xl shadow-sm" alt="Cover" />
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Author</p>
                  <p className="text-xs text-slate-600">{selectedBook.author}</p>
                </div>
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-indigo-500" 
                    style={{ width: `${((activeChapterIndex + 1) / selectedBook.chapters.length) * 100}%` }}
                  ></div>
                </div>
                <p className="text-[10px] text-slate-400 text-center uppercase font-bold">Progress: {Math.round(((activeChapterIndex + 1) / selectedBook.chapters.length) * 100)}%</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">eLibrary</h2>
          <p className="text-slate-500 text-sm">Read premium books and earn Learning Points for your progress.</p>
        </div>
        <div className="flex bg-white border border-slate-200 rounded-2xl p-1">
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-100">Browse All</button>
          <button className="px-4 py-2 text-slate-500 text-xs font-bold">My Bookshelf</button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {MOCK_BOOKS.map((book) => (
          <div 
            key={book.id} 
            onClick={() => setSelectedBook(book)}
            className="group cursor-pointer"
          >
            <div className="relative aspect-[3/4] mb-4 overflow-hidden rounded-[2.5rem] shadow-lg group-hover:shadow-xl group-hover:-translate-y-2 transition-all duration-300">
              <img src={book.cover} className="w-full h-full object-cover" alt={book.title} />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                <button className="w-full bg-white text-slate-900 py-3 rounded-2xl font-bold text-sm shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-transform">
                  Read Now
                </button>
              </div>
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full shadow-sm">
                <p className="text-[10px] font-black text-emerald-600">+{book.rewardPerChapter * book.chapters.length} LP</p>
              </div>
            </div>
            <div>
              <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest mb-1">{book.category}</p>
              <h3 className="font-bold text-slate-800 leading-tight group-hover:text-indigo-600 transition-colors">{book.title}</h3>
              <p className="text-xs text-slate-400 mt-1">{book.author}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Library;
