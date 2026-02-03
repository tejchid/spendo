Spendo - Financial Insights Platform
A privacy-first transaction analysis platform that detects behavioral spending patterns, subscription price increases, and category shifts that traditional banking apps miss.
Features

Subscription Price Creep Detection: Identifies when services quietly increase prices by comparing transaction amounts over time for identical merchants
Velocity Monitor: Detects frequency changes where you spend the same amount but visit more often (spending flat, frequency up)
Category Substitution Tracking: Catches spending shifts between categories that cancel out savings (stopped dining out, but increased grocery delivery)
Anomaly Detection: Flags unusual transactions using z-score and IQR statistical methods
100% Client-Side Processing: All analysis happens in-browser - transaction data never leaves your device

Tech Stack
Frontend:

Next.js 14, TypeScript
TailwindCSS
Recharts (data visualization)
Client-side Web Workers

Planned Backend:

Plaid API (bank account connections)
Supabase (authentication + PostgreSQL)
Vercel (deployment)

Quick Start
bash# Clone the repository
git clone https://github.com/yourusername/spendo-insights.git
cd spendo-insights

# Install dependencies
npm install

# Run development server
npm run dev

# Open http://localhost:3000
Architecture
User uploads CSV
    ↓
Parser extracts transactions
    ↓
Categorizer assigns spending categories (groceries, dining, transport, etc.)
    ↓
Detection Engine runs 4 algorithms:
  1. Price Change Detection (subscription increases)
  2. Frequency Analysis (velocity monitor)
  3. Category Drift (substitution tracking)
  4. Statistical Anomaly Detection (outliers)
    ↓
Insights Dashboard displays:
  - Spending breakdown by category
  - Detected patterns & alerts
  - Trend visualizations
  - Actionable recommendations
System Design

Parser: Handles multiple bank CSV formats, normalizes date/amount fields
Categorizer: Rule-based merchant matching (500+ common merchants mapped to 12 categories)
Detection Engine:

Price Change: Tracks same merchant over time, flags >5% increases
Frequency: Rolling 30-day window, detects >20% visit increases
Category Drift: Identifies inverse correlations (one category up, another down)
Anomalies: Flags transactions >2 standard deviations from mean


Privacy Architecture: Zero server-side storage, all computation in Web Workers

Performance

Processes 1000+ transactions in <500ms
Real-time categorization with instant visual updates
Mobile-responsive with fluid layouts
100% TypeScript for type safety

Future Enhancements

Plaid integration for automatic bank sync (no CSV uploads)
Multi-account support with aggregated insights
Background jobs for daily transaction analysis
Email/push alerts when patterns detected
Spending predictions using historical data
