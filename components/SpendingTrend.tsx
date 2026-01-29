// components/SpendingTrend.tsx

'use client';

import { Transaction } from '@/lib/types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface SpendingTrendProps {
  transactions: Transaction[];
}

export default function SpendingTrend({ transactions }: SpendingTrendProps) {
  const expenses = transactions.filter(t => t.amount < 0);
  
  // Group by date
  const dailySpend = new Map<string, number>();
  expenses.forEach(tx => {
    const dateKey = tx.date.toISOString().split('T')[0];
    const current = dailySpend.get(dateKey) || 0;
    dailySpend.set(dateKey, current + Math.abs(tx.amount));
  });

  const data = Array.from(dailySpend.entries())
    .map(([date, amount]) => ({
      date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      amount,
    }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-white mb-6">Daily Spending</h3>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis
              dataKey="date"
              stroke="#94a3b8"
              style={{ fontSize: '12px' }}
            />
            <YAxis
              stroke="#94a3b8"
              style={{ fontSize: '12px' }}
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1e293b',
                border: '1px solid #334155',
                borderRadius: '8px',
              }}
              formatter={(value: number) => [`$${value.toFixed(2)}`, 'Spent']}
            />
            <Line
              type="monotone"
              dataKey="amount"
              stroke="#f59e0b"
              strokeWidth={2}
              dot={{ fill: '#f59e0b', r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}