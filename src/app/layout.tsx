import type { Metadata } from 'next';
import { DM_Serif_Display, Inter, Geist } from 'next/font/google';
import './globals.css';
import ClientLayout from '@/components/layout/ClientLayout';

const dmSerif = DM_Serif_Display({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const geist = Geist({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'StudyFlow — Personal Academic Workspace',
  description: 'A minimalist, calming academic productivity workspace for thesis writing, research, and schedule management.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={`${dmSerif.variable} ${inter.variable} ${geist.variable} h-full antialiased`}>
      <body className="min-h-full font-sans antialiased text-[#202923] bg-[#F7F6F2] selection:bg-[#DCE7DC] selection:text-[#202923]">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
