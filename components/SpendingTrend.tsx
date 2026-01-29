'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface SpendingPoint {
  date: string;
  amount: number;
}

interface SpendingTrendProps {
  data: SpendingPoint[];
}

export default function SpendingTrend({ data }: SpendingTrendProps) {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis
            tickFormatter={(value?: number) =>
              value != null ? `$${value.toFixed(0)}` : ''
            }
          />
          <Tooltip
            formatter={(value?: number) =>
              value != null ? [`$${value.toFixed(2)}`, 'Spent'] : ['', 'Spent']
            }
          />
          <Line
            type="monotone"
            dataKey="amount"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
