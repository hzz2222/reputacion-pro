import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

interface SendReviewRequestParams {
  to: string;
  clientName: string;
  businessName: string;
  reviewUrl: string;
  customMessage?: string;
}

export async function sendReviewRequestEmail(params: SendReviewRequestParams) {
  const { to, clientName, businessName, reviewUrl, customMessage } = params;

  const defaultMessage = `Hola ${clientName},\n\nEsperamos que hayas quedado satisfecho/a con tu visita a ${businessName}. Tu opinión es muy importante para nosotros y nos ayudaría mucho si pudieras dedicar un momento a dejarnos tu reseña en Google.\n\nTan solo necesitas hacer clic en el enlace de abajo.\n\nMuchas gracias por tu confianza.`;

  const messageText = customMessage || defaultMessage;

  const html = `
<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"></head>
<body style="font-family: Arial, sans-serif; background: #f4f4f5; padding: 40px 0;">
  <div style="max-width: 560px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08);">
    <div style="background: linear-gradient(135deg, #4f46e5, #7c3aed); padding: 32px; text-align: center;">
      <h1 style="color: white; margin: 0; font-size: 22px;">⭐ Cuéntanos tu experiencia</h1>
    </div>
    <div style="padding: 32px;">
      <p style="color: #374151; font-size: 16px; line-height: 1.6; white-space: pre-line;">${messageText}</p>
      <div style="text-align: center; margin: 32px 0;">
        <a href="${reviewUrl}" style="display: inline-block; background: linear-gradient(135deg, #4f46e5, #7c3aed); color: white; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-size: 16px; font-weight: 600;">
          ⭐ Dejar mi reseña en Google
        </a>
      </div>
      <p style="color: #9ca3af; font-size: 13px; text-align: center; margin: 0;">Solo tarda 2 minutos · Gracias por tu tiempo</p>
    </div>
    <div style="background: #f9fafb; padding: 16px; text-align: center;">
      <p style="color: #9ca3af; font-size: 12px; margin: 0;">Enviado por ${businessName} · Si no deseas recibir más correos, <a href="#" style="color: #6b7280;">cancela la suscripción</a></p>
    </div>
  </div>
</body>
</html>`;

  await transporter.sendMail({
    from: process.env.SMTP_FROM || `"${businessName}" <noreply@example.com>`,
    to,
    subject: `⭐ ${clientName}, ¿cómo fue tu experiencia en ${businessName}?`,
    text: messageText + `\n\nDeja tu reseña aquí: ${reviewUrl}`,
    html,
  });
}

export function generateWhatsAppLink(phone: string, businessName: string, reviewUrl: string, customMessage?: string): string {
  const defaultMsg = `¡Hola! 👋 Gracias por visitarnos en *${businessName}*. ¿Podrías dejarnos una reseña en Google? Solo tarda 2 minutos y nos ayuda mucho. 🙏\n\n👉 ${reviewUrl}`;
  const message = customMessage || defaultMsg;
  const cleanPhone = phone.replace(/\D/g, '');
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}
