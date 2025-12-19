
import React from 'react';
import { UserProfile } from '../types';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line 
} from 'recharts';

const revenueData = [
  { name: 'Jan', revenue: 1200 },
  { name: 'Feb', revenue: 1900 },
  { name: 'Mar', revenue: 1500 },
  { name: 'Apr', revenue: 2800 },
  { name: 'May', revenue: 3200 },
  { name: 'Jun', revenue: 4100 },
];

const TeacherDashboard: React.FC<{ user: UserProfile }> = ({ user }) => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Total Revenue</p>
          <h3 className="text-3xl font-black text-slate-800">${user.balance.toLocaleString()}</h3>
          <p className="text-xs text-emerald-500 font-bold mt-2">+24% from last month</p>
        </div>

        <div className="bg-slate-900 p-8 rounded-[2.5rem] shadow-xl text-white">
          <p className="text-[10px] font-black text-indigo-300 uppercase tracking-widest mb-2">Active Students</p>
          <h3 className="text-3xl font-black">1,482</h3>
          <div className="flex -space-x-2 mt-4">
             {[1,2,3,4,5].map(i => <img key={i} src={`https://picsum.photos/seed/stu${i}/32`} className="w-8 h-8 rounded-full border-2 border-slate-900" alt="avatar" />)}
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Average Rating</p>
          <h3 className="text-3xl font-black text-slate-800">4.9 / 5.0</h3>
          <div className="flex text-amber-400 mt-2">★★★★★</div>
        </div>

        <div className="bg-indigo-600 p-8 rounded-[2.5rem] shadow-lg text-white">
          <p className="text-[10px] font-black text-indigo-200 uppercase tracking-widest mb-2">Global Rank</p>
          <h3 className="text-3xl font-black">Top 10%</h3>
          <p className="text-xs text-indigo-100 mt-2">Top Teacher Badge Active</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100">
          <div className="flex justify-between items-center mb-10">
            <h3 className="text-xl font-black text-slate-800">Revenue Growth</h3>
            <select className="bg-slate-50 border-none text-xs font-bold rounded-xl px-4 py-2">
              <option>Last 6 Months</option>
              <option>Last Year</option>
            </select>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10}} dy={10} />
                <YAxis hide />
                <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} />
                <Bar dataKey="revenue" fill="#4f46e5" radius={[10, 10, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100 overflow-hidden">
          <h3 className="text-xl font-black text-slate-800 mb-8">Course Performance</h3>
          <div className="space-y-6">
            {[
              { title: 'DeFi Mastery', students: 482, revenue: '$4,200', trend: 'UP' },
              { title: 'Web3 Security', students: 210, revenue: '$1,850', trend: 'UP' },
              { title: 'Smart Contracts 101', students: 890, revenue: '$8,900', trend: 'STABLE' },
            ].map((course, idx) => (
              <div key={idx} className="flex items-center justify-between p-5 rounded-[2rem] bg-slate-50 hover:bg-indigo-50 transition-colors group cursor-pointer">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center font-black text-slate-300 shadow-sm group-hover:text-indigo-600">
                    {idx + 1}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">{course.title}</h4>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">{course.students} Enrolled</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black text-indigo-600">{course.revenue}</p>
                  <p className={`text-[10px] font-black ${course.trend === 'UP' ? 'text-emerald-500' : 'text-slate-400'}`}>
                    {course.trend === 'UP' ? '↗ TRENDING' : '→ STABLE'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
