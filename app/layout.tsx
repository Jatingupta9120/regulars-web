import type { Metadata, Viewport } from 'next';
import { Archivo, Source_Serif_4 } from 'next/font/google';
import Script from 'next/script';
import { brand } from '@/lib/brand';
import { VARIANT_BOOT_SCRIPT } from '@/lib/experiments';
import './globals.css';

const display = Archivo({
  subsets: ['latin'],
  weight: ['500', '600', '700', '800'],
  variable: '--font-display',
  display: 'swap',
});

const text = Source_Serif_4({
  subsets: ['latin'],
  weight: ['400', '600'],
  style: ['normal', 'italic'],
  variable: '--font-text',
  display: 'swap',
});

export const metadata: Metadata = {
  title: `${brand.name} — six people, four weeks, one group chat`,
  description:
    'A New York service that forms small recurring friend groups. Six ID-verified people matched by neighborhood and age, meeting four Thursdays around a real activity. One charge, no subscription.',
  openGraph: {
    title: brand.name,
    description: 'Six people. Four Thursdays. One group chat that outlives us.',
    locale: 'en_US',
    type: 'website',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }): JSX.Element {
  const plausibleDomain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;

  return (
    <html lang="en" className={`${display.variable} ${text.variable}`}>
      <head>
        {/* Blocking and tiny. Chooses the A/B variants before the first paint. */}
        <script dangerouslySetInnerHTML={{ __html: VARIANT_BOOT_SCRIPT }} />
      </head>
      <body>
        {children}
        {plausibleDomain ? (
          <Script
            defer
            data-domain={plausibleDomain}
            src="https://plausible.io/js/script.tagged-events.js"
            strategy="afterInteractive"
          />
        ) : null}
      </body>
    </html>
  );
}
