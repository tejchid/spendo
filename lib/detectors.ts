import { Transaction } from './types';

export interface DetectionResult {
  type: 'SUBSCRIPTION_PRICE_INCREASE' | 'SPENDING_SPIKE' | 'FREQUENCY_INCREASE' | 'CATEGORY_SHIFT';
  severity: 'high' | 'medium' | 'low';
  merchant?: string;
  data: any;
  confidence: number;
}

export function detectSubscriptionPriceIncreases(transactions: Transaction[]): DetectionResult[] {
  const results: DetectionResult[] = [];
  const byMerchant = new Map<string, Transaction[]>();
  
  transactions.forEach(tx => {
    if (tx.amount >= 0) return;
    const existing = byMerchant.get(tx.merchantClean) || [];
    existing.push(tx);
    byMerchant.set(tx.merchantClean, existing);
  });

  byMerchant.forEach((txs, merchant) => {
    if (txs.length < 2) return;
    const sorted = txs.sort((a, b) => a.date.getTime() - b.date.getTime());
    const amounts = sorted.map(t => Math.abs(t.amount));
    const oldAmount = amounts[0];
    const newAmount = amounts[amounts.length - 1];
    const increase = newAmount - oldAmount;
    const increasePercent = (increase / oldAmount) * 100;

    if (increasePercent > 3 && increase > 1) {
      results.push({
        type: 'SUBSCRIPTION_PRICE_INCREASE',
        severity: increasePercent > 20 ? 'high' : 'medium',
        merchant,
        data: { oldValue: oldAmount, newValue: newAmount, increase, increasePercent, yearlyImpact: increase * 12 },
        confidence: 0.85,
      });
    }
  });
  return results;
}

export function detectSpendingSpikes(transactions: Transaction[]): DetectionResult[] {
  const results: DetectionResult[] = [];
  const byMerchant = new Map<string, Transaction[]>();
  
  transactions.forEach(tx => {
    if (tx.amount >= 0) return;
    const existing = byMerchant.get(tx.merchantClean) || [];
    existing.push(tx);
    byMerchant.set(tx.merchantClean, existing);
  });

  byMerchant.forEach((txs, merchant) => {
    if (txs.length < 2) return;
    const amounts = txs.map(t => Math.abs(t.amount)).sort((a, b) => a - b);
    const median = amounts[Math.floor(amounts.length / 2)];
    
    txs.forEach(tx => {
      const amount = Math.abs(tx.amount);
      if (amount > median * 2 && amount > 30) {
        results.push({
          type: 'SPENDING_SPIKE',
          severity: amount > median * 4 ? 'high' : 'medium',
          merchant,
          data: { baseline: median, current: amount, multiplier: amount / median, date: tx.date },
          confidence: 0.9,
        });
      }
    });
  });
  return results;
}

export function detectFrequencyIncreases(transactions: Transaction[]): DetectionResult[] {
  const results: DetectionResult[] = [];
  const sorted = [...transactions].sort((a, b) => a.date.getTime() - b.date.getTime());
  if (sorted.length === 0) return results;
  
  const midpoint = Math.floor(sorted.length / 2);
  const firstHalf = sorted.slice(0, midpoint).filter(t => t.amount < 0);
  const secondHalf = sorted.slice(midpoint).filter(t => t.amount < 0);
  
  const firstByMerchant = new Map<string, number>();
  const secondByMerchant = new Map<string, number>();
  
  firstHalf.forEach(tx => firstByMerchant.set(tx.merchantClean, (firstByMerchant.get(tx.merchantClean) || 0) + 1));
  secondHalf.forEach(tx => secondByMerchant.set(tx.merchantClean, (secondByMerchant.get(tx.merchantClean) || 0) + 1));
  
  secondByMerchant.forEach((count, merchant) => {
    const prevCount = firstByMerchant.get(merchant) || 0;
    if (count >= 5 && count >= prevCount * 1.5) {
      const total = secondHalf.filter(t => t.merchantClean === merchant).reduce((sum, t) => sum + Math.abs(t.amount), 0);
      results.push({
        type: 'FREQUENCY_INCREASE',
        severity: count >= 8 ? 'high' : 'medium',
        merchant,
        data: { frequency: count, previousFrequency: prevCount, total },
        confidence: 0.8,
      });
    }
  });
  return results;
}

export function detectCategoryShifts(transactions: Transaction[]): DetectionResult[] {
  const results: DetectionResult[] = [];
  const sorted = [...transactions].sort((a, b) => a.date.getTime() - b.date.getTime());
  if (sorted.length === 0) return results;
  
  const midpoint = Math.floor(sorted.length / 2);
  const firstHalf = sorted.slice(0, midpoint).filter(t => t.amount < 0);
  const secondHalf = sorted.slice(midpoint).filter(t => t.amount < 0);
  
  const firstByCategory = new Map<string, number>();
  const secondByCategory = new Map<string, number>();
  
  firstHalf.forEach(tx => firstByCategory.set(tx.category, (firstByCategory.get(tx.category) || 0) + Math.abs(tx.amount)));
  secondHalf.forEach(tx => secondByCategory.set(tx.category, (secondByCategory.get(tx.category) || 0) + Math.abs(tx.amount)));
  
  firstByCategory.forEach((prevTotal, category) => {
    const recentTotal = secondByCategory.get(category) || 0;
    const decrease = prevTotal - recentTotal;
    
    if (decrease > 50) {
      secondByCategory.forEach((recentTotal2, category2) => {
        if (category2 === category) return;
        const prevTotal2 = firstByCategory.get(category2) || 0;
        const increase = recentTotal2 - prevTotal2;
        
        if (increase > 50 && Math.abs(increase - decrease) < 100) {
          results.push({
            type: 'CATEGORY_SHIFT',
            severity: 'medium',
            data: { fromCategory: category, toCategory: category2, decreaseAmount: decrease, increaseAmount: increase, netChange: increase - decrease },
            confidence: 0.7,
          });
        }
      });
    }
  });
  return results;
}
