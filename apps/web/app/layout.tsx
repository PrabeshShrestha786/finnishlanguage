import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Providers } from './providers';

export const metadata: Metadata = {
  title: { default: 'FinnMate — Learn Finnish with AI', template: '%s | FinnMate' },
  description: 'Master Finnish from A1 to C2 with AI-powered lessons, real conversations, pronunciation coaching, and YKI exam prep. The world\'s most engaging Finnish learning platform.',
  keywords: ['learn Finnish', 'Finnish language', 'suomi', 'YKI exam', 'Finnish online', 'AI language tutor'],
  authors: [{ name: 'FinnMate' }],
  creator: 'FinnMate',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://finnmate.app',
    siteName: 'FinnMate',
    title: 'FinnMate — Learn Finnish with AI',
    description: 'Master Finnish from A1 to C2 with AI-powered personalized lessons.',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FinnMate — Learn Finnish with AI',
    description: 'Master Finnish from A1 to C2 with AI-powered personalized lessons.',
  },
  robots: { index: true, follow: true },
  manifest: '/manifest.json',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0a0e1a',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
