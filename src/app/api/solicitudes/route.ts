import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { sendReviewRequestEmail, generateWhatsAppLink } from '@/lib/email';
import { z } from 'zod';

const schema = z.object({
  clientName: z.string().min(1),
  clientEmail: z.string().email().optional().or(z.literal('')),
  clientPhone: z.string().optional(),
  channel: z.enum(['email', 'whatsapp']),
  customMessage: z.string().optional(),
});

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  const requests = await prisma.reviewRequest.findMany({
    where: { userId: session.user.id },
    orderBy: { sentAt: 'desc' },
    take: 50,
  });

  return NextResponse.json(requests);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  try {
    const body = await req.json();
    const data = schema.parse(body);

    if (data.channel === 'email' && !data.clientEmail) {
      return NextResponse.json({ error: 'El email es obligatorio para este canal' }, { status: 400 });
    }
    if (data.channel === 'whatsapp' && !data.clientPhone) {
      return NextResponse.json({ error: 'El teléfono es obligatorio para WhatsApp' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { businessName: true, googleReviewUrl: true },
    });

    if (!user) return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });

    const reviewUrl = user.googleReviewUrl || 'https://g.co/kgs/example';

    const request = await prisma.reviewRequest.create({
      data: {
        userId: session.user.id,
        clientName: data.clientName,
        clientEmail: data.clientEmail || null,
        clientPhone: data.clientPhone || null,
        channel: data.channel,
        customMessage: data.customMessage || null,
        status: 'sent',
      },
    });

    let whatsappLink: string | null = null;

    if (data.channel === 'email' && data.clientEmail) {
      try {
        await sendReviewRequestEmail({
          to: data.clientEmail,
          clientName: data.clientName,
          businessName: user.businessName,
          reviewUrl,
          customMessage: data.customMessage,
        });
      } catch (emailErr) {
        console.error('Email send error:', emailErr);
      }
    } else if (data.channel === 'whatsapp' && data.clientPhone) {
      whatsappLink = generateWhatsAppLink(data.clientPhone, user.businessName, reviewUrl, data.customMessage);
    }

    return NextResponse.json({ request, whatsappLink }, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: 'Datos inválidos', details: err.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
