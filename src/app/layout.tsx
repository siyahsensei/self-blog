import type { Metadata } from 'next';
import { Roboto_Slab, Open_Sans, Fira_Code } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';

const robotoSlab = Roboto_Slab({
  subsets: ['latin'],
  variable: '--font-heading',
  display: 'swap',
});

const openSans = Open_Sans({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
});

const firaCode = Fira_Code({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://blog.siyahsensei.com'),
  title: {
    default: 'Siyah Sensei Blog',
    template: '%s | Siyah Sensei Blog',
  },
  description: 'Technical tutorials on Software Engineering, Next.js, and Systems Architecture.',
  openGraph: {
    title: 'Siyah Sensei Blog',
    description: 'Technical tutorials on Software Engineering, Next.js, and Systems Architecture.',
    url: 'https://blog.siyahsensei.com',
    siteName: 'Siyah Sensei Blog',
    locale: 'en_US',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${robotoSlab.variable} ${openSans.variable} ${firaCode.variable}`}>
        <Header />
        <main>
          {children}
        </main>
      </body>
    </html>
  );
}
