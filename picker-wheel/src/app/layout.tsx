import type { Metadata, Viewport } from 'next'
import './globals.css'
import { Analytics } from '@/components/Analytics'

export const metadata: Metadata = {
  metadataBase: new URL(process.env.SITE_URL || 'https://pickerwheel.example'),
  title: {
    default: 'Picker Wheel – Random Choice Spinner',
    template: '%s – Picker Wheel'
  },
  description: 'Add options, spin the wheel, and pick a random winner. Fast, accessible, SEO-friendly Picker Wheel.',
  alternates: { canonical: '/' },
  openGraph: {
    title: 'Picker Wheel – Random Choice Spinner',
    description: 'Add options, spin the wheel, and pick a random winner.',
    url: '/',
    siteName: 'Picker Wheel',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Picker Wheel – Random Choice Spinner',
    description: 'Add options, spin the wheel, and pick a random winner.'
  },
  icons: [{ rel: 'icon', url: '/icon.svg' }],
  manifest: '/manifest.webmanifest'
}

export const viewport: Viewport = {
  themeColor: '#2563eb',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  )
}