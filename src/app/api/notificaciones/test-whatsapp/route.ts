import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { sendWhatsAppNotification } from '@/lib/whatsapp';

export async function POST() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { whatsappNumber: true, businessName: true },
  });

  if (!user?.whatsappNumber) {
    return NextResponse.json({ error: 'Introduce un número de WhatsApp primero' }, { status: 400 });
  }

  const result = await sendWhatsAppNotification(user.whatsappNumber, {
    businessName: user.businessName,
    authorName: 'Cliente de prueba',
    rating: 5,
    text: 'Esta es una notificación de prueba de ReputaciónPro. ¡Todo funciona correctamente!',
  });

  if (!result.ok) {
    const isMissingConfig = result.error === 'Twilio no configurado';
    return NextResponse.json(
      { error: result.error || 'Error al enviar', code: isMissingConfig ? 'TWILIO_NOT_CONFIGURED' : undefined },
      { status: isMissingConfig ? 503 : 500 },
    );
  }

  return NextResponse.json({ ok: true });
}
