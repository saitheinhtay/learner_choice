
import React, { useState } from 'react';
import { UserRole } from '../types';

const MOCK_COURSES = [
  { id: '1', title: 'Financial Freedom 101', instructor: 'Dave Ramsey', price: 0, reward: 50, category: 'Finance', rating: 4.8 },
  { id: '2', title: 'Mastering React & TS', instructor: 'Kent Dodds', price: 49, reward: 200, category: 'Tech', rating: 4.9 },
  { id: '3', title: 'Creative Writing for Profits', instructor: 'Neil Gaiman', price: 29, reward: 120, category: 'Writing', rating: 4.7 },
  { id: '4', title: 'Intro to Stock Trading', instructor: 'Warren Buffett', price: 99, reward: 500, category: 'Investing', rating: 4.5 },
  { id: '5', title: 'Mindfulness & Focus', instructor: 'Jay Shetty', price: 0, reward: 75, category: 'Wellness', rating: 4.9 },
  { id: '6', title: 'Marketing for Startups', instructor: 'Seth Godin', price: 59, reward: 250, category: 'Business', rating: 4.8 },
];

const Marketplace: React.FC<{ role: UserRole, onEnroll: (id: string) => void }> = ({ role, onEnroll }) => {
  const [filter, setFilter] = useState('All');

  const categories = ['All', 'Finance', 'Tech', 'Business', 'Writing', 'Wellness'];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-xl font-bold text-slate-800">Explore Courses</h2>
        <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map(cat => (
            <button 
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                filter === cat ? 'bg-indigo-600 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        {MOCK_COURSES.filter(c => filter === 'All' || c.category === filter).map(course => (
          <div key={course.id} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-md transition-shadow group">
            <div className="relative h-48 bg-slate-200">
              <img src={`https://picsum.photos/seed/${course.id}/400/300`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={course.title} />
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur shadow px-3 py-1 rounded-full text-xs font-bold text-indigo-600">
                {course.category}
              </div>
              <div className="absolute bottom-4 left-4 flex space-x-1">
                <span className="bg-emerald-500 text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase">Earn ${course.reward}</span>
              </div>
            </div>
            <div className="p-6">
              <div className="flex items-center text-amber-500 text-xs mb-2">
                {"★".repeat(Math.floor(course.rating))}
                <span className="text-slate-400 ml-1 font-medium">{course.rating}</span>
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-1 group-hover:text-indigo-600 transition-colors">{course.title}</h3>
              <p className="text-slate-500 text-sm mb-4">By {course.instructor}</p>
              
              <div className="flex items-center justify-between mt-auto">
                <div className="text-xl font-bold text-slate-900">
                  {course.price === 0 ? <span className="text-emerald-600">FREE</span> : `$${course.price}`}
                </div>
                <button 
                  onClick={() => onEnroll(course.id)}
                  className="bg-slate-900 text-white px-6 py-2 rounded-xl text-sm font-bold hover:bg-slate-800 transition-colors"
                >
                  Enroll Now
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Marketplace;
