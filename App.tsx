
import React, { useState, useEffect } from 'react';
import { UserRole, UserProfile } from './types';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Marketplace from './components/Marketplace';
import AITutor from './components/AITutor';
import Wallet from './components/Wallet';
import TeacherPanel from './components/TeacherPanel';
import TeacherDashboard from './components/TeacherDashboard';
import LearningCenter from './components/LearningCenter';
import Classes from './components/Classes';
import Auth from './components/Auth';
import Landing from './components/Landing';
import Library from './components/Library';
import ManagementCenter from './components/ManagementCenter';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('home');
  const [user, setUser] = useState<UserProfile | null>(null);
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);

  // Check for existing session on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('learner_choice_user');
    if (savedUser) {
      const parsed = JSON.parse(savedUser);
      setUser(parsed);
      setIsAuthenticated(true);
      // Set appropriate initial tab based on role
      if (parsed.role === UserRole.ADMIN) setActiveTab('management');
      else if (parsed.role === UserRole.TEACHER) setActiveTab('teacher-dashboard');
      else setActiveTab('dashboard');
    }
  }, []);

  const handleAuthSuccess = (userData: UserProfile) => {
    setUser(userData);
    setIsAuthenticated(true);
    if (userData.role === UserRole.ADMIN) setActiveTab('management');
    else if (userData.role === UserRole.TEACHER) setActiveTab('teacher-dashboard');
    else setActiveTab('dashboard');
    localStorage.setItem('learner_choice_user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    localStorage.removeItem('learner_choice_user');
    setIsAuthenticated(false);
    setUser(null);
    setActiveTab('home');
  };

  const toggleRole = () => {
    if (!user) return;
    // Founder (Admin) cannot be toggled into, but Students/Teachers can switch roles
    const nextRole = user.role === UserRole.STUDENT ? UserRole.TEACHER : UserRole.STUDENT;
    const updatedUser = {
      ...user,
      role: nextRole
    };
    setUser(updatedUser);
    localStorage.setItem('learner_choice_user', JSON.stringify(updatedUser));
    setActiveTab(nextRole === UserRole.TEACHER ? 'teacher-dashboard' : 'dashboard');
  };

  const handleEnroll = (courseId: string) => {
    setSelectedCourseId(courseId);
    setActiveTab('learning-center');
  };

  if (!isAuthenticated && activeTab !== 'home' && activeTab !== 'login' && activeTab !== 'marketplace' && activeTab !== 'library') {
    return <Auth onAuthSuccess={handleAuthSuccess} />;
  }

  const renderContent = () => {
    if (activeTab === 'home') {
      return <Landing onGetStarted={() => isAuthenticated ? setActiveTab(user?.role === UserRole.ADMIN ? 'management' : (user?.role === UserRole.TEACHER ? 'teacher-dashboard' : 'dashboard')) : setActiveTab('login')} />;
    }

    if (activeTab === 'login') {
      return <Auth onAuthSuccess={handleAuthSuccess} />;
    }

    if (activeTab === 'marketplace') return <Marketplace role={user?.role || UserRole.STUDENT} onEnroll={handleEnroll} />;
    if (activeTab === 'library') return <Library user={user || ({} as UserProfile)} setUser={setUser as any} />;
    if (activeTab === 'classes') return <Classes role={user?.role || UserRole.STUDENT} />;

    if (!user) return null;

    if (activeTab === 'learning-center' && selectedCourseId) {
      return (
        <LearningCenter 
          courseId={selectedCourseId} 
          user={user} 
          setUser={setUser} 
          onBack={() => setActiveTab('marketplace')} 
        />
      );
    }

    switch (activeTab) {
      case 'dashboard': return <Dashboard user={user} onSelectCourse={handleEnroll} />;
      case 'tutor': return <AITutor />;
      case 'teacher-dashboard': return <TeacherDashboard user={user} />;
      case 'teacher-panel': return <TeacherPanel user={user} setUser={setUser} onGoToWallet={() => setActiveTab('wallet')} />;
      case 'wallet': return <Wallet user={user} setUser={setUser} />;
      case 'management': return <ManagementCenter />;
      default: return <Dashboard user={user} onSelectCourse={handleEnroll} />;
    }
  };

  // Determine header and main background based on role
  const getRoleTheme = () => {
    if (!user) return "bg-white border-slate-100";
    switch(user.role) {
      case UserRole.ADMIN: return "bg-slate-900 border-slate-800 text-white";
      case UserRole.TEACHER: return "bg-white border-purple-50";
      default: return "bg-white border-indigo-50";
    }
  };

  const isDarkHeader = user?.role === UserRole.ADMIN;

  return (
    <div className={`flex h-screen overflow-hidden font-sans transition-colors duration-500 ${isDarkHeader ? 'bg-slate-950' : 'bg-slate-50'}`}>
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        role={user?.role || UserRole.STUDENT} 
        toggleRole={toggleRole}
        onLogout={handleLogout}
        isAuthenticated={isAuthenticated}
      />
      
      <main className="flex-1 overflow-y-auto scroll-smooth relative">
        <header className={`sticky top-0 z-20 px-8 md:px-12 py-6 border-b transition-all flex justify-between items-center ${getRoleTheme()}`}>
          <div>
            <h1 className={`text-2xl font-black tracking-tight ${isDarkHeader ? 'text-white' : 'text-slate-800'}`}>
              {isAuthenticated ? (activeTab === 'management' ? 'Founder Command' : (activeTab === 'teacher-dashboard' || activeTab === 'teacher-panel' ? 'Instructor Hub' : `Hi, ${user?.name}`)) : "Learner Choice"}
            </h1>
            <p className={`text-[10px] font-black uppercase tracking-[0.25em] mt-1 ${isDarkHeader ? 'text-indigo-400' : 'text-slate-400'}`}>
              {isAuthenticated ? (user?.role === UserRole.ADMIN ? "Foundation Node v2.5 Stable" : `${user?.role} ACCESS ENABLED`) : "The Learn-to-Earn Economy"}
            </p>
          </div>

          {isAuthenticated && (
            <div className="flex items-center space-x-6">
               <div className={`${isDarkHeader ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-100'} p-2 px-6 rounded-2xl border flex items-center space-x-4 shadow-sm transition-all`}>
                 <div className="text-right">
                   <div className={`text-[10px] font-black uppercase tracking-widest ${isDarkHeader ? 'text-slate-500' : 'text-slate-400'}`}>Balance</div>
                   <div className={`text-xl font-black tabular-nums ${isDarkHeader ? 'text-indigo-400' : 'text-indigo-600'}`}>${user?.balance.toFixed(2)}</div>
                 </div>
                 <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black shadow-inner transition-colors ${isDarkHeader ? 'bg-indigo-600 text-white' : 'bg-indigo-100 text-indigo-600'}`}>
                   {user?.name.charAt(0)}
                 </div>
               </div>
            </div>
          )}
        </header>
        
        <div className="max-w-7xl mx-auto p-8 md:p-12">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;
