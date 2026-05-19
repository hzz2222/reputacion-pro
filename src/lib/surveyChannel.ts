import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host:   process.env.SMTP_HOST,
  port:   Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth:   { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
});

interface SurveyEmailParams {
  to:           string;
  clientName:   string;
  businessName: string;
  surveyUrl:    string;
  token:        string;
}

export async function sendSurveyEmail({ to, clientName, businessName, surveyUrl, token }: SurveyEmailParams) {
  const positiveUrl = `${surveyUrl}?r=positive`;
  const negativeUrl = `${surveyUrl}?r=negative`;

  const html = `
<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="font-family:Arial,sans-serif;background:#f4f4f5;padding:40px 0;margin:0">
  <div style="max-width:520px;margin:0 auto;background:white;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08)">
    <div style="background:linear-gradient(135deg,#4f46e5,#7c3aed);padding:36px 32px;text-align:center">
      <div style="width:56px;height:56px;background:rgba(255,255,255,0.15);border-radius:14px;margin:0 auto 16px;display:flex;align-items:center;justify-content:center;font-size:28px;line-height:56px">⭐</div>
      <h1 style="color:white;margin:0;font-size:22px;font-weight:800">¿Cómo fue tu experiencia?</h1>
      <p style="color:rgba(255,255,255,0.7);margin:8px 0 0;font-size:14px">${businessName}</p>
    </div>
    <div style="padding:36px 32px">
      <p style="color:#374151;font-size:16px;line-height:1.6;margin:0 0 28px">
        Hola <strong>${clientName}</strong>, gracias por confiar en <strong>${businessName}</strong>.<br>
        Tu opinión nos ayuda a mejorar. Solo tarda 10 segundos:
      </p>
      <table style="width:100%;border-collapse:separate;border-spacing:12px 0">
        <tr>
          <td style="width:50%">
            <a href="${positiveUrl}" style="display:block;text-align:center;background:#059669;color:white;text-decoration:none;padding:18px 12px;border-radius:14px;font-size:15px;font-weight:700;line-height:1.3">
              😊<br>¡Fue genial!
            </a>
          </td>
          <td style="width:50%">
            <a href="${negativeUrl}" style="display:block;text-align:center;background:#6b7280;color:white;text-decoration:none;padding:18px 12px;border-radius:14px;font-size:15px;font-weight:700;line-height:1.3">
              😕<br>Puede mejorar
            </a>
          </td>
        </tr>
      </table>
      <p style="color:#9ca3af;font-size:12px;text-align:center;margin:24px 0 0">
        O abre la encuesta aquí: <a href="${surveyUrl}" style="color:#6366f1">${surveyUrl}</a>
      </p>
    </div>
    <div style="background:#f9fafb;padding:16px 32px;text-align:center;border-top:1px solid #e5e7eb">
      <p style="color:#9ca3af;font-size:12px;margin:0">Enviado por ${businessName} · Tu opinión es confidencial</p>
    </div>
  </div>
</body>
</html>`;

  await transporter.sendMail({
    from:    process.env.SMTP_FROM || `"${businessName}" <noreply@example.com>`,
    to,
    subject: `¿Cómo fue tu experiencia en ${businessName}?`,
    text:    `Hola ${clientName}, ¿cómo fue tu experiencia en ${businessName}? Dinos aquí: ${surveyUrl}`,
    html,
  });
}

export function generateSurveyWhatsAppLink(phone: string, businessName: string, surveyUrl: string): string {
  const msg = `Hola 👋 Gracias por tu visita en *${businessName}*.\n\n¿Cómo fue tu experiencia? Dinos en un clic 👇\n${surveyUrl}\n\n_Solo tarda 10 segundos. ¡Gracias!_`;
  const clean = phone.replace(/\D/g, '');
  return `https://wa.me/${clean}?text=${encodeURIComponent(msg)}`;
}
