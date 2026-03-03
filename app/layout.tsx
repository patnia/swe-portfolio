import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Aadi Patni | Software Engineer',
  description: 'Software Engineer & Computer Science student at UC Santa Barbara. Building scalable systems and developer tools.',
  keywords: ['Software Engineer', 'Full Stack', 'Backend', 'UCSB', 'Computer Science'],
  openGraph: {
    title: 'Aadi Patni | Software Engineer',
    description: 'Software Engineer building scalable systems @ UCSB',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#030712] text-green-400 font-mono antialiased scanline">
        {children}
      </body>
    </html>
  )
}
