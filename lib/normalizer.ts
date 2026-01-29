// Cleans merchant names and assigns categories

export interface NormalizedMerchant {
  clean: string;
  category: string;
}

const MERCHANT_PATTERNS: { pattern: RegExp; name: string; category: string }[] = [
  // Streaming
  { pattern: /netflix/i, name: 'Netflix', category: 'Entertainment' },
  { pattern: /spotify/i, name: 'Spotify', category: 'Entertainment' },
  { pattern: /hulu/i, name: 'Hulu', category: 'Entertainment' },
  { pattern: /disney\+?|disneyplus/i, name: 'Disney+', category: 'Entertainment' },
  { pattern: /hbo|max/i, name: 'HBO Max', category: 'Entertainment' },
  { pattern: /prime video|amazon prime/i, name: 'Amazon Prime', category: 'Entertainment' },
  
  // Food
  { pattern: /starbucks/i, name: 'Starbucks', category: 'Dining' },
  { pattern: /chipotle/i, name: 'Chipotle', category: 'Dining' },
  { pattern: /mcdonalds|mcdonald's/i, name: 'McDonalds', category: 'Dining' },
  { pattern: /subway/i, name: 'Subway', category: 'Dining' },
  { pattern: /panera/i, name: 'Panera', category: 'Dining' },
  { pattern: /cheesecake factory/i, name: 'Cheesecake Factory', category: 'Dining' },
  { pattern: /outback/i, name: 'Outback Steakhouse', category: 'Dining' },
  
  // Delivery
  { pattern: /uber\s*eats/i, name: 'Uber Eats', category: 'Food Delivery' },
  { pattern: /doordash/i, name: 'DoorDash', category: 'Food Delivery' },
  { pattern: /grubhub/i, name: 'GrubHub', category: 'Food Delivery' },
  { pattern: /postmates/i, name: 'Postmates', category: 'Food Delivery' },
  
  // Grocery
  { pattern: /safeway/i, name: 'Safeway', category: 'Groceries' },
  { pattern: /whole foods/i, name: 'Whole Foods', category: 'Groceries' },
  { pattern: /trader joe/i, name: 'Trader Joes', category: 'Groceries' },
  { pattern: /kroger/i, name: 'Kroger', category: 'Groceries' },
  
  // Retail
  { pattern: /target/i, name: 'Target', category: 'Shopping' },
  { pattern: /walmart/i, name: 'Walmart', category: 'Shopping' },
  { pattern: /amazon(?!.*prime)/i, name: 'Amazon', category: 'Shopping' },
  { pattern: /costco/i, name: 'Costco', category: 'Shopping' },
  
  // Transport
  { pattern: /uber(?!.*eats)/i, name: 'Uber', category: 'Transportation' },
  { pattern: /lyft/i, name: 'Lyft', category: 'Transportation' },
  
  // Utilities
  { pattern: /direct deposit|employer|payroll/i, name: 'Paycheck', category: 'Income' },
];

export function normalizeMerchant(raw: string): NormalizedMerchant {
  if (!raw || raw.trim() === '') {
    return { clean: 'Unknown Merchant', category: 'Other' };
  }
  
  // Check patterns
  for (const { pattern, name, category } of MERCHANT_PATTERNS) {
    if (pattern.test(raw)) {
      return { clean: name, category };
    }
  }
  
  // Fallback: clean up the raw string
  let cleaned = raw
    .replace(/#\d+/g, '') // Remove store numbers
    .replace(/\d{4,}/g, '') // Remove long numbers
    .replace(/[^a-zA-Z0-9\s]/g, ' ') // Remove special chars
    .replace(/\s+/g, ' ') // Collapse whitespace
    .trim();
  
  // Capitalize first letter of each word
  cleaned = cleaned
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
  
  if (cleaned === '') {
    return { clean: 'Unknown Merchant', category: 'Other' };
  }
  
  return { clean: cleaned, category: 'Other' };
}
