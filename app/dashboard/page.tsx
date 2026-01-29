'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Upload,
  AlertCircle,
  TrendingUp,
  Repeat,
  BarChart3,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

import { Transaction, Insight } from '@/lib/types';
import { parseCSV } from '@/lib/ingestor';
import { generateRealInsights } from '@/lib/insights-engine';
import { getInsightId, saveInsightState } from '@/lib/insight-state';

const CONFIG = {
  SUBSCRIPTION_PRICE_INCREASE: {
    icon: AlertCircle,
    iconBg: 'bg-rose-600',
    shadowColor: 'shadow-rose-200',
    badgeColor: 'text-rose-600',
    bgColor: 'bg-rose-50',
    borderColor: 'border-rose-100',
    textColor: 'text-rose-900',
    title: 'Subscription Drift',
  },
  SPENDING_SPIKE: {
    icon: TrendingUp,
    iconBg: 'bg-orange-600',
    shadowColor: 'shadow-orange-200',
    badgeColor: 'text-orange-600',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-100',
    textColor: 'text-orange-900',
    title: 'Behavioral Spike',
  },
  FREQUENCY_INCREASE: {
    icon: Repeat,
    iconBg: 'bg-amber-600',
    shadowColor: 'shadow-amber-200',
    badgeColor: 'text-amber-600',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-100',
    textColor: 'text-amber-900',
    title: 'Frequency Creep',
  },
  CATEGORY_SHIFT: {
    icon: BarChart3,
    iconBg: 'bg-blue-600',
    shadowColor: 'shadow-blue-200',
    badgeColor: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-100',
    textColor: 'text-blue-900',
    title: 'Loyalty Shift',
  },
};

const GROUPS = [
  {
    title: 'Subscription Changes',
    description: 'Recurring charges that quietly increased over time.',
    types: ['SUBSCRIPTION_PRICE_INCREASE'],
  },
  {
    title: 'Unusual Spending',
    description: 'Large deviations from your normal spending behavior.',
    types: ['SPENDING_SPIKE'],
  },
  {
    title: 'Behavior Changes',
    description: 'Shifts in frequency or category usage.',
    types: ['FREQUENCY_INCREASE', 'CATEGORY_SHIFT'],
  },
];

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5">
      <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
        {label}
      </div>
      <div className="text-3xl font-black text-slate-900">
        {value}
      </div>
    </div>
  );
}

