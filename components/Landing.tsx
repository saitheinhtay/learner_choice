
import React from 'react';

interface LandingProps {
  onGetStarted: () => void;
}

const Landing: React.FC<LandingProps> = ({ onGetStarted }) => {
  const features = [
    {
      title: "For Students: Learn to Earn",
      description: "Get paid to study. Complete modules, pass quizzes, and earn real-world currency directly into your wallet.",
      icon: "🎓",
      color: "bg-blue-500"
    },
    {
      title: "For Teachers: Impact & Income",
      description: "Turn your knowledge into a recurring revenue stream. Use our AI tools to build world-class courses in minutes.",
      icon: "👨‍🏫",
      color: "bg-purple-500"
    },
    {
      title: "Bank Integrated",
      description: "Seamlessly withdraw your earnings to our global banking partners. No crypto jargon, just real money for real growth.",
      icon: "🏦",
      color: "bg-emerald-500"
    }
  ];

  const topics = [
    { name: "DeFi & Finance", count: "120+ Courses", icon: "💰" },
    { name: "Software Engineering", count: "85+ Courses", icon: "💻" },
    { name: "Digital Marketing", count: "40+ Courses", icon: "📈" },
    { name: "AI & Data Science", count: "65+ Courses", icon: "🧠" },
    { name: "Personal Development", count: "50+ Courses", icon: "🌱" },
    { name: "Creative Arts", count: "30+ Courses", icon: "🎨" }
  ];

  return (
    <div className="space-y-16 pb-16 animate-in fade-in duration-700">
      {/* Hero Section */}
      <section className="relative h-[500px] rounded-[3rem] overflow-hidden bg-slate-900 flex items-center px-12">
        <div className="absolute inset-0 opacity-40">
           <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200" className="w-full h-full object-cover" alt="Background" />
           <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/80 to-transparent"></div>
        </div>
        
        <div className="relative z-10 max-w-2xl space-y-6">
          <div className="inline-flex items-center space-x-2 bg-indigo-500/20 backdrop-blur-md border border-indigo-500/30 px-4 py-2 rounded-full text-indigo-400 text-sm font-bold uppercase tracking-widest">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            <span>Education Revolution</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-white leading-[1.1]">
            Where Knowledge <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-emerald-400">Equals Earnings.</span>
          </h1>
          <p className="text-slate-400 text-lg">
            Learner Choice is the first platform that rewards you for your curiosity. 
            Students earn as they learn, and teachers are paid for their impact.
          </p>
          <div className="flex flex-wrap gap-4 pt-4">
            <button 
              onClick={onGetStarted}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-xl shadow-indigo-600/30 transition-all transform hover:-translate-y-1"
            >
              Start Learning Now
            </button>
            <button className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all">
              Become a Teacher
            </button>
          </div>
        </div>
      </section>

      {/* Value Propositions */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
        {features.map((f, i) => (
          <div key={i} className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 hover:shadow-md transition-shadow group">
            <div className={`${f.color} w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-6 shadow-lg shadow-slate-200 group-hover:scale-110 transition-transform`}>
              {f.icon}
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-3">{f.title}</h3>
            <p className="text-slate-500 leading-relaxed">{f.description}</p>
          </div>
        ))}
      </section>

      {/* Featured Topics */}
      <section className="space-y-8 px-4">
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <h2 className="text-3xl font-bold text-slate-800 tracking-tight">Discover What's Possible</h2>
          <p className="text-slate-500">From coding to cognitive therapy, our diverse range of subjects ensures there is a path for every learner and a niche for every teacher.</p>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
          {topics.map((t, i) => (
            <div key={i} className="bg-slate-50 hover:bg-white border border-slate-100 rounded-3xl p-6 flex items-center space-x-4 transition-all hover:shadow-md cursor-pointer group">
              <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center text-3xl group-hover:bg-indigo-50 transition-colors">
                {t.icon}
              </div>
              <div>
                <h4 className="font-bold text-slate-800">{t.name}</h4>
                <p className="text-xs text-slate-400 font-medium">{t.count}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Trust Section */}
      <section className="bg-indigo-50 rounded-[3rem] p-12 flex flex-col items-center text-center space-y-8">
        <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-[0.2em]">Our Ecosystem Partners</h3>
        <div className="flex flex-wrap justify-center gap-12 grayscale opacity-60">
           <span className="text-2xl font-black text-slate-800">CHASE</span>
           <span className="text-2xl font-black text-slate-800">VISA</span>
           <span className="text-2xl font-black text-slate-800">MASTERCARD</span>
           <span className="text-2xl font-black text-slate-800">HSBC</span>
           <span className="text-2xl font-black text-slate-800">SANTANDER</span>
        </div>
        <div className="pt-8 max-w-3xl">
          <p className="text-indigo-900/70 italic text-lg leading-relaxed">
            "We believe that the time spent improving one's skills is the most valuable asset in the modern economy. Learner Choice creates a direct bridge between self-improvement and financial stability."
          </p>
          <p className="mt-4 font-bold text-indigo-900">— The Learner Choice Foundation</p>
        </div>
      </section>
    </div>
  );
};

export default Landing;
