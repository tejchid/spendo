export interface Transaction {
  id: string;
  date: Date;
  merchantRaw: string;
  merchantClean: string;
  amount: number;
  category: string;
  source: 'DEMO' | 'UPLOAD';
}

export type InsightType =
  | 'SUBSCRIPTION_PRICE_INCREASE'
  | 'SPENDING_SPIKE'
  | 'FREQUENCY_INCREASE'
  | 'CATEGORY_SHIFT';

export interface Insight {
  type: InsightType;
  severity: 'high' | 'medium' | 'low';
  message: string;
  detail?: string;
  data: any;
  requiresConfirmation?: boolean;
  confirmationPrompt?: string;
}
