export { default } from 'next-auth/middleware';

export const config = {
  matcher: ['/dashboard/:path*', '/resenas/:path*', '/solicitudes/:path*', '/encuestas/:path*', '/competidores/:path*', '/configuracion/:path*'],
};
