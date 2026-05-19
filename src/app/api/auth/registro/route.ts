import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  businessName: z.string().min(2),
  businessType: z.string().default('Negocio local'),
  password: z.string().min(8),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = schema.parse(body);

    const existing = await prisma.user.findUnique({ where: { email: data.email.toLowerCase() } });
    if (existing) {
      return NextResponse.json({ error: 'Ya existe una cuenta con este email' }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(data.password, 12);
    const trialEndsAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email.toLowerCase(),
        businessName: data.businessName,
        businessType: data.businessType,
        passwordHash,
        subscriptionStatus: 'trialing',
        trialEndsAt,
      },
    });

    return NextResponse.json({ id: user.id, email: user.email }, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: 'Datos inválidos', details: err.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
