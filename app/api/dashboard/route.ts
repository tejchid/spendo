import { NextResponse } from 'next/server';
import { prisma } from '@/lib/server/prisma';

export async function GET() {
  const transactions = await prisma.transaction.findMany();
  const insights = await prisma.insight.findMany({
    orderBy: { createdAt: 'desc' },
    take: 5,
  });

  return NextResponse.json({ transactions, insights });
}
