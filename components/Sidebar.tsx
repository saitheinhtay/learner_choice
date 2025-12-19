
import React from 'react';
import { UserRole } from '../types';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  role: UserRole;
  toggleRole: () => void;
  onLogout: () => void;
  isAuthenticated: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, role, toggleRole, onLogout, isAuthenticated }) => {
  const guestItems = [
    { id: 'home', label: 'Home / About', icon: '🏠' },
    { id: 'marketplace', label: 'Explore Courses', icon: '🎒' },
    { id: 'library', label: 'eLibrary', icon: '📚' },
  ];

  const studentItems = [
    { id: 'dashboard', label: 'Student Portal', icon: '📊' },
    { id: 'marketplace', label: 'Explore Courses', icon: '🎒' },
    { id: 'library', label: 'eLibrary', icon: '📚' },
    { id: 'classes', label: 'Live Sessions', icon: '🏫' },
    { id: 'tutor', label: 'AI Study Tutor', icon: '🤖' },
    { id: 'wallet', label: 'My Wallet', icon: '💰' },
  ];

  const teacherItems = [
    { id: 'teacher-dashboard', label: 'Instructor Hub', icon: '👨‍🏫' },
    { id: 'teacher-panel', label: 'Course Studio', icon: '✍️' },
    { id: 'classes', label: 'My Sessions', icon: '🎥' },
    { id: 'wallet', label: 'Revenue Hub', icon: '🏦' },
  ];

  const adminItems = [
    { id: 'management', label: 'Founder Control', icon: '👑' },
    { id: 'marketplace', label: 'Global Market', icon: '🎒' },
    { id: 'wallet', label: 'System Payouts', icon: '💰' },
    { id: 'library', label: 'Resource Admin', icon: '📚' },
  ];

  let navItems = guestItems;
  if (isAuthenticated) {
    if (role === UserRole.ADMIN) navItems = adminItems;
    else if (role === UserRole.TEACHER) navItems = teacherItems;
    else navItems = studentItems;
  }

  // Determine active item styling based on role
  const getActiveStyle = () => {
    switch(role) {
      case UserRole.ADMIN: return 'bg-slate-900 text-white shadow-xl shadow-slate-200';
      case UserRole.TEACHER: return 'bg-purple-600 text-white shadow-xl shadow-purple-100';
      default: return 'bg-indigo-600 text-white shadow-xl shadow-indigo-100';
    }
  };

  return (
    <div className="w-64 bg-white border-r border-slate-200 flex flex-col h-full shadow-2xl z-30 relative">
      <div className="p-8">
        <div className="flex items-center space-x-3">
          <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-white font-black shadow-lg transition-colors ${role === UserRole.ADMIN ? 'bg-slate-900' : 'bg-indigo-600'}`}>L</div>
          <span className="text-xl font-black bg-gradient-to-br from-slate-900 to-indigo-600 bg-clip-text text-transparent tracking-tighter">
            Learner
          </span>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto">
        <p className="px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Platform View</p>
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center space-x-3 px-4 py-3.5 rounded-2xl transition-all duration-300 ${
              activeTab === item.id 
                ? `${getActiveStyle()} font-bold translate-x-1` 
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            <span className="text-sm">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 mt-auto space-y-3">
        {isAuthenticated && (
          <div className="bg-slate-50 rounded-[2rem] p-5 border border-slate-100">
            <div className="flex items-center space-x-3 mb-4">
               <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-xs uppercase ${role === UserRole.ADMIN ? 'bg-slate-900 text-white' : 'bg-indigo-100 text-indigo-600'}`}>
                  {role.charAt(0)}
               </div>
               <div>
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Profile Type</p>
                  <p className="text-xs font-bold text-slate-800">{role}</p>
               </div>
            </div>
            
            {/* Identity Switcher - Simulation Tool */}
            {role !== UserRole.ADMIN && (
              <button 
                onClick={toggleRole}
                className="w-full bg-white border border-slate-200 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider hover:border-indigo-500 hover:text-indigo-600 transition-all shadow-sm flex items-center justify-center space-x-2"
              >
                <span>🔄</span>
                <span>Role Switch</span>
              </button>
            )}
          </div>
        )}
        
        {isAuthenticated ? (
          <button 
            onClick={onLogout}
            className="w-full flex items-center justify-center space-x-2 py-4 rounded-2xl text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all font-black text-[10px] uppercase tracking-widest"
          >
            <span>Terminate Session</span>
          </button>
        ) : (
          <button 
            onClick={() => setActiveTab('login')}
            className="w-full bg-indigo-600 text-white font-black py-4 rounded-2xl shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all uppercase text-xs tracking-widest"
          >
            Authenticate
          </button>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
