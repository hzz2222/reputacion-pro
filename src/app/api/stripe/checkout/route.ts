import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { stripe, PLAN } from '@/lib/stripe';

export async function POST() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user) return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });

  let customerId = user.stripeCustomerId;

  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email,
      name: user.name,
      metadata: { userId: user.id, businessName: user.businessName },
    });
    customerId = customer.id;
    await prisma.user.update({ where: { id: user.id }, data: { stripeCustomerId: customerId } });
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  const checkoutSession = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: 'subscription',
    line_items: [{ price: PLAN.priceId, quantity: 1 }],
    subscription_data: {
      trial_period_days: PLAN.trialDays,
      metadata: { userId: user.id },
    },
    success_url: `${baseUrl}/configuracion?success=true`,
    cancel_url: `${baseUrl}/configuracion?canceled=true`,
    allow_promotion_codes: true,
    billing_address_collection: 'required',
  });

  return NextResponse.json({ url: checkoutSession.url });
}
