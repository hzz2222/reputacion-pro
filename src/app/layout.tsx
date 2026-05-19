import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from './providers';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'ReputaciónPro — Gestiona tus reseñas con IA',
  description:
    'Gestiona todas tus reseñas de Google, responde automáticamente con IA y solicita reseñas a tus clientes. Primer mes gratis.',
  keywords: 'reseñas google, gestión reputación online, respuesta automática reseñas, IA reseñas',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={inter.variable}>
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
