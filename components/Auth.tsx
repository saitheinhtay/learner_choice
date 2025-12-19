import React, { useState } from 'react';
import { UserRole, UserProfile } from '../types';

interface AuthProps {
  onAuthSuccess: (user: UserProfile) => void;
}

const Auth: React.FC<AuthProps> = ({ onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState<UserRole>(UserRole.STUDENT);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulate auth logic
    const mockUser: UserProfile = {
      id: isLogin ? 'u1' : 'u-' + Math.floor(Math.random()*1000),
      name: name || (isLogin ? "Alex Johnson" : "New User"),
      email: email || (isLogin ? "alex@example.com" : "new@user.com"),
      role: isLogin ? UserRole.ADMIN : role,
      balance: isLogin ? 1250.00 : 0.00,
      bankLinked: isLogin ? true : false,
      qrPayLinked: isLogin ? true : false,
      cryptoAddress: isLogin ? '0x71C...4f92' : undefined,
      learningPoints: isLogin ? 450 : 0,
      stakedPoints: isLogin ? 500 : 0,
      referralCode: isLogin ? "ALEX-77" : "NEW-" + Math.floor(Math.random()*100),
      totalReferralEarnings: isLogin ? 84.50 : 0,
      isVerified: true,
      joinedAt: new Date().toISOString().split('T')[0],
      savingsGoals: isLogin ? [
        { id: 'g1', name: 'New MacBook Pro', targetAmount: 2400, currentAmount: 850, icon: '💻' },
        { id: 'g2', name: 'Vacation Fund', targetAmount: 1500, currentAmount: 320, icon: '🌴' }
      ] : []
    };

    onAuthSuccess(mockUser);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/20 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-violet-600/20 rounded-full blur-[120px]"></div>
      
      <div className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/10 p-8 rounded-[2.5rem] shadow-2xl relative z-10">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center text-white text-3xl font-bold mx-auto mb-4 shadow-lg shadow-indigo-600/20">
            L
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Learner Choice</h1>
          <p className="text-slate-400 text-sm">
            {isLogin ? "Welcome back! Please login to your account." : "Start your journey of learning and earning."}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Full Name</label>
              <input 
                required
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all placeholder:text-slate-600"
              />
            </div>
          )}
          
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Email Address</label>
            <input 
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all placeholder:text-slate-600"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Password</label>
            <input 
              required
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all placeholder:text-slate-600"
            />
          </div>

          {!isLogin && (
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 ml-1">I want to be a:</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole(UserRole.STUDENT)}
                  className={`py-3 rounded-xl border text-sm font-bold transition-all ${
                    role === UserRole.STUDENT 
                    ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-600/20' 
                    : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
                  }`}
                >
                  Learner
                </button>
                <button
                  type="button"
                  onClick={() => setRole(UserRole.TEACHER)}
                  className={`py-3 rounded-xl border text-sm font-bold transition-all ${
                    role === UserRole.TEACHER 
                    ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-600/20' 
                    : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
                  }`}
                >
                  Teacher
                </button>
              </div>
            </div>
          )}

          <button 
            type="submit"
            className="w-full bg-indigo-600 text-white font-bold py-4 rounded-2xl shadow-xl shadow-indigo-600/20 hover:bg-indigo-700 transition-all mt-4 transform active:scale-[0.98]"
          >
            {isLogin ? "Sign In" : "Create Account"}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-slate-400 text-sm">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="ml-2 text-indigo-400 font-bold hover:text-indigo-300 transition-colors"
            >
              {isLogin ? "Register Now" : "Login Instead"}
            </button>
          </p>
        </div>

        <div className="mt-8 pt-8 border-t border-white/5 flex items-center justify-center space-x-6">
          <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Trusted by QRPay Partners</p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
