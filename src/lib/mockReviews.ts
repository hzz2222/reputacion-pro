export interface MockReview {
  id: string;
  googleReviewId: string;
  authorName: string;
  authorInitials: string;
  rating: number;
  text: string;
  publishedAt: string;
  isReplied: boolean;
  replyText: string | null;
  repliedAt: string | null;
  isNew: boolean;
  authorReviewCount?: number;
  authorAccountAgeDays?: number;
}

export const MOCK_REVIEWS: MockReview[] = [
  {
    id: 'mock-1',
    googleReviewId: 'g-1',
    authorName: 'María García',
    authorInitials: 'MG',
    rating: 5,
    text: 'Increíble servicio, volveré sin duda. El personal fue muy amable y la calidad del producto superó mis expectativas. Totalmente recomendado para cualquiera que busque lo mejor.',
    publishedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    isReplied: false,
    replyText: null,
    repliedAt: null,
    isNew: true,
  },
  {
    id: 'mock-2',
    googleReviewId: 'g-2',
    authorName: 'Carlos Martínez',
    authorInitials: 'CM',
    rating: 4,
    text: 'Muy buen servicio en general. Solo faltó un poco más de rapidez en la atención, pero el resultado final fue excelente. Volvería.',
    publishedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    isReplied: false,
    replyText: null,
    repliedAt: null,
    isNew: true,
  },
  {
    id: 'mock-3',
    googleReviewId: 'g-3',
    authorName: 'Ana López',
    authorInitials: 'AL',
    rating: 2,
    text: 'Tuve una mala experiencia. El producto no cumplió con lo prometido y el servicio al cliente no fue nada satisfactorio. Esperaba mucho más.',
    publishedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    isReplied: false,
    replyText: null,
    repliedAt: null,
    isNew: false,
  },
  {
    id: 'mock-4',
    googleReviewId: 'g-4',
    authorName: 'Pedro Sánchez',
    authorInitials: 'PS',
    rating: 5,
    text: 'Excelente atención desde el primer momento. El equipo es muy profesional y saben exactamente lo que hacen. ¡El mejor en la zona sin ninguna duda!',
    publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    isReplied: true,
    replyText: 'Muchas gracias Pedro por tus palabras tan amables. Es un placer atenderte y nos alegra mucho que hayas quedado satisfecho. ¡Te esperamos pronto!',
    repliedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    isNew: false,
  },
  {
    id: 'mock-5',
    googleReviewId: 'g-5',
    authorName: 'Laura Fernández',
    authorInitials: 'LF',
    rating: 3,
    text: 'El servicio es correcto pero no destaca especialmente. Las instalaciones podrían estar más limpias y los precios son algo elevados para lo que ofrecen.',
    publishedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    isReplied: false,
    replyText: null,
    repliedAt: null,
    isNew: false,
  },
  {
    id: 'mock-6',
    googleReviewId: 'g-6',
    authorName: 'Juan Ramírez',
    authorInitials: 'JR',
    rating: 5,
    text: '¡Fantástico! La mejor experiencia que he tenido. El personal fue extremadamente atento y el resultado superó todas mis expectativas. 100% recomendable.',
    publishedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    isReplied: true,
    replyText: 'Juan, ¡muchas gracias por tu valoración! Nos llena de alegría saber que tu experiencia fue tan positiva. ¡Esperamos verte de nuevo pronto!',
    repliedAt: new Date(Date.now() - 13 * 24 * 60 * 60 * 1000).toISOString(),
    isNew: false,
  },
  // Reseñas sospechosas — avalancha de negativas el mismo día + señales de cuenta nueva
  {
    id: 'mock-7',
    googleReviewId: 'g-7',
    authorName: 'R. Anónimo',
    authorInitials: 'RA',
    rating: 1,
    text: 'Pésimo.',
    publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    isReplied: false,
    replyText: null,
    repliedAt: null,
    isNew: true,
    authorReviewCount: 1,
    authorAccountAgeDays: 3,
  },
  {
    id: 'mock-8',
    googleReviewId: 'g-8',
    authorName: 'Usuario Google',
    authorInitials: 'UG',
    rating: 1,
    text: 'No recomendaría este negocio.',
    publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    isReplied: false,
    replyText: null,
    repliedAt: null,
    isNew: true,
    authorReviewCount: 1,
  },
  {
    id: 'mock-9',
    googleReviewId: 'g-9',
    authorName: 'Cliente Nuevo',
    authorInitials: 'CN',
    rating: 5,
    text: 'Muy bueno.',
    publishedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    isReplied: false,
    replyText: null,
    repliedAt: null,
    isNew: false,
    authorReviewCount: 1,
    authorAccountAgeDays: 5,
  },
];
