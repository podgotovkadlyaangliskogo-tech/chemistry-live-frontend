import type { Metadata } from 'next';
import { Syne, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const syne = Syne({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Chemistry Live — живые викторины по химии',
  description:
    'Интерактивная платформа для проведения live-квизов по органической химии. Ученики отвечают со смартфонов, учитель видит результаты в реальном времени.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru" className={`${syne.variable} ${jetbrainsMono.variable}`}>
      <body className="min-h-screen bg-[#09090B] text-[#F5F4F0] antialiased selection:bg-[#E8C547]/25 selection:text-[#F5F4F0]">
        {children}
      </body>
    </html>
  );
}
