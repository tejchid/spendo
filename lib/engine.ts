// lib/engine.ts

import { Transaction } from './types';

/**
 * Local MerchantStats shape.
 * This avoids relying on a missing export from types.ts.
 */
export interface MerchantStats {
  merchant: string;
  totalSpent: number;
  transactionCount: number;
  averageSpend: number;
}

export function calculateMerchantStats(
  transactions: Transaction[]
): Map<string, MerchantStats> {
  const statsMap = new Map<string, MerchantStats>();

  for (const tx of transactions) {
    const merchant = tx.merchantClean;

    const current = statsMap.get(merchant) ?? {
      merchant,
      totalSpent: 0,
      transactionCount: 0,
      averageSpend: 0,
    };

    current.totalSpent += tx.amount;
    current.transactionCount += 1;
    current.averageSpend =
      current.totalSpent / current.transactionCount;

    statsMap.set(merchant, current);
  }

  return statsMap;
}
