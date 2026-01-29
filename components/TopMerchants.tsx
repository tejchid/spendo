// components/TopMerchants.tsx

'use client';

import { Transaction } from '@/lib/types';
import { TrendingUp } from 'lucide-react';

interface TopMerchantsProps {
  transactions: Transaction[];
}

export default function TopMerchants({ transactions }: TopMerchantsProps) {
  const expenses = transactions.filter(t => t.amount < 0);
  
  const merchantTotals = new Map<string, { total: number; count: number }>();
  expenses.forEach(tx => {
    const current = merchantTotals.get(tx.merchantClean) || { total: 0, count: 0 };
    merchantTotals.set(tx.merchantClean, {
      total: current.total + Math.abs(tx.amount),
      count: current.count + 1,
    });
  });

  const topMerchants = Array.from(merchantTotals.entries())
    .map(([merchant, data]) => ({ merchant, ...data }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 10);

  const maxTotal = topMerchants[0]?.total || 1;

  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
      <div className="flex items-center gap-2 mb-6">
        <TrendingUp className="w-5 h-5 text-amber-400" />
        <h3 className="text-lg font-semibold text-white">Top Merchants</h3>
      </div>

      <div className="space-y-4">
        {topMerchants.map((item, index) => (
          <div key={item.merchant}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center text-xs font-medium text-slate-300">
                  {index + 1}
                </div>
                <span className="text-sm font-medium text-white">{item.merchant}</span>
              </div>
              <div className="text-right">
                <div className="text-sm font-semibold text-white">
                  ${item.total.toFixed(2)}
                </div>
                <div className="text-xs text-slate-500">
                  {item.count} {item.count === 1 ? 'transaction' : 'transactions'}
                </div>
              </div>
            </div>
            <div className="h-1.5 bg-slate-700/50 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all"
                style={{ width: `${(item.total / maxTotal) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}