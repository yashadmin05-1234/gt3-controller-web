import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'GT3 Controller',
  description: 'Remote desktop session management',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-bg text-slate-200 antialiased">{children}</body>
    </html>
  );
}
