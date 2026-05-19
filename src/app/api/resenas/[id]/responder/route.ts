import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  const { id } = await params;
  const { replyText } = await req.json();
  if (!replyText?.trim()) {
    return NextResponse.json({ error: 'La respuesta no puede estar vacía' }, { status: 400 });
  }

  const review = await prisma.review.findFirst({
    where: { id, userId: session.user.id },
  });

  if (!review) {
    return NextResponse.json({ error: 'Reseña no encontrada' }, { status: 404 });
  }

  const updated = await prisma.review.update({
    where: { id },
    data: {
      isReplied: true,
      replyText,
      repliedAt: new Date(),
      isNew: false,
    },
  });

  return NextResponse.json(updated);
}
