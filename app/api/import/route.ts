export const runtime = "nodejs";

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/server/prisma';
import { parseCSV } from '@/lib/ingestor';
import { generateRealInsights } from '@/lib/insights-engine';

export async function POST(req: Request) {
  const { csvText } = await req.json();

  const transactions = parseCSV(csvText);

  await prisma.transaction.createMany({
    data: transactions.map(tx => ({
      date: tx.date,
      merchantRaw: tx.merchantRaw,
      merchantClean: tx.merchantClean,
      amount: tx.amount,
      category: tx.category,
      source: 'upload',
    })),
  });

  const insights = generateRealInsights(transactions);

  await prisma.insight.createMany({
    data: insights.map(i => ({
      type: i.type,
      message: i.message,
      month: i.month,
    })),
  });

  return NextResponse.json({ ok: true });
}
