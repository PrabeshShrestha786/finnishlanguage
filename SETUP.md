# FinnMate — Complete Setup Guide

> **100% Free Developer Stack** — No credit card needed to run this app

---

## Free Services You Need (Sign Up First)

| Service | Purpose | Free Tier | Sign Up |
|---|---|---|---|
| **Neon** | PostgreSQL database | 0.5GB, always free | neon.tech |
| **Upstash** | Redis cache | 10K requests/day | upstash.com |
| **Groq** | AI (LLaMA 3.3 + Whisper) | 14,400 req/day | console.groq.com |
| **Cloudinary** | Media storage | 25GB, 25GB/month BW | cloudinary.com |
| **Resend** | Email sending | 100/day, 3000/month | resend.com |
| **Vercel** | Frontend hosting | Unlimited hobby | vercel.com |
| **Render** | Backend hosting | 750 hrs/month | render.com |
| **Google OAuth** | Social login | Free | console.cloud.google.com |

---

## Local Development Setup

### 1. Prerequisites

```bash
node --version   # v20+
npm --version    # v10+
git --version
```

### 2. Clone & Install

```bash
cd "d:\My Personal Projects\finnishlanguage"
npm install
```

### 3. Set Up Environment Variables

```bash
# Copy the example file
cp .env.example .env

# Edit .env with your values from the services above
```

### 4. Set Up Neon Database (Free PostgreSQL)

1. Go to [neon.tech](https://neon.tech) → Sign up free
2. Create a new project → name it `finnmate`
3. Copy the **Connection string** (looks like `postgresql://user:pass@ep-xxx.neon.tech/neondb?sslmode=require`)
4. Paste it as `DATABASE_URL` in your `.env`

### 5. Set Up Upstash Redis (Free)

1. Go to [upstash.com](https://upstash.com) → Sign up
2. Create a Redis database → select free tier
3. Copy the **Redis URL** (starts with `rediss://`)
4. Paste it as `REDIS_URL` in your `.env`

### 6. Get Groq API Key (Free AI)

1. Go to [console.groq.com](https://console.groq.com) → Sign up
2. Go to API Keys → Create new key
3. Paste it as `GROQ_API_KEY` in your `.env`

> **Free tier**: 14,400 requests/day, 30 req/min — plenty for development!
> Models available: `llama-3.3-70b-versatile` (chat), `whisper-large-v3` (speech-to-text)

### 7. Set Up Google OAuth (Free)

1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Create new project → Enable "Google+ API"
3. Go to Credentials → Create OAuth 2.0 Client ID
4. Set authorized redirect URI: `http://localhost:3001/api/v1/auth/google/callback`
5. Copy Client ID and Secret to `.env`

### 8. Run Database Migrations

```bash
# Generate Prisma client
cd packages/database
npm run db:generate

# Push schema to Neon
npm run db:migrate
```

### 9. Start Development Servers

```bash
# From root — starts both API and Web simultaneously
npm run dev

# Or separately:
# API (NestJS) → http://localhost:3001
cd apps/api && npm run dev

# Web (Next.js) → http://localhost:3000
cd apps/web && npm run dev
```

---

## Deploy to Production (Free)

### Frontend → Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy from apps/web
cd apps/web
vercel

# Set environment variables in Vercel dashboard:
# NEXT_PUBLIC_API_URL=https://your-api.onrender.com/api/v1
# NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
```

### Backend → Render.com

1. Go to [render.com](https://render.com) → Sign up
2. New Web Service → Connect your GitHub repo
3. Set:
   - Root Directory: `apps/api`
   - Build Command: `npm install && npm run build`
   - Start Command: `npm run start`
4. Add all environment variables from `.env`

> ⚠️ **Free tier note**: Render free tier sleeps after 15 min of inactivity. First request may take 30s to wake up. Upgrade to $7/month starter for always-on.

---

## Stripe Test Mode Setup (Free — No Real Charges)

1. Go to [stripe.com](https://stripe.com) → Create account
2. Stay in **Test Mode** (toggle in dashboard)
3. Copy keys from Developers → API Keys
4. Create products in Stripe dashboard:
   - FinnMate Pro → €9/month recurring
   - FinnMate Premium → €19/month recurring
   - FinnMate Team → €49/month recurring
5. Copy Price IDs to `.env`

**Test card**: `4242 4242 4242 4242` (any future expiry, any CVC)

---

## Architecture Overview

```
finnishlanguage/
├── apps/
│   ├── api/          # NestJS REST API (port 3001)
│   └── web/          # Next.js 14 App Router (port 3000)
├── packages/
│   ├── database/     # Prisma schema + migrations
│   └── shared/       # TypeScript types
├── docker-compose.yml
└── turbo.json
```

## API Endpoints Reference

| Method | Endpoint | Description |
|---|---|---|
| POST | /api/v1/auth/register | Register new user |
| POST | /api/v1/auth/login | Login |
| GET | /api/v1/auth/google | Google OAuth |
| GET | /api/v1/auth/me | Get current user |
| GET | /api/v1/lessons | List lessons |
| GET | /api/v1/lessons/:id | Get lesson |
| POST | /api/v1/lessons/:id/attempt | Submit attempt |
| GET | /api/v1/vocabulary | Get vocabulary |
| POST | /api/v1/vocabulary/review | Flashcard review |
| POST | /api/v1/ai/chat | Chat with FinnMate |
| POST | /api/v1/ai/grammar/correct | Grammar correction |
| POST | /api/v1/ai/translate | Translation |
| POST | /api/v1/ai/tts | Text to speech |
| POST | /api/v1/ai/pronunciation/score | Score pronunciation |
| GET | /api/v1/leaderboard/weekly | Weekly leaderboard |
| POST | /api/v1/payments/checkout | Create Stripe checkout |
| GET | /api/v1/users/dashboard | Dashboard stats |

Swagger docs: `http://localhost:3001/api/docs`

---

## Cost When You Scale

| Users | Monthly Cost |
|---|---|
| 0–1,000 | **€0** (all free tiers) |
| 1,000–5,000 | ~€15–30 (Render starter + Neon pro) |
| 5,000–20,000 | ~€50–100 (scale services) |
| 20,000+ | Move to AWS/dedicated infra |

**Revenue at 1,000 paid users (Pro tier)**: €9,000/month 🚀

---

## Quick Commands

```bash
npm run dev          # Start all services
npm run build        # Build all packages
npm run db:studio    # Open Prisma Studio (DB GUI)
npm run db:migrate   # Run migrations
```
