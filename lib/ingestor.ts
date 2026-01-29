// Station 1: The Ingestor - converts any bank CSV into canonical transactions

import Papa from 'papaparse';
import { Transaction } from './types';
import { normalizeMerchant } from './normalizer';

interface CSVRow {
  [key: string]: string;
}

interface ColumnMapping {
  date: string;
  description: string;
  debit?: string;
  credit?: string;
  amount?: string;
  balance?: string;
}

/**
 * Auto-detects column names from CSV headers
 * Handles variations like "Date" vs "Trans Date" vs "Transaction Date"
 */
function detectColumns(headers: string[]): ColumnMapping {
  const mapping: ColumnMapping = {
    date: '',
    description: '',
  };
  
  const lowerHeaders = headers.map(h => h.toLowerCase());
  
  // Detect date column
  const datePatterns = ['date', 'trans date', 'transaction date', 'posted date'];
  for (const pattern of datePatterns) {
    const idx = lowerHeaders.findIndex(h => h.includes(pattern));
    if (idx !== -1) {
      mapping.date = headers[idx];
      break;
    }
  }
  
  // Detect description/merchant column
  const descPatterns = ['description', 'merchant', 'memo', 'payee', 'details'];
  for (const pattern of descPatterns) {
    const idx = lowerHeaders.findIndex(h => h.includes(pattern));
    if (idx !== -1) {
      mapping.description = headers[idx];
      break;
    }
  }
  
  // Detect amount columns (debit/credit or single amount)
  const debitIdx = lowerHeaders.findIndex(h => h.includes('debit') || h.includes('withdrawal'));
  const creditIdx = lowerHeaders.findIndex(h => h.includes('credit') || h.includes('deposit'));
  const amountIdx = lowerHeaders.findIndex(h => h.includes('amount'));
  
  if (debitIdx !== -1) mapping.debit = headers[debitIdx];
  if (creditIdx !== -1) mapping.credit = headers[creditIdx];
  if (amountIdx !== -1) mapping.amount = headers[amountIdx];
  
  // Detect balance column
  const balanceIdx = lowerHeaders.findIndex(h => h.includes('balance'));
  if (balanceIdx !== -1) mapping.balance = headers[balanceIdx];
  
  return mapping;
}

/**
 * Parses various date formats into a Date object
 */
function parseDate(dateStr: string): Date {
  // Try ISO format first (YYYY-MM-DD)
  if (/^\d{4}-\d{2}-\d{2}/.test(dateStr)) {
    return new Date(dateStr);
  }
  
  // Try MM/DD/YYYY
  if (/^\d{1,2}\/\d{1,2}\/\d{4}/.test(dateStr)) {
    return new Date(dateStr);
  }
  
  // Try DD/MM/YYYY
  const parts = dateStr.split('/');
  if (parts.length === 3) {
    const [first, second, year] = parts;
    // Heuristic: if first part > 12, it's DD/MM/YYYY
    if (parseInt(first) > 12) {
      return new Date(`${year}-${second}-${first}`);
    }
  }
  
  // Fallback to native parser
  return new Date(dateStr);
}

/**
 * Parses amount strings like "$1,234.56" or "(123.45)" for negative
 */
function parseAmount(amountStr: string | undefined): number {
  if (!amountStr || amountStr.trim() === '') return 0;
  
  // Remove currency symbols and commas
  let cleaned = amountStr.replace(/[$,]/g, '');
  
  // Handle parentheses as negative
  if (cleaned.startsWith('(') && cleaned.endsWith(')')) {
    cleaned = '-' + cleaned.slice(1, -1);
  }
  
  return parseFloat(cleaned) || 0;
}

/**
 * Parse CSV from text string
 */
export function parseCSV(csvText: string): Transaction[] {
  const results = Papa.parse<CSVRow>(csvText, {
    header: true,
    skipEmptyLines: true,
  });
  
  const headers = results.meta.fields || [];
  const mapping = detectColumns(headers);
  
  // Validate we found required columns
  if (!mapping.date || !mapping.description) {
    throw new Error('Could not detect date and description columns');
  }
  
  const transactions: Transaction[] = results.data
    .filter(row => {
      // Skip rows that look like opening balances or headers
      const desc = row[mapping.description]?.toLowerCase() || '';
      return desc && !desc.includes('opening balance') && !desc.includes('balance forward');
    })
    .map((row, index) => {
      const rawDescription = row[mapping.description] || '';
      const { clean, category } = normalizeMerchant(rawDescription);
      
      // Calculate amount (negative for expenses, positive for income)
      let amount = 0;
      if (mapping.amount) {
        amount = parseAmount(row[mapping.amount]);
      } else if (mapping.debit && mapping.credit) {
        const debit = parseAmount(row[mapping.debit]);
        const credit = parseAmount(row[mapping.credit]);
        amount = credit - debit; // Positive for income, negative for expenses
      }
      
      return {
        id: `txn-${Date.now()}-${index}`,
        date: parseDate(row[mapping.date]),
        merchantRaw: rawDescription,
        merchantClean: clean,
        amount,
        category,
        source: 'UPLOAD' as const,
      };
    })
    .sort((a, b) => b.date.getTime() - a.date.getTime());
  
  return transactions;
}
