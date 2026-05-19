import 'next-auth';
import 'next-auth/jwt';

declare module 'next-auth' {
  interface User {
    id: string;
    businessName: string;
    subscriptionStatus: string;
  }
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      businessName: string;
      subscriptionStatus: string;
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    businessName: string;
    subscriptionStatus: string;
  }
}
