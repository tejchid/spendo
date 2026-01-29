import { Transaction } from './types';

export type DemoScenarioKey = 'subscription_hike' | 'behavioral_spike' | 'frequency_creep' | 'loyalty_shift';

export const DEMO_SCENARIOS: Record<DemoScenarioKey, Transaction[]> = {
  subscription_hike: [
    { id: 'demo-1', date: new Date('2024-01-05'), merchantRaw: 'Netflix.com', merchantClean: 'Netflix', amount: -15.99, category: 'Entertainment', source: 'DEMO' },
    { id: 'demo-2', date: new Date('2024-02-05'), merchantRaw: 'Netflix.com', merchantClean: 'Netflix', amount: -15.99, category: 'Entertainment', source: 'DEMO' },
    { id: 'demo-3', date: new Date('2024-03-05'), merchantRaw: 'Netflix.com', merchantClean: 'Netflix', amount: -22.99, category: 'Entertainment', source: 'DEMO' },
  ],
  behavioral_spike: [
    { id: 'demo-4', date: new Date('2024-01-10'), merchantRaw: 'Starbucks', merchantClean: 'Starbucks', amount: -6.50, category: 'Dining', source: 'DEMO' },
    { id: 'demo-5', date: new Date('2024-01-15'), merchantRaw: 'Starbucks', merchantClean: 'Starbucks', amount: -7.25, category: 'Dining', source: 'DEMO' },
    { id: 'demo-6', date: new Date('2024-01-20'), merchantRaw: 'Starbucks', merchantClean: 'Starbucks', amount: -85.00, category: 'Dining', source: 'DEMO' },
  ],
  frequency_creep: [
    { id: 'demo-7', date: new Date('2024-01-05'), merchantRaw: 'Uber Eats', merchantClean: 'Uber Eats', amount: -28.00, category: 'Food Delivery', source: 'DEMO' },
    { id: 'demo-8', date: new Date('2024-01-08'), merchantRaw: 'Uber Eats', merchantClean: 'Uber Eats', amount: -32.00, category: 'Food Delivery', source: 'DEMO' },
    { id: 'demo-9', date: new Date('2024-01-10'), merchantRaw: 'Uber Eats', merchantClean: 'Uber Eats', amount: -26.00, category: 'Food Delivery', source: 'DEMO' },
    { id: 'demo-10', date: new Date('2024-01-12'), merchantRaw: 'Uber Eats', merchantClean: 'Uber Eats', amount: -35.00, category: 'Food Delivery', source: 'DEMO' },
  ],
  loyalty_shift: [
    { id: 'demo-15', date: new Date('2024-01-05'), merchantRaw: 'Safeway', merchantClean: 'Safeway', amount: -120.00, category: 'Groceries', source: 'DEMO' },
    { id: 'demo-16', date: new Date('2024-01-12'), merchantRaw: 'Target', merchantClean: 'Target', amount: -45.00, category: 'Shopping', source: 'DEMO' },
    { id: 'demo-17', date: new Date('2024-01-19'), merchantRaw: 'Safeway', merchantClean: 'Safeway', amount: -35.00, category: 'Groceries', source: 'DEMO' },
    { id: 'demo-18', date: new Date('2024-01-26'), merchantRaw: 'Target', merchantClean: 'Target', amount: -125.00, category: 'Shopping', source: 'DEMO' },
  ],
};