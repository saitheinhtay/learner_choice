
import React from 'react';
import { UserProfile, UserRole } from '../types';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';

const data = [
  { name: 'Mon', earnings: 40, points: 120 },
  { name: 'Tue', earnings: 30, points: 90 },
  { name: 'Wed', earnings: 65, points: 200 },
  { name: 'Thu', earnings: 45, points: 150 },
  { name: 'Fri', earnings: 90, points: 280 },
  { name: 'Sat', earnings: 20, points: 60 },
  { name: 'Sun', earnings: 15, points: 40 },
];

const Dashboard: React.FC<{ user: UserProfile, onSelectCourse: (id: string) => void }> = ({ user, onSelectCourse }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-500 text-sm font-medium">Total Rewards</span>
              <span className="bg-emerald-100 text-emerald-600 text-xs px-2 py-1 rounded-full">+12%</span>
            </div>
            <h3 className="text-3xl font-bold">${user.balance.toLocaleString()}</h3>
          </div>
          <div className="mt-4 text-slate-400 text-sm">Withdrawable to your linked bank</div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-500 text-sm font-medium">Learning Points</span>
              <span className="bg-indigo-100 text-indigo-600 text-xs px-2 py-1 rounded-full">Lv 4</span>
            </div>
            <h3 className="text-3xl font-bold text-indigo-600">{user.learningPoints} LP</h3>
          </div>
          <div className="mt-4 text-slate-400 text-sm">Next milestone: 500 LP ($50 Bonus)</div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-500 text-sm font-medium">Active Courses</span>
            </div>
            <h3 className="text-3xl font-bold">4 Courses</h3>
          </div>
          <div className="mt-4 flex -space-x-2">
            {[1,2,3,4].map(i => (
              <img key={i} src={`https://picsum.photos/seed/${i}/40`} className="w-8 h-8 rounded-full border-2 border-white" alt="Avatar" />
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold mb-6 text-slate-800">Earning Progress</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                <YAxis hide />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                />
                <Bar dataKey="earnings" fill="#10b981" radius={[4, 4, 0, 0]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold mb-6 text-slate-800">Continue Learning</h3>
          <div className="space-y-4">
            {[
              { id: '1', title: 'Financial Freedom 101', instructor: 'Dr. Sarah Webb', prize: '$20', lp: '150 LP' },
              { id: '2', title: 'Mastering React & TS', instructor: 'Kent Dodds', prize: '$45', lp: '300 LP' },
            ].map((course, idx) => (
              <div 
                key={idx} 
                onClick={() => onSelectCourse(course.id)}
                className="flex items-center justify-between p-4 rounded-2xl cursor-pointer hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-slate-200 rounded-xl overflow-hidden">
                    <img src={`https://picsum.photos/seed/course${idx}/100`} alt="Course" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-800">{course.title}</h4>
                    <p className="text-xs text-slate-400">{course.instructor}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-emerald-600">Earn {course.prize}</div>
                  <div className="text-[10px] text-indigo-500 font-bold uppercase">{course.lp}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
