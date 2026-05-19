import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { sendSurveyEmail, generateSurveyWhatsAppLink } from '@/lib/surveyChannel';
import { z } from 'zod';

const schema = z.object({
  clientName:  z.string().min(1),
  clientEmail: z.string().email().optional().or(z.literal('')),
  clientPhone: z.string().optional(),
  channel:     z.enum(['email', 'whatsapp']),
});

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  const surveys = await prisma.survey.findMany({
    where: { userId: session.user.id },
    orderBy: { sentAt: 'desc' },
    take: 100,
  });

  return NextResponse.json(surveys);
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

    const survey = await prisma.survey.create({
      data: {
        userId:      session.user.id,
        clientName:  data.clientName,
        clientEmail: data.clientEmail || null,
        clientPhone: data.clientPhone || null,
        channel:     data.channel,
      },
    });

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const surveyUrl = `${appUrl}/encuesta/${survey.token}`;
    let whatsappLink: string | null = null;

    if (data.channel === 'email' && data.clientEmail) {
      try {
        await sendSurveyEmail({
          to:           data.clientEmail,
          clientName:   data.clientName,
          businessName: user.businessName,
          surveyUrl,
          token:        survey.token,
        });
      } catch (err) {
        console.error('Survey email error:', err);
      }
    } else if (data.channel === 'whatsapp' && data.clientPhone) {
      whatsappLink = generateSurveyWhatsAppLink(data.clientPhone, user.businessName, surveyUrl);
    }

    return NextResponse.json({ survey, whatsappLink }, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: 'Datos inválidos' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
