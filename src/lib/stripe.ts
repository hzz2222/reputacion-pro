import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
  typescript: true,
});

export const PLAN = {
  name: 'ReputaciónPro',
  priceId: process.env.STRIPE_PRICE_ID!,
  amount: 3900, // €39.00 en céntimos
  currency: 'eur',
  trialDays: 30,
};
