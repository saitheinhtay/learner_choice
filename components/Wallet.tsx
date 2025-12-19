import React, { useState } from 'react';
import { UserProfile, Transaction } from '../types';

const MOCK_TXNS: Transaction[] = [
  { id: '1', type: 'REWARD', method: 'BANK', amount: 50.00, date: '2023-11-20', description: 'Course Completion: Intro to Finance', status: 'COMPLETED' },
  { id: '2', type: 'WITHDRAWAL', method: 'QRPAY', amount: -200.00, date: '2023-11-18', description: 'Transfer to QRPay Account (ID: 8829)', status: 'COMPLETED' },
  { id: '3', type: 'STAKING', method: 'INTERNAL', amount: -500, date: '2023-11-15', description: 'Staked LP for 1.2x Earning Multiplier', status: 'COMPLETED' },
  { id: '4', type: 'REFERRAL', method: 'INTERNAL', amount: 12.50, date: '2023-11-12', description: 'Referral Bonus: User @CryptoLearner', status: 'COMPLETED' },
];

const Wallet: React.FC<{ user: UserProfile, setUser: React.Dispatch<React.SetStateAction<UserProfile | null>> }> = ({ user, setUser }) => {
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [method, setMethod] = useState<'QRPAY' | 'CRYPTO' | 'BANK'>('BANK');
  const [amount, setAmount] = useState('');
  const [isConnecting, setIsConnecting] = useState<string | null>(null);
  const [giftRecipient, setGiftRecipient] = useState('');
  const [giftAmount, setGiftAmount] = useState('');

  const handleWithdraw = () => {
    const val = parseFloat(amount);
    if (val > 0 && val <= user.balance) {
      setUser(prev => prev ? ({ ...prev, balance: prev.balance - val }) : null);
      alert(`Successfully withdrew $${val} via ${method}!`);
      setAmount('');
      setShowWithdraw(false);
    } else {
      alert("Invalid withdrawal amount.");
    }
  };

  const handleGift = () => {
    const val = parseFloat(giftAmount);
    if (val > 0 && val <= user.balance && giftRecipient) {
      setUser(prev => prev ? ({ ...prev, balance: prev.balance - val }) : null);
      alert(`Gifted $${val} to ${giftRecipient}! The user will receive it instantly.`);
      setGiftAmount('');
      setGiftRecipient('');
    } else {
      alert("Check recipient and amount.");
    }
  };

  const exportLedger = () => {
    const content = `LEARNER CHOICE - FINANCIAL AUDIT REPORT\n` +
      `User: ${user.name}\n` +
      `Date: ${new Date().toLocaleDateString()}\n` +
      `----------------------------------------\n` +
      `Current Balance: $${user.balance.toFixed(2)}\n` +
      `Learning Points: ${user.learningPoints}\n` +
      `Staked Points: ${user.stakedPoints}\n\n` +
      `RECENT TRANSACTIONS:\n` +
      MOCK_TXNS.map(t => `${t.date} | ${t.type} | ${t.description} | ${t.amount > 0 ? '+' : ''}${t.amount}`).join('\n');
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `learner_ledger_${user.name.toLowerCase().replace(' ', '_')}.txt`;
    a.click();
  };

  const connectQRPay = () => {
    setIsConnecting('QRPAY');
    setTimeout(() => {
      setUser(prev => prev ? ({ ...prev, qrPayLinked: true }) : null);
      setIsConnecting(null);
    }, 2000);
  };

  const connectCrypto = () => {
    setIsConnecting('CRYPTO');
    setTimeout(() => {
      setUser(prev => prev ? ({ ...prev, cryptoAddress: '0x71C...4f92' }) : null);
      setIsConnecting(null);
    }, 1500);
  };

  const stakePoints = (pts: number) => {
    if (user.learningPoints >= pts) {
      setUser(prev => prev ? ({
        ...prev,
        learningPoints: prev.learningPoints - pts,
        stakedPoints: (prev.stakedPoints || 0) + pts
      }) : null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12 animate-in fade-in duration-500">
      {/* Main Balance Hero */}
      <div className="bg-slate-900 p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-[-50%] right-[-10%] w-[60%] h-[150%] bg-indigo-500/20 rounded-full blur-[100px]"></div>
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-12">
          <div className="space-y-4">
            <div>
              <p className="text-indigo-300 text-[10px] font-black uppercase tracking-[0.3em] mb-2">Available Balance</p>
              <h2 className="text-6xl font-black tabular-nums tracking-tighter">${user.balance.toFixed(2)}</h2>
            </div>
            <div className="flex items-center space-x-8 pt-4">
              <div>
                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">Earning Power</p>
                <p className="text-xl font-black text-emerald-400">{(1 + (user.stakedPoints / 1000)).toFixed(1)}x</p>
              </div>
              <div className="h-10 w-px bg-slate-700"></div>
              <div>
                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">Referral Earnings</p>
                <p className="text-xl font-black text-indigo-400">${user.totalReferralEarnings.toFixed(2)}</p>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <button 
              onClick={() => setShowWithdraw(true)}
              className="bg-indigo-600 text-white px-10 py-5 rounded-[1.5rem] font-black text-lg shadow-xl shadow-indigo-600/30 hover:bg-indigo-700 transition-all hover:scale-105 active:scale-95"
            >
              Withdraw Funds
            </button>
            <button className="bg-white/5 hover:bg-white/10 backdrop-blur border border-white/10 text-white px-8 py-5 rounded-[1.5rem] font-bold transition-all">
              Invite Friends
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <section className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-black text-slate-800 mb-2">Referral Program</h3>
                <p className="text-slate-500 text-xs mb-6">Share your code and earn 5% of all rewards your friends earn, forever.</p>
                <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl flex items-center justify-between mb-6">
                  <span className="font-mono font-bold text-indigo-600 text-lg">{user.referralCode || 'LEARN-2024'}</span>
                  <button className="text-[10px] font-black text-slate-400 uppercase hover:text-indigo-600" onClick={() => navigator.clipboard.writeText(user.referralCode || 'LEARN-2024')}>Copy</button>
                </div>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 font-bold uppercase">Successful Invites</span>
                <span className="font-black text-slate-800">12 Students</span>
              </div>
            </section>

            <section className="bg-indigo-50 p-8 rounded-[2.5rem] border border-indigo-100 shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-black text-indigo-900 mb-2">Scholarship Fund</h3>
                <p className="text-indigo-700 text-xs mb-6">Sponsor high-potential students who can't afford course fees.</p>
                <div className="flex -space-x-3 mb-6">
                   {[1,2,3,4].map(i => (
                     <img key={i} src={`https://picsum.photos/seed/stud${i}/40`} className="w-10 h-10 rounded-full border-2 border-white shadow-sm" alt="Student" />
                   ))}
                   <div className="w-10 h-10 rounded-full bg-indigo-200 border-2 border-white flex items-center justify-center text-[10px] font-bold text-indigo-600">+8</div>
                </div>
              </div>
              <button className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black text-xs hover:bg-indigo-700 transition-all">
                Browse Candidates
              </button>
            </section>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col justify-between group">
              <div>
                <div className="flex justify-between items-start mb-6">
                  <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">📱</div>
                  <span className="bg-indigo-100 text-indigo-600 text-[10px] font-black px-2 py-1 rounded-full uppercase">QRPay PARTNER</span>
                </div>
                <h3 className="text-xl font-black text-slate-800 mb-2">QRPay Instant</h3>
                <p className="text-slate-500 text-sm leading-relaxed mb-6">Instant QR-based withdrawals with zero commission for verified learners.</p>
              </div>
              {user.qrPayLinked ? (
                <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-2xl flex items-center justify-between text-sm font-bold text-emerald-900">
                  <span>QRPay Active ✓</span>
                  <button className="text-[10px] text-slate-400 hover:text-red-500">Unlink</button>
                </div>
              ) : (
                <button onClick={connectQRPay} className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black text-sm hover:bg-slate-800 transition-all">
                  {isConnecting === 'QRPAY' ? 'Linking...' : 'Connect QRPay'}
                </button>
              )}
            </div>

            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col justify-between group">
              <div>
                <div className="flex justify-between items-start mb-6">
                  <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">🦊</div>
                  <span className="bg-indigo-100 text-indigo-600 text-[10px] font-black px-2 py-1 rounded-full uppercase">POLYGON</span>
                </div>
                <h3 className="text-xl font-black text-slate-800 mb-2">Crypto Wallet</h3>
                <p className="text-slate-500 text-sm leading-relaxed mb-6">Withdraw rewards in stablecoins (USDC) via Layer 2 networks.</p>
              </div>
              {user.cryptoAddress ? (
                <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-2xl flex items-center justify-between font-mono text-xs font-bold text-indigo-900 overflow-hidden">
                  <span className="truncate">{user.cryptoAddress}</span>
                  <button className="text-[10px] text-slate-400 hover:text-red-500 ml-2">Unlink</button>
                </div>
              ) : (
                <button onClick={connectCrypto} className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black text-sm hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100">
                  {isConnecting === 'CRYPTO' ? 'Signing...' : 'Connect Web3'}
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <section className="bg-indigo-600 p-8 rounded-[2.5rem] text-white shadow-xl shadow-indigo-100 relative overflow-hidden">
            <div className="absolute bottom-[-20%] left-[-20%] w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
            <h3 className="text-xl font-black mb-4 flex items-center">
              <span className="mr-2">⚡</span> Reward Booster
            </h3>
            <p className="text-indigo-100 text-sm mb-6 leading-relaxed">Stake your LP to permanently increase your rewards.</p>
            <div className="space-y-4">
              <div className="bg-white/10 border border-white/10 p-4 rounded-2xl">
                <p className="text-[10px] font-black text-indigo-200 uppercase mb-1">Current Staked</p>
                <p className="text-2xl font-black">{user.stakedPoints || 0} LP</p>
              </div>
              <button 
                onClick={() => stakePoints(100)}
                disabled={user.learningPoints < 100}
                className="w-full bg-white text-indigo-600 py-4 rounded-2xl font-black text-sm hover:bg-indigo-50 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Stake 100 LP (+0.1x)
              </button>
            </div>
          </section>

          <section className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <h3 className="text-lg font-black text-slate-800 mb-4 flex items-center">
               <span className="mr-2">🎁</span> Send a Tip
            </h3>
            <p className="text-slate-500 text-xs mb-6">Gift funds to a teacher or fellow learner instantly.</p>
            <div className="space-y-3">
              <input 
                placeholder="Learner ID or Email" 
                value={giftRecipient}
                onChange={e => setGiftRecipient(e.target.value)}
                className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              <input 
                placeholder="Amount ($)" 
                type="number"
                value={giftAmount}
                onChange={e => setGiftAmount(e.target.value)}
                className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              <button 
                onClick={handleGift}
                className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold text-xs hover:bg-slate-800 transition-all"
              >
                Send Gift
              </button>
            </div>
          </section>
        </div>
      </div>

      <section className="bg-white rounded-[3rem] shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex items-center justify-between">
          <h3 className="font-black text-slate-800 text-lg">Platform Ledgers</h3>
          <button 
            onClick={exportLedger}
            className="text-xs font-black text-indigo-600 bg-indigo-50 px-4 py-2 rounded-xl hover:bg-indigo-100"
          >
            Export Audit Ledger
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 text-slate-400 text-[10px] uppercase tracking-widest font-black">
                <th className="px-8 py-5">Source</th>
                <th className="px-8 py-5">Method</th>
                <th className="px-8 py-5">Date</th>
                <th className="px-8 py-5 text-right">Magnitude</th>
                <th className="px-8 py-5">Integrity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {MOCK_TXNS.map(txn => (
                <tr key={txn.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-6 font-bold text-slate-800 text-sm">{txn.description}</td>
                  <td className="px-8 py-6">
                    <span className="text-[10px] font-black text-slate-400 uppercase bg-slate-100 px-2 py-1 rounded-md">{txn.method}</span>
                  </td>
                  <td className="px-8 py-6 text-sm text-slate-500 font-medium">{txn.date}</td>
                  <td className={`px-8 py-6 text-right font-black text-sm ${txn.amount > 0 ? 'text-emerald-500' : 'text-slate-800'}`}>
                    {txn.amount > 0 ? '+' : ''}{txn.amount.toFixed(2)}
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center space-x-2">
                       <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                       <span className="text-[10px] font-black text-slate-400 uppercase">{txn.status}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {showWithdraw && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-xl rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-10 space-y-8">
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-black text-slate-800">Withdrawal</h3>
                <button onClick={() => setShowWithdraw(false)} className="text-slate-400 hover:text-slate-600 text-2xl">✕</button>
              </div>

              <div className="space-y-4">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Transfer Destination</label>
                <div className="grid grid-cols-3 gap-3">
                  {(['QRPAY', 'CRYPTO', 'BANK'] as const).map(m => (
                    <button 
                      key={m}
                      onClick={() => setMethod(m)}
                      className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center space-y-2 ${method === m ? 'border-indigo-500 bg-indigo-50' : 'border-slate-100'}`}
                    >
                      <span className="text-2xl">{m === 'QRPAY' ? '📱' : m === 'CRYPTO' ? '🦊' : '🏦'}</span>
                      <span className="text-[10px] font-black text-slate-500 uppercase">{m}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Magnitude (USD)</label>
                <input 
                  type="number" 
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-3xl px-8 py-6 text-2xl font-black focus:outline-none focus:border-indigo-500"
                />
              </div>

              <button 
                onClick={handleWithdraw}
                className="w-full bg-slate-900 text-white py-6 rounded-3xl font-black text-xl hover:bg-slate-800 transition-all shadow-xl shadow-slate-200"
              >
                Initiate Transfer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Wallet;
