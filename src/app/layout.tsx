import type { Metadata } from 'next';
import { Roboto_Slab, Open_Sans, Fira_Code } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import Header from '@/components/Header';

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

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
      <head>
        <link
          rel="alternate"
          type="application/rss+xml"
          title="Siyah Sensei Blog RSS Feed"
          href="/feed.xml"
        />
        {/* Google Analytics 4 */}
        {GA_MEASUREMENT_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_MEASUREMENT_ID}');
              `}
            </Script>
          </>
        )}
      </head>
      <body className={`${robotoSlab.variable} ${openSans.variable} ${firaCode.variable}`}>
        <Header />
        <main>
          {children}
        </main>
      </body>
    </html>
  );
}
