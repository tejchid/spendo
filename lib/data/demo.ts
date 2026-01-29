// lib/data/demo.ts

import { Transaction } from '../types';

export const DEMO_TRANSACTIONS: Transaction[] = [
  // STARBUCKS BASELINE (Dec) - normal spending
  { id: 'demo-1', date: new Date('2024-12-05'), merchantRaw: 'Starbucks #4821', merchantClean: 'Starbucks', amount: -12.50, category: 'Food & Drink', source: 'DEMO' },
  { id: 'demo-2', date: new Date('2024-12-10'), merchantRaw: 'Starbucks #4821', merchantClean: 'Starbucks', amount: -11.75, category: 'Food & Drink', source: 'DEMO' },
  { id: 'demo-3', date: new Date('2024-12-15'), merchantRaw: 'Starbucks #4821', merchantClean: 'Starbucks', amount: -13.20, category: 'Food & Drink', source: 'DEMO' },
  { id: 'demo-4', date: new Date('2024-12-20'), merchantRaw: 'Starbucks #4821', merchantClean: 'Starbucks', amount: -10.90, category: 'Food & Drink', source: 'DEMO' },
  
  // STARBUCKS SPIKE (Jan) - THE ANOMALY
  { id: 'demo-5', date: new Date('2025-01-05'), merchantRaw: 'Starbucks #4821', merchantClean: 'Starbucks', amount: -85.00, category: 'Food & Drink', source: 'DEMO' },
  { id: 'demo-6', date: new Date('2025-01-10'), merchantRaw: 'Starbucks #4821', merchantClean: 'Starbucks', amount: -12.50, category: 'Food & Drink', source: 'DEMO' },
  
  // NETFLIX STEALTH HIKE
  { id: 'demo-7', date: new Date('2024-11-15'), merchantRaw: 'Netflix.com', merchantClean: 'Netflix', amount: -15.99, category: 'Subscriptions', source: 'DEMO' },
  { id: 'demo-8', date: new Date('2024-12-15'), merchantRaw: 'Netflix.com', merchantClean: 'Netflix', amount: -15.99, category: 'Subscriptions', source: 'DEMO' },
  { id: 'demo-9', date: new Date('2025-01-15'), merchantRaw: 'Netflix.com', merchantClean: 'Netflix', amount: -22.99, category: 'Subscriptions', source: 'DEMO' },
  
  // GROCERIES BASELINE + SPIKE
  { id: 'demo-10', date: new Date('2024-12-08'), merchantRaw: 'Safeway #1234', merchantClean: 'Safeway', amount: -65.23, category: 'Groceries', source: 'DEMO' },
  { id: 'demo-11', date: new Date('2024-12-22'), merchantRaw: 'Safeway #1234', merchantClean: 'Safeway', amount: -72.10, category: 'Groceries', source: 'DEMO' },
  { id: 'demo-12', date: new Date('2025-01-12'), merchantRaw: 'Safeway #1234', merchantClean: 'Safeway', amount: -68.50, category: 'Groceries', source: 'DEMO' },
  { id: 'demo-13', date: new Date('2025-01-20'), merchantRaw: 'Safeway #1234', merchantClean: 'Safeway', amount: -210.45, category: 'Groceries', source: 'DEMO' },
  
  // UBER EATS FREQUENCY CREEP (2x in Dec, 8x in Jan)
  { id: 'demo-14', date: new Date('2024-12-05'), merchantRaw: 'Uber Eats', merchantClean: 'Uber Eats', amount: -25.00, category: 'Food Delivery', source: 'DEMO' },
  { id: 'demo-15', date: new Date('2024-12-18'), merchantRaw: 'Uber Eats', merchantClean: 'Uber Eats', amount: -30.00, category: 'Food Delivery', source: 'DEMO' },
  { id: 'demo-16', date: new Date('2025-01-03'), merchantRaw: 'Uber Eats', merchantClean: 'Uber Eats', amount: -28.00, category: 'Food Delivery', source: 'DEMO' },
  { id: 'demo-17', date: new Date('2025-01-07'), merchantRaw: 'Uber Eats', merchantClean: 'Uber Eats', amount: -32.00, category: 'Food Delivery', source: 'DEMO' },
  { id: 'demo-18', date: new Date('2025-01-12'), merchantRaw: 'Uber Eats', merchantClean: 'Uber Eats', amount: -27.50, category: 'Food Delivery', source: 'DEMO' },
  { id: 'demo-19', date: new Date('2025-01-16'), merchantRaw: 'Uber Eats', merchantClean: 'Uber Eats', amount: -35.00, category: 'Food Delivery', source: 'DEMO' },
  { id: 'demo-20', date: new Date('2025-01-20'), merchantRaw: 'Uber Eats', merchantClean: 'Uber Eats', amount: -29.00, category: 'Food Delivery', source: 'DEMO' },
  { id: 'demo-21', date: new Date('2025-01-22'), merchantRaw: 'Uber Eats', merchantClean: 'Uber Eats', amount: -31.00, category: 'Food Delivery', source: 'DEMO' },
  { id: 'demo-22', date: new Date('2025-01-24'), merchantRaw: 'Uber Eats', merchantClean: 'Uber Eats', amount: -26.00, category: 'Food Delivery', source: 'DEMO' },
  { id: 'demo-23', date: new Date('2025-01-27'), merchantRaw: 'Uber Eats', merchantClean: 'Uber Eats', amount: -33.00, category: 'Food Delivery', source: 'DEMO' },
  
  // NEW MERCHANT (first appearance)
  { id: 'demo-24', date: new Date('2025-01-18'), merchantRaw: 'Equinox', merchantClean: 'Equinox', amount: -195.00, category: 'Fitness', source: 'DEMO' },
  
  // DINING OUT (Dec baseline)
  { id: 'demo-25', date: new Date('2024-12-10'), merchantRaw: 'Chipotle #5421', merchantClean: 'Chipotle', amount: -15.50, category: 'Dining Out', source: 'DEMO' },
  { id: 'demo-26', date: new Date('2024-12-20'), merchantRaw: 'Chipotle #5421', merchantClean: 'Chipotle', amount: -18.00, category: 'Dining Out', source: 'DEMO' },
  { id: 'demo-27', date: new Date('2024-12-25'), merchantRaw: 'The Cheesecake Factory', merchantClean: 'Cheesecake Factory', amount: -85.00, category: 'Dining Out', source: 'DEMO' },
];
