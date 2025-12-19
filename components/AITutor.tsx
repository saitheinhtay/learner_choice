
import React, { useState, useRef, useEffect } from 'react';
import { askTutor } from '../geminiService';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const AITutor: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Hi! I am your Learner Choice AI Tutor. Ask me anything about your courses, or how to maximize your earnings while learning!' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsLoading(true);

    try {
      const response = await askTutor(userMsg);
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I had a brain freeze. Try again?" }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-200px)] flex flex-col bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white text-xl">🤖</div>
          <div>
            <h3 className="font-bold text-slate-800">Learner Choice AI Assistant</h3>
            <p className="text-xs text-emerald-500 font-medium flex items-center">
              <span className="w-2 h-2 bg-emerald-500 rounded-full mr-2 animate-pulse"></span>
              Always here to help you earn & learn
            </p>
          </div>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-4 rounded-2xl ${
              msg.role === 'user' 
                ? 'bg-indigo-600 text-white rounded-tr-none' 
                : 'bg-slate-100 text-slate-800 rounded-tl-none'
            }`}>
              <div className="prose prose-sm max-w-none">
                 {msg.content}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-slate-100 p-4 rounded-2xl rounded-tl-none flex space-x-1 items-center">
              <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-75"></div>
              <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-150"></div>
            </div>
          </div>
        )}
      </div>

      <div className="p-6 border-t border-slate-100">
        <div className="relative">
          <input 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask a question..."
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 pr-16 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
          />
          <button 
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="absolute right-2 top-2 bottom-2 bg-indigo-600 text-white px-6 rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-50"
          >
            Send
          </button>
        </div>
        <p className="text-[10px] text-slate-400 mt-3 text-center">
          Ask about: "How to earn from Quizzes", "Help me with Algebra", "Explain the Referral Bonus"
        </p>
      </div>
    </div>
  );
};

export default AITutor;
