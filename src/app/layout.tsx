import type { Metadata, Viewport } from 'next';
import { Heebo, Rubik } from 'next/font/google';
import { Providers } from '@/components/Providers';
import './globals.css';

const heebo = Heebo({
  subsets: ['hebrew', 'latin'],
  variable: '--font-heebo',
});

const rubik = Rubik({
  subsets: ['hebrew', 'latin'],
  variable: '--font-rubik',
});

export const metadata: Metadata = {
  title: 'Knowledge Collector',
  description: 'אסוף ידע בלחיצה אחת',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Knowledge',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#16a34a',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="he" dir="rtl">
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className={`${heebo.variable} ${rubik.variable} font-sans bg-surface-900 text-surface-50 antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
