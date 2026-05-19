export interface WhatsAppReviewPayload {
  businessName: string;
  authorName: string;
  rating: number;
  text: string;
  reviewId?: string;
}

function buildMessage(businessName: string, authorName: string, rating: number, text: string): string {
  const stars = '⭐'.repeat(rating);
  const preview = text.length > 100 ? text.slice(0, 100) + '…' : text;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  return (
    `🔔 *Nueva reseña en ${businessName}*\n\n` +
    `${stars} (${rating}/5) — *${authorName}*\n` +
    `"${preview}"\n\n` +
    `Responde ahora: ${appUrl}/resenas`
  );
}

export async function sendWhatsAppNotification(
  to: string,
  payload: WhatsAppReviewPayload,
): Promise<{ ok: boolean; error?: string }> {
  const sid   = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  const from  = process.env.TWILIO_WHATSAPP_FROM || 'whatsapp:+14155238886';

  if (!sid || !token) {
    return { ok: false, error: 'Twilio no configurado' };
  }

  const toFormatted = `whatsapp:${to.startsWith('+') ? to : '+' + to}`;
  const body = buildMessage(payload.businessName, payload.authorName, payload.rating, payload.text);

  const res = await fetch(
    `https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`,
    {
      method: 'POST',
      headers: {
        Authorization: 'Basic ' + Buffer.from(`${sid}:${token}`).toString('base64'),
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({ From: from, To: toFormatted, Body: body }).toString(),
    },
  );

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    return { ok: false, error: (err as { message?: string }).message || `HTTP ${res.status}` };
  }

  return { ok: true };
}
