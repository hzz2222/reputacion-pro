import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  const reviews = await prisma.review.findMany({
    where: { userId: session.user.id },
    orderBy: { publishedAt: 'desc' },
  });

  return NextResponse.json(reviews);
}
