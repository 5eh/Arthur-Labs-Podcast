import { type Metadata } from 'next'
import { Analytics } from '@vercel/analytics/react'

import '@/styles/tailwind.css'

export const metadata: Metadata = {
  title: {
    template: '%s Arthur Labs Podcasts',
    default: 'Arthur Labs Podcasts',
  },
  description:
    'An analysis podcast series that helps convey major Whitepapers, primarily focused on cryptography, blockchains, and new technologies',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full antialiased">
      <Analytics />
      <head>
        <link
          rel="preconnect"
          href="https://cdn.fontshare.com"
          crossOrigin="anonymous"
        />
        <link
          rel="stylesheet"
          href="https://api.fontshare.com/v2/css?f[]=satoshi@700,500,400&display=swap"
        />
      </head>
      <body className="flex min-h-full">
        <div className="w-full">{children}</div>
      </body>
    </html>
  )
}
