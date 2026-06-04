import type { Metadata } from 'next';
import { Inter, Fredoka } from 'next/font/google';
import './globals.css'; // Global styles

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

const fredoka = Fredoka({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'Taller Creativo De Inglés',
  description: 'Portal de Gestión Educativa',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${inter.variable} ${fredoka.variable}`}>
      <body className="bg-slate-50 text-slate-800 antialiased font-sans" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
