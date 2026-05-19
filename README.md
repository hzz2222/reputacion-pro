# ReputaciónPro

Plataforma profesional para gestionar reseñas de Google con IA y solicitar reseñas a clientes automáticamente.

## Stack tecnológico

- **Framework**: Next.js 14 (App Router)
- **Estilos**: Tailwind CSS
- **Base de datos**: Prisma + SQLite (dev) / PostgreSQL (producción)
- **Autenticación**: NextAuth.js
- **Pagos**: Stripe (€39/mes, 30 días gratis)
- **IA**: Anthropic Claude
- **Email**: Nodemailer (SMTP)
- **WhatsApp**: Generación de enlaces wa.me

---

## Instalación y configuración

### 1. Instalar dependencias

```bash
cd reputacion-pro
npm install
```

### 2. Configurar variables de entorno

```bash
cp .env.example .env.local
```

Edita `.env.local` con tus claves:

```env
# Base de datos
DATABASE_URL="file:./dev.db"

# NextAuth (genera con: openssl rand -base64 32)
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="tu-secreto-aqui"

# Stripe (obtén en https://dashboard.stripe.com)
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
STRIPE_PRICE_ID="price_..."

# Anthropic AI (obtén en https://console.anthropic.com)
ANTHROPIC_API_KEY="sk-ant-..."

# Email SMTP (ejemplo con Gmail)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="tu@gmail.com"
SMTP_PASS="tu-contraseña-de-aplicacion"

NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
```

### 3. Configurar base de datos

```bash
npm run db:generate
npm run db:push
```

### 4. Iniciar el servidor de desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000)

---

## Configurar Stripe

1. Ve a [dashboard.stripe.com](https://dashboard.stripe.com)
2. Crea un **Producto**: "ReputaciónPro"
3. Crea un **Precio** recurrente: €39/mes
4. Copia el `price_...` en `STRIPE_PRICE_ID`
5. Para el webhook (local), instala el CLI de Stripe:
   ```bash
   stripe listen --forward-to localhost:3000/api/stripe/webhook
   ```
   Copia el `whsec_...` en `STRIPE_WEBHOOK_SECRET`

---

## Configurar Anthropic (IA)

1. Ve a [console.anthropic.com](https://console.anthropic.com)
2. Crea una API key
3. Cópiala en `ANTHROPIC_API_KEY`

> **Sin API key**: La app funciona con respuestas de fallback predefinidas. Perfecta para probar el flujo completo.

---

## Configurar Email (Gmail)

1. Activa la verificación en 2 pasos en tu cuenta de Google
2. Ve a "Contraseñas de aplicación" en la configuración de seguridad
3. Genera una contraseña para "Correo"
4. Úsala en `SMTP_PASS`

---

## Estructura del proyecto

```
src/
├── app/
│   ├── page.tsx                    # Landing page
│   ├── (auth)/
│   │   ├── login/                  # Inicio de sesión
│   │   └── registro/               # Registro de cuenta
│   ├── (dashboard)/
│   │   ├── dashboard/              # Panel principal
│   │   ├── resenas/                # Gestión de reseñas + IA
│   │   ├── solicitudes/            # Solicitudes de reseña
│   │   └── configuracion/          # Ajustes y suscripción
│   └── api/
│       ├── auth/                   # NextAuth + Registro
│       ├── ai/generar-respuesta/   # Generación IA
│       ├── resenas/                # CRUD reseñas
│       ├── solicitudes/            # Envío de solicitudes
│       ├── stripe/                 # Checkout, Portal, Webhook
│       └── usuario/                # Perfil de usuario
├── components/
│   ├── ui/                         # Button, Badge, Input, Modal...
│   ├── landing/                    # Secciones de la landing
│   └── dashboard/                  # Componentes del panel
├── lib/
│   ├── prisma.ts                   # Cliente Prisma
│   ├── auth.ts                     # Config NextAuth
│   ├── stripe.ts                   # Config Stripe
│   ├── ai.ts                       # Generación IA (Anthropic)
│   ├── email.ts                    # Envío email + WhatsApp
│   └── mockReviews.ts              # Datos demo
└── types/
    └── next-auth.d.ts              # Tipos extendidos
```

---

## Integración con Google My Business (opcional)

La app incluye **datos de demostración** para que puedas ver todas las funcionalidades sin conectar Google.

Para conectar reseñas reales:
1. Activa la **Google My Business API** en Google Cloud Console
2. Configura OAuth 2.0
3. Añade `GOOGLE_CLIENT_ID` y `GOOGLE_CLIENT_SECRET` al `.env.local`
4. Los clientes tendrán que autorizar el acceso a su perfil

---

## Despliegue en producción

### Vercel (recomendado)

```bash
npm i -g vercel
vercel
```

Configura las variables de entorno en el dashboard de Vercel y cambia `DATABASE_URL` a PostgreSQL (p.ej. Supabase, Neon, Railway).

---

## Comandos útiles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Compilar para producción |
| `npm run db:push` | Aplicar schema a la base de datos |
| `npm run db:studio` | Abrir Prisma Studio (GUI de BD) |
| `npm run db:generate` | Regenerar cliente Prisma |
