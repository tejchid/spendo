// lib/storage.ts

import { Transaction } from './types';

const STORAGE_KEY = 'spendo_transactions';

export function saveTransactions(transactions: Transaction[]): void {
  if (typeof window === 'undefined') return;
  
  const data = transactions.map(tx => ({
    ...tx,
    date: tx.date.toISOString(),
  }));
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function loadTransactions(): Transaction[] {
  if (typeof window === 'undefined') return [];
  
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return [];
  
  const data = JSON.parse(stored);
  return data.map((tx: any) => ({
    ...tx,
    date: new Date(tx.date),
  }));
}

export function clearTransactions(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
}