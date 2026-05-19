import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { prisma } from './prisma';

export const authOptions: NextAuthOptions = {
  session: { strategy: 'jwt' },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Contraseña', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email.toLowerCase() },
        });

        if (!user) return null;

        const passwordMatch = await bcrypt.compare(credentials.password, user.passwordHash);
        if (!passwordMatch) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          businessName: user.businessName,
          subscriptionStatus: user.subscriptionStatus,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.businessName = (user as any).businessName;
        token.subscriptionStatus = (user as any).subscriptionStatus;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.businessName = token.businessName as string;
        session.user.subscriptionStatus = token.subscriptionStatus as string;
      }
      return session;
    },
  },
};
