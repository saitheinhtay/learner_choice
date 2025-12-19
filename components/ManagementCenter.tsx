
import React, { useState } from 'react';
import { WorkflowTask, TaskStatus, UserProfile, UserRole, PlatformConfig } from '../types';

const INITIAL_TASKS: WorkflowTask[] = [
  { id: 't1', title: 'Withdrawal Approval - $250.00', type: 'PAYOUT', priority: 'HIGH', status: TaskStatus.PENDING, createdAt: '2023-12-01', description: 'Student Alex Johnson requested withdrawal to QRPay ending in 4202.', user: 'Alex Johnson' },
  { id: 't2', title: 'Course Review: Quantum Physics 101', type: 'COURSE_REVIEW', priority: 'MEDIUM', status: TaskStatus.IN_PROGRESS, createdAt: '2023-11-30', description: 'New course submitted by Prof. H. Heisenberg for quality assurance.', user: 'Prof. Heisenberg' },
  { id: 't3', title: 'Identity Verification: Tier 2 KYC', type: 'KYC_VERIFICATION', priority: 'MEDIUM', status: TaskStatus.PENDING, createdAt: '2023-11-29', description: 'Verification required for platform-wide QRPay integration module.', user: 'System' },
];

const MOCK_USERS: UserProfile[] = [
  { id: 'u1', name: 'Alex Johnson', email: 'alex@example.com', role: UserRole.STUDENT, balance: 1250, bankLinked: true, qrPayLinked: true, cryptoAddress: '0x123...abc', learningPoints: 450, stakedPoints: 500, savingsGoals: [], referralCode: 'ALEX7', totalReferralEarnings: 25, isVerified: true, joinedAt: '2023-10-15' },
  { id: 'u2', name: 'Sarah Webb', email: 'sarah@academy.edu', role: UserRole.TEACHER, balance: 8400, bankLinked: true, qrPayLinked: false, learningPoints: 1200, stakedPoints: 0, savingsGoals: [], referralCode: 'SARAH10', totalReferralEarnings: 450, isVerified: true, joinedAt: '2023-08-20' },
  { id: 'u3', name: 'Mike Miller', email: 'mike@test.com', role: UserRole.STUDENT, balance: 50, bankLinked: false, qrPayLinked: false, learningPoints: 20, stakedPoints: 0, savingsGoals: [], totalReferralEarnings: 0, isVerified: false, joinedAt: '2023-11-30' },
];

