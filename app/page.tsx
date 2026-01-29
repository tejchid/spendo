'use client';

import { useRouter } from 'next/navigation';
import { Upload, ShieldCheck, Zap, BarChart3, Sparkles, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function LandingPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50/30 via-emerald-100/40 to-emerald-200/50 text-slate-900 selection:bg-emerald-100 selection:text-emerald-900 font-sans overflow-x-hidden">
      
      {/* Background Lighting Layers */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[800px] bg-gradient-to-b from-emerald-100/60 via-emerald-50/40 to-transparent" />
        <div className="absolute top-[10%] right-[-5%] w-[500px] h-[500px] bg-emerald-200/40 rounded-full blur-[120px]" />
        <div className="absolute top-[40%] left-[-10%] w-[600px] h-[600px] bg-emerald-100/50 rounded-full blur-[140px]" />
      </div>

      {/* Navigation */}
      <nav className="relative z-10 border-b border-emerald-100 bg-white/60 backdrop-blur-md sticky top-0">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-200">
              <span className="text-white font-black italic text-xl">S</span>
            </div>
            <span className="text-lg font-black tracking-tighter">SPENDO</span>
          </div>
          <div className="flex items-center gap-6">
            <button onClick={() => router.push('/dashboard')} className="bg-slate-900 text-white px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-transform">Get Started</button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 py-24 md:py-32">
        <div className="text-center mb-16">
          <h1 className="text-7xl md:text-8xl font-black text-slate-900 mb-8 tracking-tighter leading-[0.85]">
            The memory layer <br/>
            <span className="text-emerald-600 italic underline decoration-emerald-200 decoration-8 underline-offset-[12px]">for your money.</span>
          </h1>
          
          <p className="text-xl text-slate-700 font-medium max-w-2xl mx-auto mb-12 leading-relaxed">
            Spendo uses deterministic logic to identify behavioral spending patterns, stealth price hikes, and category shifts that banks ignore.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => router.push('/demo')}
              className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white px-10 py-5 rounded-2xl font-black text-lg shadow-2xl shadow-emerald-200 hover:scale-105 transition-all"
            >
              Try Interactive Demo
            </button>
            <button
              onClick={() => router.push('/dashboard')}
              className="w-full sm:w-auto bg-white border border-slate-200 text-slate-900 px-10 py-5 rounded-2xl font-black text-lg hover:bg-slate-50 transition-all flex items-center justify-center gap-2 group"
            >
              Upload CSV <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* Visual Preview Card */}
        <div className="bg-white rounded-[2.5rem] shadow-[0_40px_100px_-20px_rgba(16,185,129,0.15)] border border-emerald-100 overflow-hidden mb-24">
          <div className="grid md:grid-cols-2 divide-x divide-slate-100">
            <div className="p-10 bg-slate-50/50">
              <div className="space-y-4 font-mono text-xs">
                {['STARBUCKS #4821 -$6.45', 'AMZN MKTP US* -$2.18', 'SWEETGREEN 0123 -$16.78', 'UBER *TRIP -$24.30', 'WHOLEFD2 MRKT -$6.32'].map((tx, i) => (
                  <div key={i} className="text-slate-400 flex justify-between border-b border-slate-100 pb-2">
                    <span>{tx.split(' -')[0]}</span>
                    <span className="font-bold">-{tx.split('-')[1]}</span>
                  </div>
                ))}
                <div className="bg-emerald-50 text-emerald-600 px-3 py-2 rounded-lg font-bold">
                  + Analyzing 3,842 additional events...
                </div>
              </div>
            </div>

            <div className="p-10 bg-white relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-100/20 blur-3xl rounded-full" />
              
              <div className="space-y-8">
                <div className="flex justify-between items-end">
                  <div className="space-y-1">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Net_Volume</span>
                    <div className="text-4xl font-black text-slate-900">$3,745</div>
                  </div>
                  <div className="text-right space-y-1">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Outflow</span>
                    <div className="text-2xl font-black text-rose-500">$1,892</div>
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-slate-100">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Pattern_Analysis</span>
                  {[
                    { label: 'Groceries', val: '$342', color: 'bg-emerald-500', w: '70%' },
                    { label: 'Transport', val: '$189', color: 'bg-blue-500', w: '40%' }
                  ].map((cat, i) => (
                    <div key={i} className="space-y-2">
                      <div className="flex justify-between text-xs font-bold">
                        <span className="text-slate-600 uppercase tracking-tighter">{cat.label}</span>
                        <span className="text-slate-900">{cat.val}</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-1.5">
                        <div className={`${cat.color} h-1.5 rounded-full`} style={{ width: cat.w }}></div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-slate-900 rounded-2xl p-4 mt-6">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                      <Zap className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div>
                      <div className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Smart_Alert</div>
                      <div className="text-xs text-white font-medium mt-1">3 stealth price hikes detected.</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="grid md:grid-cols-3 gap-12 text-left pt-16 border-t border-white/40">
          {[
            { icon: Zap, title: "Velocity Monitor", desc: "Detects frequency creep where prices stay flat but visit volume spikes." },
            { icon: BarChart3, title: "Category Substitution", desc: "Identifies when you didn't save money, you just shifted categories." },
            { icon: ShieldCheck, title: "Privacy First", desc: "Your data never leaves your browser. 100% client-side deterministic logic." }
          ].map((feature, i) => (
            <div key={i} className="group">
              <div className="w-12 h-12 bg-white/80 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-emerald-600 transition-colors shadow-lg">
                <feature.icon className="w-6 h-6 text-emerald-600 group-hover:text-white transition-colors" />
              </div>
              <h4 className="text-xl font-black mb-2 tracking-tight text-white">{feature.title}</h4>
              <p className="text-emerald-50/90 text-sm font-medium leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
