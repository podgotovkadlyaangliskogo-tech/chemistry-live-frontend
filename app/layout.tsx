import type { Metadata } from 'next';
import { Space_Grotesk, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Chemistry Live — Интерактивные викторины по химии в реальном времени',
  description:
    'Образовательная платформа для проведения захватывающих live-квизов по органической химии в стиле Kahoot с мгновенной синхронизацией.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru" className={`${spaceGrotesk.variable} ${jetbrainsMono.variable}`}>
      <body className="min-h-screen bg-[#0A0E1A] text-[#F0F4FF] antialiased selection:bg-[#4F8EF7]/30 selection:text-white">
        {children}
      </body>
    </html>
  );
}
