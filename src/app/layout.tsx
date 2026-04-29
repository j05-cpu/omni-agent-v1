import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Digital Godfather | Core Control Unit',
  description: 'Self-Hosted Agent Ecosystem - Central orchestration platform for managing backend agents',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        <div className="min-h-screen bg-gradient-to-b from-obsidian-900 to-obsidian-800">
          {children}
        </div>
      </body>
    </html>
  );
}