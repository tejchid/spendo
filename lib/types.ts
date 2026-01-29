export interface Transaction {
  id: string;
  date: Date;
  merchantRaw: string;
  merchantClean: string;
  amount: number;
  category: string;
  source: 'DEMO' | 'UPLOAD';
}

export interface Insight {
  type: 'SUBSCRIPTION_PRICE_INCREASE' | 'SPENDING_SPIKE' | 'FREQUENCY_INCREASE' | 'CATEGORY_SHIFT';
  severity: 'high' | 'medium' | 'low';
  message: string;
  detail?: string;
  data: any;
}
