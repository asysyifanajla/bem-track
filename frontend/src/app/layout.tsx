import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'BEM-Track | Sistem Informasi BEM FKI UMS',
    template: '%s | BEM-Track',
  },
  description:
    'Sistem informasi untuk tracking progress dan transparansi birokrasi BEM FKI UMS berbasis klasifikasi otomatis IndoBERT.',
  keywords: ['BEM', 'FKI', 'UMS', 'Proker', 'Transparansi', 'IndoBERT'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={`${inter.variable} ${jetbrainsMono.variable} h-full`}>
      <body className="h-full antialiased">{children}</body>
    </html>
  );
}
