// components/TransactionList.tsx

import { Transaction } from '@/lib/types';

export default function TransactionList({ transactions }: { transactions: Transaction[] }) {
  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-900/50 border-b border-slate-700">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-400">Date</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-400">Merchant</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-400">Category</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-slate-400">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/50">
            {transactions.map((tx) => (
              <tr key={tx.id} className="hover:bg-slate-700/30 transition-colors">
                <td className="px-4 py-3 text-sm text-slate-300">
                  {tx.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </td>
                <td className="px-4 py-3">
                  <div className="text-sm text-white font-medium">{tx.merchantClean}</div>
                  <div className="text-xs text-slate-500">{tx.merchantRaw}</div>
                </td>
                <td className="px-4 py-3 text-sm text-slate-400">{tx.category}</td>
                <td className={`px-4 py-3 text-sm text-right font-medium ${tx.amount < 0 ? 'text-red-400' : 'text-green-400'}`}>
                  {tx.amount < 0 ? '-' : '+'}${Math.abs(tx.amount).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}