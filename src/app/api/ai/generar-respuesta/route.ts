import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { generateReviewReply } from '@/lib/ai';

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  try {
    const { reviewId, authorName, rating, text } = await req.json();

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { businessName: true, businessType: true, aiTone: true },
    });

    if (!user) return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });

    if (!process.env.ANTHROPIC_API_KEY) {
      const fallback = generateFallbackReply(authorName, rating, user.businessName);
      return NextResponse.json({ reply: fallback });
    }

    const reply = await generateReviewReply({
      businessName: user.businessName,
      businessType: user.businessType,
      aiTone: user.aiTone,
      authorName,
      rating,
      reviewText: text,
    });

    return NextResponse.json({ reply });
  } catch (err: any) {
    console.error('AI error:', err);
    return NextResponse.json({ error: 'Error al generar la respuesta. Inténtalo de nuevo.' }, { status: 500 });
  }
}

function generateFallbackReply(authorName: string, rating: number, businessName: string): string {
  if (rating <= 2) {
    return `${authorName}, lamentamos profundamente que tu experiencia en ${businessName} no haya estado a la altura. No es el nivel de servicio que queremos ofrecer y lo sentimos de verdad. Por favor, contáctanos directamente para que podamos resolver lo ocurrido y darte la atención que mereces. Queremos tener la oportunidad de compensarte.`;
  } else if (rating === 3) {
    return `Gracias por tomarte el tiempo de valorarnos, ${authorName}. En ${businessName} siempre buscamos mejorar y nos gustaría saber qué podríamos haber hecho mejor para que tu experiencia fuera excelente. No dudes en contactarnos. ¡Esperamos verte pronto!`;
  } else {
    return `¡Muchas gracias por tu reseña, ${authorName}! Nos alegra mucho saber que tu experiencia en ${businessName} fue positiva. Tu opinión nos motiva a seguir mejorando cada día. ¡Esperamos verte pronto de nuevo!`;
  }
}
