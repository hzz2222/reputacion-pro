import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;

  const survey = await prisma.survey.findUnique({
    where: { token },
    include: { user: { select: { businessName: true, googleReviewUrl: true } } },
  });

  if (!survey) return NextResponse.json({ error: 'Encuesta no encontrada' }, { status: 404 });

  return NextResponse.json({
    clientName:      survey.clientName,
    businessName:    survey.user.businessName,
    googleReviewUrl: survey.user.googleReviewUrl,
    status:          survey.status,
  });
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;

  const survey = await prisma.survey.findUnique({ where: { token } });
  if (!survey) return NextResponse.json({ error: 'Encuesta no encontrada' }, { status: 404 });

  if (survey.status !== 'pending') {
    return NextResponse.json({ error: 'Esta encuesta ya fue respondida' }, { status: 409 });
  }

  const { response, feedbackText } = await req.json();
  if (response !== 'positive' && response !== 'negative') {
    return NextResponse.json({ error: 'Respuesta inválida' }, { status: 400 });
  }

  await prisma.survey.update({
    where: { token },
    data: {
      status:      response,
      feedbackText: response === 'negative' ? (feedbackText?.trim() || null) : null,
      respondedAt:  new Date(),
    },
  });

  if (response === 'positive') {
    const user = await prisma.user.findUnique({
      where: { id: survey.userId },
      select: { googleReviewUrl: true },
    });
    return NextResponse.json({ googleReviewUrl: user?.googleReviewUrl });
  }

  return NextResponse.json({ ok: true });
}
