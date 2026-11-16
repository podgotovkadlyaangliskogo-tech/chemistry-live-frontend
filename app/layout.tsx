import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Chemistry Live — Интерактивные викторины по химии',
  description: 'Образовательная платформа для проведения захватывающих викторин по химии в реальном времени в стиле Kahoot',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body className="min-h-screen bg-[#FAFAF8] text-[#1A1A1A] antialiased">
        {children}
      </body>
    </html>
  );
}