function InsightCard({ insight }: { insight: Insight }) {
  const id = getInsightId(insight);
  const cfg = CONFIG[insight.type];
  const Icon = cfg.icon;

  const act = (action: 'acknowledge' | 'snooze' | 'hide') => {
    if (action === 'acknowledge') saveInsightState(id, 'acknowledged');
    if (action === 'hide') saveInsightState(id, 'hidden');
    if (action === 'snooze') {
      const until = new Date();
      until.setDate(until.getDate() + 30);
      saveInsightState(id, 'snoozed', until);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className={`p-5 ${cfg.bgColor} ${cfg.borderColor} border-b`}>
        <div className="flex items-start gap-3">
          <div className={`w-10 h-10 ${cfg.iconBg} rounded-lg flex items-center justify-center shadow-sm ${cfg.shadowColor} flex-shrink-0`}>
            <Icon className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <div className={`text-[9px] font-black uppercase tracking-widest ${cfg.badgeColor} mb-1.5`}>
              {cfg.title}
            </div>
            <div className={`text-base font-bold ${cfg.textColor} leading-snug`}>
              {insight.message}
            </div>
            {insight.detail && (
              <div className={`text-sm ${cfg.textColor} opacity-75 mt-1.5`}>
                {insight.detail}
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="p-4 flex gap-2">
        <button
          onClick={() => act('acknowledge')}
          className="text-xs font-bold text-white bg-slate-900 px-4 py-2 rounded-lg hover:bg-slate-800 transition"
        >
          Got it
        </button>
        <button
          onClick={() => act('snooze')}
          className="text-xs font-bold px-4 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition"
        >
          Remind later
        </button>
        <button
          onClick={() => act('hide')}
          className="text-xs font-bold px-4 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition"
        >
          Hide
        </button>
      </div>
    </div>
  );
}

function DashboardContent() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [insights, setInsights] = useState<Insight[]>([]);
  const [uploading, setUploading] = useState(false);

  const onUpload = async (file: File) => {
    if (!file) return;
    setUploading(true);
    try {
      const text = await file.text();
      const parsed = parseCSV(text);
      setTransactions(parsed);
      setInsights(generateRealInsights(parsed));
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50/30 via-emerald-100/40 to-emerald-200/50">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[800px] bg-gradient-to-b from-emerald-100/60 via-emerald-50/40 to-transparent" />
        <div className="absolute top-[10%] right-[-5%] w-[500px] h-[500px] bg-emerald-200/40 rounded-full blur-[120px]" />
        <div className="absolute top-[40%] left-[-10%] w-[600px] h-[600px] bg-emerald-100/50 rounded-full blur-[140px]" />
      </div>

      <header className="relative z-50 sticky top-0 bg-white/60 backdrop-blur-md border-b border-emerald-100">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2 text-slate-500 hover:text-emerald-600 transition-colors group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-[10px] font-black uppercase tracking-widest">Exit</span>
          </Link>

          {transactions.length > 0 && (
            <label className="cursor-pointer bg-slate-900 text-white px-5 py-2 rounded-xl text-xs font-black uppercase tracking-widest hover:scale-105 transition">
              <Upload className="inline w-4 h-4 mr-2" />
              {uploading ? 'Processing…' : 'New Upload'}
              <input
                type="file"
                accept=".csv"
                hidden
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) onUpload(file);
                }}
              />
            </label>
          )}
        </div>
      </header>

      <main className="relative z-10 max-w-6xl mx-auto px-6 py-12">
        {transactions.length === 0 && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-[2.5rem] border-2 border-slate-200 shadow-xl p-12">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Upload className="w-8 h-8 text-emerald-600" />
                </div>
                <h2 className="text-3xl font-black text-slate-900 mb-3">
                  Upload Your Bank CSV
                </h2>
                <p className="text-lg text-slate-600">
                  Import transactions from your bank to detect spending patterns
                </p>
              </div>

              <label className="block cursor-pointer">
                <div className="border-2 border-dashed border-slate-300 hover:border-emerald-400 rounded-2xl p-12 text-center transition-all hover:bg-emerald-50/50">
                  <Upload className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                  <div className="text-lg font-bold text-slate-900 mb-2">
                    Choose a CSV file
                  </div>
                  <div className="text-sm text-slate-500">
                    or drag and drop here
                  </div>
                </div>
                <input
                  type="file"
                  accept=".csv"
                  hidden
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) onUpload(file);
                  }}
                />
              </label>

              <div className="mt-8 p-6 bg-slate-50 rounded-2xl border border-slate-200">
                <h4 className="text-sm font-black text-slate-900 mb-4">Supported Banks:</h4>
                <div className="grid grid-cols-2 gap-3 text-sm text-slate-600">
                  {['Chase', 'Bank of America', 'Wells Fargo', 'Citibank', 'Capital One', 'Discover'].map(bank => (
                    <div key={bank} className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      <span>{bank}</span>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-slate-500 mt-4">
                  + Any bank CSV with date, description, and amount columns
                </p>
              </div>
            </div>
          </div>
        )}

        {transactions.length > 0 && insights.length === 0 && (
          <div className="text-center py-24 rounded-[2.5rem] bg-white border border-slate-200 shadow-sm">
            <ShieldCheck className="w-16 h-16 text-emerald-600 mx-auto mb-6" />
            <h2 className="text-3xl font-black text-slate-900 mb-3">All clear!</h2>
            <p className="text-lg text-slate-600">
              No unusual patterns detected in {transactions.length} transactions.
            </p>
          </div>
        )}

        {insights.length > 0 && (
          <div className="space-y-12">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-black text-slate-900 mb-2">Your Insights</h1>
              <p className="text-slate-600">Analysis complete</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <StatCard label="Transactions" value={transactions.length} />
              <StatCard label="Active Insights" value={insights.length} />
              <StatCard 
                label="Subscriptions Affected" 
                value={insights.filter(i => i.type === 'SUBSCRIPTION_PRICE_INCREASE').length} 
              />
            </div>

            {GROUPS.map(group => {
              const groupInsights = insights.filter(i => group.types.includes(i.type));
              if (!groupInsights.length) return null;

              return (
                <section key={group.title} className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-black text-slate-900">{group.title}</h2>
                    <p className="text-slate-600 mt-1">{group.description}</p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {groupInsights.map(insight => (
                      <InsightCard key={getInsightId(insight)} insight={insight} />
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="p-10 text-xs font-mono uppercase">Loading…</div>}>
      <DashboardContent />
    </Suspense>
  );
}