const ManagementCenter: React.FC = () => {
  const [activeView, setActiveView] = useState<'TASKS' | 'RULES' | 'USERS' | 'PARTNERS'>('TASKS');
  const [tasks, setTasks] = useState<WorkflowTask[]>(INITIAL_TASKS);
  const [users, setUsers] = useState<UserProfile[]>(MOCK_USERS);
  const [config, setConfig] = useState<PlatformConfig>({
    referralPercentage: 5,
    minWithdrawalUSD: 10,
    qrPayCommissionRate: 0.5,
    cryptoGasSubsidy: true,
    kycRequired: true,
  });

  const updateTaskStatus = (id: string, newStatus: TaskStatus) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status: newStatus } : t));
  };

  const toggleUserVerification = (id: string) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, isVerified: !u.isVerified } : u));
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="flex bg-slate-900 border-2 border-slate-800 rounded-[2rem] p-2 shadow-2xl max-w-fit mx-auto md:mx-0">
        {[
          { id: 'TASKS', label: 'Operations', icon: '⚡' },
          { id: 'RULES', label: 'Global Parameters', icon: '⚙️' },
          { id: 'USERS', label: 'User Ecosystem', icon: '👥' },
          { id: 'PARTNERS', label: 'Settlement Nodes', icon: '🏛️' }
        ].map(view => (
          <button 
            key={view.id} 
            onClick={() => setActiveView(view.id as any)} 
            className={`px-6 py-3.5 rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.15em] transition-all flex items-center space-x-2 ${
              activeView === view.id ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-500/30 scale-105' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <span>{view.icon}</span>
            <span className="hidden md:inline">{view.label}</span>
          </button>
        ))}
      </div>

      {activeView === 'TASKS' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-slate-900 p-8 rounded-[3rem] border border-slate-800 shadow-xl group hover:border-indigo-500/50 transition-all">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Process Queue</p>
              <h4 className="text-4xl font-black text-white tabular-nums">{tasks.filter(t => t.status === TaskStatus.PENDING).length} Pending</h4>
              <div className="mt-6 flex space-x-1">
                 {[1,2,3,4,5,6,7,8].map(i => <div key={i} className={`h-1.5 flex-1 rounded-full ${i <= 3 ? 'bg-amber-400' : 'bg-slate-800'}`}></div>)}
              </div>
            </div>
            <div className="bg-slate-900 p-8 rounded-[3rem] border border-slate-800 shadow-xl group hover:border-emerald-500/50 transition-all">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Platform Throughput</p>
              <h4 className="text-4xl font-black text-emerald-400 tabular-nums">$14,205</h4>
              <p className="text-[10px] font-bold text-slate-600 mt-2 uppercase tracking-widest">Rolling 24h Payouts</p>
            </div>
            <div className="bg-slate-900 p-8 rounded-[3rem] border border-slate-800 shadow-xl group hover:border-indigo-500/50 transition-all">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">System Integrity</p>
              <h4 className="text-4xl font-black text-indigo-400 tabular-nums">99.9%</h4>
              <p className="text-[10px] font-bold text-slate-600 mt-2 uppercase tracking-widest">Active Node Health</p>
            </div>
          </div>

          <div className="bg-slate-900 rounded-[3rem] border border-slate-800 shadow-2xl overflow-hidden">
             <table className="w-full text-left">
               <thead>
                 <tr className="bg-slate-950 text-slate-500 text-[10px] uppercase font-black tracking-[0.2em] border-b border-slate-800">
                   <th className="px-10 py-6">Operation Identifier</th>
                   <th className="px-10 py-6">Priority</th>
                   <th className="px-10 py-6">Integrity Status</th>
                   <th className="px-10 py-6 text-right">Commit</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-slate-800">
                 {tasks.map(task => (
                   <tr key={task.id} className="hover:bg-slate-800/40 transition-colors group">
                     <td className="px-10 py-8">
                       <div className="flex items-center space-x-5">
                         <div className="w-14 h-14 bg-slate-800 text-indigo-400 rounded-[1.25rem] flex items-center justify-center text-xl font-bold shadow-inner">
                            {task.type.charAt(0)}
                         </div>
                         <div>
                           <p className="font-black text-white text-sm">{task.title}</p>
                           <p className="text-xs text-slate-500 mt-1 font-medium">{task.description}</p>
                         </div>
                       </div>
                     </td>
                     <td className="px-10 py-8 text-[10px] font-black">
                        <span className={`px-4 py-1.5 rounded-full uppercase tracking-widest ${
                          task.priority === 'HIGH' ? 'bg-red-900/40 text-red-400' : 'bg-slate-800 text-slate-500'
                        }`}>
                          {task.priority}
                        </span>
                     </td>
                     <td className="px-10 py-8">
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center">
                           <span className={`w-2 h-2 rounded-full mr-2 ${task.status === TaskStatus.PENDING ? 'bg-amber-400' : 'bg-emerald-400'}`}></span>
                           {task.status}
                        </span>
                     </td>
                     <td className="px-10 py-8 text-right">
                        <button 
                          onClick={() => updateTaskStatus(task.id, TaskStatus.COMPLETED)} 
                          className="bg-indigo-600 text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-500/20"
                        >
                          Approve
                        </button>
                     </td>
                   </tr>
                 ))}
               </tbody>
             </table>
          </div>
        </div>
      )}

      {activeView === 'RULES' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
           <div className="bg-slate-900 p-12 rounded-[4rem] border border-slate-800 shadow-2xl space-y-10 text-white">
              <h3 className="text-2xl font-black tracking-tight">Ecosystem Logic</h3>
              <div className="space-y-8">
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.25em] mb-4">Network Referral Yield</label>
                  <div className="flex items-center space-x-6">
                    <input type="range" min="1" max="25" value={config.referralPercentage} onChange={e => setConfig({...config, referralPercentage: parseInt(e.target.value)})} className="flex-1 accent-indigo-500 h-2 bg-slate-800 rounded-full appearance-none cursor-pointer" />
                    <span className="font-black text-3xl text-indigo-400 tabular-nums">{config.referralPercentage}%</span>
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.25em] mb-4">Min. Settlement Floor (USD)</label>
                  <div className="relative">
                    <span className="absolute left-6 top-1/2 -translate-y-1/2 font-black text-slate-600 text-xl">$</span>
                    <input type="number" value={config.minWithdrawalUSD} onChange={e => setConfig({...config, minWithdrawalUSD: parseFloat(e.target.value)})} className="w-full bg-slate-800 border-2 border-slate-700 rounded-[1.5rem] pl-14 pr-8 py-6 text-2xl font-black focus:border-indigo-500 focus:outline-none transition-all text-white" />
                  </div>
                </div>
              </div>
              <button className="w-full bg-indigo-600 text-white py-6 rounded-[2rem] font-black shadow-2xl hover:bg-indigo-500 transition-all uppercase tracking-[0.2em] text-xs">Commit Parameters</button>
           </div>
           
           <div className="bg-slate-900 p-12 rounded-[4rem] text-white space-y-10 border border-slate-800 shadow-2xl relative overflow-hidden">
              <div className="absolute top-[-30%] right-[-30%] w-[80%] h-[80%] bg-indigo-500/10 rounded-full blur-[120px]"></div>
              <h3 className="text-2xl font-black relative z-10 tracking-tight">System Compliance</h3>
              <div className="space-y-6 relative z-10">
                <div className="flex items-center justify-between p-6 bg-slate-800/50 rounded-[2rem] border border-slate-700 hover:bg-slate-800 transition-colors">
                   <div>
                     <p className="font-bold text-lg">Strict KYC Protocol</p>
                     <p className="text-[10px] text-slate-500 font-bold uppercase mt-1">Global compliance check on $100+ flows</p>
                   </div>
                   <button onClick={() => setConfig({...config, kycRequired: !config.kycRequired})} className={`w-14 h-8 rounded-full transition-all relative ${config.kycRequired ? 'bg-emerald-500' : 'bg-slate-700'}`}>
                     <div className={`absolute top-1.5 w-5 h-5 bg-white rounded-full transition-all ${config.kycRequired ? 'left-8' : 'left-1.5'}`}></div>
                   </button>
                </div>
                <div className="flex items-center justify-between p-6 bg-slate-800/50 rounded-[2rem] border border-slate-700 hover:bg-slate-800 transition-colors">
                   <div>
                     <p className="font-bold text-lg">Web3 Gas Subsidy</p>
                     <p className="text-[10px] text-slate-500 font-bold uppercase mt-1">Platform-funded L2 network transaction fees</p>
                   </div>
                   <button onClick={() => setConfig({...config, cryptoGasSubsidy: !config.cryptoGasSubsidy})} className={`w-14 h-8 rounded-full transition-all relative ${config.cryptoGasSubsidy ? 'bg-indigo-500' : 'bg-slate-700'}`}>
                     <div className={`absolute top-1.5 w-5 h-5 bg-white rounded-full transition-all ${config.cryptoGasSubsidy ? 'left-8' : 'left-1.5'}`}></div>
                   </button>
                </div>
              </div>
           </div>
        </div>
      )}

      {/* Other views (USERS, PARTNERS) would follow same dark, high-contrast Admin style */}
      {activeView === 'PARTNERS' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="bg-slate-900 p-12 rounded-[4rem] border border-slate-800 shadow-2xl flex flex-col justify-between text-white">
            <div className="flex justify-between items-start mb-8">
              <div className="w-16 h-16 bg-slate-800 rounded-[1.5rem] flex items-center justify-center text-4xl shadow-inner border border-slate-700">📱</div>
              <div className="text-right">
                <span className="bg-emerald-900/50 text-emerald-400 text-[10px] font-black px-3 py-1 rounded-full uppercase">Node: ONLINE</span>
                <p className="text-[10px] text-slate-600 font-bold mt-2">QRPay Core v5.2</p>
              </div>
            </div>
            <h3 className="text-2xl font-black mb-4">QRPay Gateway</h3>
            <p className="text-slate-500 text-sm leading-relaxed mb-8">Real-time settlement node for direct-to-bank transfers. Active liquidity pool for immediate learner rewards.</p>
            <button className="w-full bg-slate-800 text-slate-300 py-5 rounded-[1.5rem] font-black text-xs uppercase hover:bg-slate-700 transition-all border border-slate-700">Audit Node Logs</button>
          </div>
          
          <div className="bg-slate-900 p-12 rounded-[4rem] border border-slate-800 shadow-2xl flex flex-col justify-between text-white">
            <div className="flex justify-between items-start mb-8">
              <div className="w-16 h-16 bg-slate-800 rounded-[1.5rem] flex items-center justify-center text-4xl shadow-inner border border-slate-700">🦊</div>
              <div className="text-right">
                <span className="bg-indigo-900/50 text-indigo-400 text-[10px] font-black px-3 py-1 rounded-full uppercase">Node: STABLE</span>
                <p className="text-[10px] text-slate-600 font-bold mt-2">Polygon L2 Bridge</p>
              </div>
            </div>
            <h3 className="text-2xl font-black mb-4">Polygon Bridge</h3>
            <p className="text-slate-500 text-sm leading-relaxed mb-8">Web3 settlement bridge for USDC/stablecoin distributions. Smart contract rebalancing active on-chain.</p>
            <button className="w-full bg-indigo-600 text-white py-5 rounded-[1.5rem] font-black text-xs uppercase hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-500/10">Rebalance Bridge</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagementCenter;
