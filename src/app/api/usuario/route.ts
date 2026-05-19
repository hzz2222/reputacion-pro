import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      businessName: true,
      businessType: true,
      googleReviewUrl: true,
      notificationEmail: true,
      whatsappNumber: true,
      whatsappEnabled: true,
      aiTone: true,
      subscriptionStatus: true,
      trialEndsAt: true,
      currentPeriodEnd: true,
    },
  });

  if (!user) return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
  return NextResponse.json(user);
}

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  const { businessName, businessType, googleReviewUrl, notificationEmail, aiTone, whatsappNumber, whatsappEnabled } = await req.json();

  const updated = await prisma.user.update({
    where: { id: session.user.id },
    data: {
      ...(businessName && { businessName }),
      ...(businessType && { businessType }),
      ...(googleReviewUrl !== undefined && { googleReviewUrl }),
      ...(notificationEmail && { notificationEmail }),
      ...(aiTone && { aiTone }),
      ...(whatsappNumber !== undefined && { whatsappNumber: whatsappNumber || null }),
      ...(whatsappEnabled !== undefined && { whatsappEnabled }),
    },
  });

  return NextResponse.json({ ok: true, businessName: updated.businessName });
}
