'use client';

import { useEffect, useRef } from 'react';
import { ArrowLeft, TrendingUp, AlertCircle, Repeat, BarChart3, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, CartesianGrid, Tooltip } from 'recharts';

export default function DemoPage() {
  const sectionsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('opacity-100', 'translate-y-0');
            entry.target.classList.remove('opacity-0', 'translate-y-12');
          }
        });
      },
      { threshold: 0.15 }
    );

    sectionsRef.current.forEach((section) => {
      if (section) observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  const netflixData = [
    { month: 'Nov', price: 15.99 },
    { month: 'Dec', price: 15.99 },
    { month: 'Jan', price: 22.99 },
  ];

  const starbucksData = [
    { date: 'Dec 5', amount: 12.50 },
    { date: 'Dec 10', amount: 11.75 },
    { date: 'Dec 15', amount: 13.20 },
    { date: 'Dec 20', amount: 10.90 },
    { date: 'Jan 4', amount: 85.00 },
  ];

  const loyaltyData = [
    { category: 'Dining Out', dec: 180, jan: 60 },
    { category: 'Delivery', dec: 55, jan: 296 },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-emerald-100 selection:text-emerald-900 font-sans overflow-x-hidden">
      
      {/* Background Lighting Layers - Matches Landing Page */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[800px] bg-gradient-to-b from-emerald-50/60 via-white to-transparent" />
        <div className="absolute top-[20%] right-[-10%] w-[500px] h-[500px] bg-emerald-100/30 rounded-full blur-[120px]" />
        <div className="absolute bottom-[10%] left-[-5%] w-[600px] h-[600px] bg-emerald-50/40 rounded-full blur-[140px]" />
      </div>

      {/* Header */}
      <nav className="relative z-50 border-b border-slate-100 bg-white/60 backdrop-blur-md sticky top-0">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-slate-500 hover:text-emerald-600 transition-colors group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-[10px] font-black uppercase tracking-widest">Exit Demo</span>
          </Link>
        </div>
      </nav>

      {/* Hero Intro */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 py-32 text-center">
        <h1 className="text-6xl md:text-7xl font-black text-slate-900 mb-8 tracking-tighter leading-[0.85]">
          Five insights your bank <br/>
          <span className="text-emerald-600 italic underline decoration-emerald-200 decoration-8 underline-offset-[12px]">won't tell you.</span>
        </h1>
        <p className="text-xl text-slate-500 font-medium max-w-2xl mx-auto mb-12 leading-relaxed">
          See how the Spendo engine translates millions of raw financial events into human explanations.
        </p>
        <div className="flex flex-col items-center gap-3 text-slate-300">
          <ChevronDown className="w-6 h-6 animate-bounce" />
          <span className="text-[10px] font-black uppercase tracking-[0.3em]">Begin Analysis</span>
        </div>
      </div>

      {/* Main Container */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 space-y-48 pb-48">

        {/* Section 1: The Stealth Hike */}
        <div
          ref={(el) => { if (el) sectionsRef.current[0] = el; }}
          className="opacity-0 translate-y-12 transition-all duration-1000 ease-out"
        >
          <div className="flex items-start gap-6 mb-12">
            <div className="w-16 h-16 bg-rose-600 rounded-[1.5rem] flex items-center justify-center flex-shrink-0 shadow-2xl shadow-rose-200">
              <AlertCircle className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-4xl font-black text-slate-900 tracking-tight">The Stealth Hike</h2>
              <p className="text-lg text-slate-500 font-medium mt-2 leading-relaxed">
                Subscriptions quietly raise prices. Most people don't notice until they check their statement weeks later.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-2xl shadow-slate-200/50 overflow-hidden">
            <div className="p-10 bg-rose-50 border-b border-rose-100">
              <p className="text-2xl font-bold text-rose-900 leading-tight">
                💳 Heads up: Netflix quietly raised its price from <span className="bg-white px-3 py-1 rounded-lg border border-rose-200 shadow-sm">$15.99</span> to <span className="text-rose-600 font-black underline decoration-4 decoration-rose-200">$22.99</span>.
              </p>
              <p className="text-sm text-rose-700 mt-4 font-bold uppercase tracking-wide italic">Impact Identified: +$84/year leakage</p>
            </div>
            
            <div className="p-10">
              <div className="mb-10">
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Price History_Stream</div>
                <div className="h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={netflixData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 700, fill: '#94a3b8' }} />
                      <YAxis hide domain={[10, 25]} />
                      <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }} />
                      <Line
                        type="stepAfter"
                        dataKey="price"
                        stroke="#e11d48"
                        strokeWidth={4}
                        dot={{ fill: '#e11d48', r: 6, strokeWidth: 4, stroke: '#fff' }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: The Behavioral Spike */}
        <div
          ref={(el) => { if (el) sectionsRef.current[1] = el; }}
          className="opacity-0 translate-y-12 transition-all duration-1000 ease-out"
        >
          <div className="flex items-start gap-6 mb-12">
            <div className="w-16 h-16 bg-orange-600 rounded-[1.5rem] flex items-center justify-center flex-shrink-0 shadow-2xl shadow-orange-200">
              <TrendingUp className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-4xl font-black text-slate-900 tracking-tight">The Behavioral Spike</h2>
              <p className="text-lg text-slate-500 font-medium mt-2 leading-relaxed">
                Out-of-character spending. When a single transaction is way above your normal pattern.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl overflow-hidden p-10">
            <div className="p-8 bg-orange-50 rounded-[1.5rem] border border-orange-100 mb-10">
              <p className="text-2xl font-bold text-orange-900 leading-tight">
                ☕ You usually spend <span className="font-black">$12.50</span> at Starbucks, but today was <span className="text-orange-600 underline decoration-4 decoration-orange-200 italic">$85.00</span>.
              </p>
              <p className="text-[10px] font-black uppercase tracking-widest text-orange-700 mt-4 italic">6.8× deviation from historical median</p>
            </div>
            
            <div className="h-64 mb-10">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={starbucksData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 700, fill: '#94a3b8' }} />
                  <Bar dataKey="amount" radius={[12, 12, 4, 4]}>
                    {starbucksData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.amount > 20 ? '#f97316' : '#e2e8f0'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Section 3: The Frequency Creep */}
        <div
          ref={(el) => { if (el) sectionsRef.current[2] = el; }}
          className="opacity-0 translate-y-12 transition-all duration-1000 ease-out"
        >
          <div className="flex items-start gap-6 mb-12">
            <div className="w-16 h-16 bg-amber-500 rounded-[1.5rem] flex items-center justify-center flex-shrink-0 shadow-2xl shadow-amber-200">
              <Repeat className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-4xl font-black text-slate-900 tracking-tight">The Frequency Creep</h2>
              <p className="text-lg text-slate-500 font-medium mt-2 leading-relaxed">
                You're not spending more per visit—you're just visiting way more often than you used to.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl overflow-hidden p-10">
            <div className="grid grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <p className="text-2xl font-bold text-slate-900 leading-tight">
                  🍔 You visited Uber Eats <span className="text-amber-600 font-black italic">10 times</span> this month.
                </p>
                <div className="bg-amber-50 rounded-2xl p-6 border border-amber-100">
                  <div className="text-[10px] font-black uppercase tracking-widest text-amber-700 mb-2">System_Inference</div>
                  <p className="text-xs text-amber-900 font-medium">Monthly frequency increased 400%. Total leakage: $296.50.</p>
                </div>
              </div>
              <div className="grid grid-cols-5 gap-3">
                 {[...Array(10)].map((_, i) => (
                    <div key={i} className="h-12 bg-amber-500 rounded-xl shadow-lg shadow-amber-100 animate-pulse" style={{ animationDelay: `${i * 100}ms` }} />
                 ))}
              </div>
            </div>
          </div>
        </div>

        {/* Section 4: The Loyalty Shift */}
        <div
          ref={(el) => { if (el) sectionsRef.current[3] = el; }}
          className="opacity-0 translate-y-12 transition-all duration-1000 ease-out"
        >
          <div className="flex items-start gap-6 mb-12">
            <div className="w-16 h-16 bg-blue-600 rounded-[1.5rem] flex items-center justify-center flex-shrink-0 shadow-2xl shadow-blue-200">
              <BarChart3 className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-4xl font-black text-slate-900 tracking-tight">The Loyalty Shift</h2>
              <p className="text-lg text-slate-500 font-medium mt-2 leading-relaxed">
                Spending didn't go down—it just moved. You didn't save money, you shifted where it goes.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl overflow-hidden p-10">
            <div className="p-8 bg-blue-50 rounded-3xl border border-blue-100 mb-10 text-center">
              <p className="text-2xl font-bold text-blue-900 leading-tight">
                🍽️ Dining Out is down <span className="text-emerald-600">$120</span>, but Food Delivery is up <span className="text-rose-600">$241</span>.
              </p>
              <p className="text-[10px] font-black uppercase tracking-widest text-blue-700 mt-4 italic underline decoration-blue-200 decoration-4">Net impact: -$121 lifestyle expansion</p>
            </div>
            
            <div className="h-64 mb-8">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={loyaltyData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                  <XAxis type="number" hide />
                  <YAxis type="category" dataKey="category" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 700, fill: '#94a3b8' }} width={100} />
                  <Bar dataKey="dec" fill="#e2e8f0" radius={[0, 4, 4, 0]} barSize={24} />
                  <Bar dataKey="jan" fill="#2563eb" radius={[0, 4, 4, 0]} barSize={24} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

      </div>

      {/* Final CTA */}
      <div className="py-40 bg-emerald-900 rounded-[4rem] mx-4 mb-8 text-center text-white shadow-2xl shadow-emerald-950/40 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-64 h-64 bg-emerald-400/20 blur-[120px]" />
        
        <div className="relative z-10 max-w-3xl mx-auto px-6">
          <h3 className="text-5xl md:text-6xl font-black mb-6 tracking-tighter italic">Ready to see <br/>your own story?</h3>
          <p className="text-xl text-emerald-100/80 font-medium mb-12 max-w-xl mx-auto">
            Upload your bank CSV and get a deterministic report of your behavior in seconds—no signup required.
          </p>
          <Link
            href="/dashboard"
            className="inline-block bg-white text-emerald-900 px-12 py-5 rounded-2xl font-black text-xl hover:scale-105 transition-all shadow-2xl shadow-emerald-950/20"
          >
            Upload Your CSV
          </Link>
        </div>
      </div>
    </div>
  );
}
