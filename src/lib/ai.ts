import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

interface GenerateReplyParams {
  businessName: string;
  businessType: string;
  aiTone: string;
  authorName: string;
  rating: number;
  reviewText: string;
}

export async function generateReviewReply(params: GenerateReplyParams): Promise<string> {
  const { businessName, businessType, aiTone, authorName, rating, reviewText } = params;

  const prompt = rating <= 2
    ? buildNegativePrompt({ businessName, businessType, aiTone, authorName, rating, reviewText })
    : buildPositivePrompt({ businessName, businessType, aiTone, authorName, rating, reviewText });

  const message = await client.messages.create({
    model: 'claude-opus-4-7',
    max_tokens: 300,
    messages: [{ role: 'user', content: prompt }],
  });

  const content = message.content[0];
  if (content.type !== 'text') throw new Error('Respuesta inesperada de la IA');

  return content.text.trim();
}

function buildNegativePrompt(p: GenerateReplyParams): string {
  const stars = '⭐'.repeat(p.rating);
  return `Eres el responsable de atención al cliente de "${p.businessName}", un negocio de tipo "${p.businessType}".

${p.authorName} ha dejado esta reseña negativa en Google:
Calificación: ${stars} (${p.rating}/5)
Reseña: "${p.reviewText}"

Genera UNA respuesta en español siguiendo ESTRICTAMENTE estas instrucciones:

TONO: Empático, humilde y resolutivo. Deja a un lado el tono habitual del negocio (${p.aiTone}) — en reseñas de 1-2 estrellas la prioridad absoluta es la empatía y las disculpas sinceras.

ESTRUCTURA OBLIGATORIA:
1. Disculpa sincera y directa por la mala experiencia — no la minimices ni la justifiques
2. Reconoce el problema concreto que menciona ${p.authorName} (no seas genérico)
3. Ofrece una solución específica o siguiente paso claro (contacto directo, reembolso, revisión, etc.)
4. Cierra con compromiso de mejora y una invitación a contactar o volver a darles la oportunidad

REGLAS:
- Máximo 130 palabras
- Menciona el nombre ${p.authorName} al inicio
- Nunca digas "Estimado/a cliente" ni frases corporativas vacías
- No pongas excusas ni culpes a factores externos
- Escribe SOLO el texto de la respuesta, sin explicaciones adicionales`;
}

function buildPositivePrompt(p: GenerateReplyParams): string {
  const stars = '⭐'.repeat(p.rating);
  const sentiment = p.rating === 3 ? 'neutral (3 estrellas)' : 'positiva';
  return `Eres el responsable de atención al cliente de "${p.businessName}", un negocio de tipo "${p.businessType}".

${p.authorName} ha dejado esta reseña en Google:
Calificación: ${stars} (${p.rating}/5) — Reseña ${sentiment}
Reseña: "${p.reviewText}"

Genera UNA respuesta en español siguiendo estas instrucciones:
- Tono: ${p.aiTone}
- Máximo 120 palabras
- Menciona el nombre ${p.authorName}
- Agradece sinceramente y refuerza los puntos concretos que menciona
- Si es neutral (3 estrellas): agradece pero también pregunta qué podría haber sido mejor
- Termina invitando al cliente a volver
- NO uses "Estimado/a cliente" ni frases genéricas
- Escribe SOLO el texto de la respuesta, sin explicaciones adicionales`;
}
