export default () => ({
  port: parseInt(process.env.API_PORT || '3001', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  database: { url: process.env.DATABASE_URL },
  redis: { url: process.env.REDIS_URL || 'redis://localhost:6379' },
  jwt: {
    secret: process.env.JWT_SECRET || 'dev-secret',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'dev-refresh-secret',
    expiresIn: process.env.JWT_EXPIRES_IN || '15m',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  },
  oauth: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackUrl: process.env.GOOGLE_CALLBACK_URL,
    },
  },
  // Groq — free AI tier (groq.com)
  groq: {
    apiKey: process.env.GROQ_API_KEY,
    model: process.env.GROQ_MODEL || 'llama-3.3-70b-versatile',
    whisperModel: process.env.GROQ_WHISPER_MODEL || 'whisper-large-v3',
  },
  // Google Cloud TTS — Finnish WaveNet voice (console.cloud.google.com)
  google: {
    ttsApiKey: process.env.GOOGLE_TTS_API_KEY,
    ttsVoice: process.env.GOOGLE_TTS_VOICE || 'fi-FI-Wavenet-A',
  },
  // Cloudinary — free storage (cloudinary.com)
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET,
  },
  // Stripe — test mode (free)
  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY,
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
    proPriceId: process.env.STRIPE_PRO_PRICE_ID,
    premiumPriceId: process.env.STRIPE_PREMIUM_PRICE_ID,
    teamPriceId: process.env.STRIPE_TEAM_PRICE_ID,
  },
  // Resend — free email (resend.com)
  email: {
    resendApiKey: process.env.RESEND_API_KEY,
    from: process.env.EMAIL_FROM || 'FinnMate <noreply@finnmate.app>',
  },
  app: {
    url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1',
  },
});
