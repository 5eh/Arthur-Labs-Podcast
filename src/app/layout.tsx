import { type Metadata } from 'next'
import { Analytics } from '@vercel/analytics/react'

import '@/styles/tailwind.css'

export const metadata: Metadata = {
  metadataBase: new URL('https://podcast.arthurlabs.net'),
  title: {
    template: '%s | Arthur Labs Inc.',
    default: 'Podcasts | Arthur Labs Inc.',
  },
  description:
    'An analysis podcast series that helps convey major Whitepapers, primarily focused on cryptography, blockchains, and new technologies',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Podcasts | Arthur Labs Inc.',
    description:
      'An analysis podcast series that helps convey major Whitepapers, primarily focused on cryptography, blockchains, and new technologies',
    url: 'https://podcast.arthurlabs.net',
    siteName: 'Arthur Labs Inc.',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Podcasts | Arthur Labs Inc.',
    description:
      'An analysis podcast series that helps convey major Whitepapers, primarily focused on cryptography, blockchains, and new technologies',
    creator: '@ArthurLabsDAO',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full antialiased">
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "PodcastSeries",
                  "@id": "https://podcast.arthurlabs.net/#podcastseries",
                  name: "Arthur Labs Podcast",
                  description:
                    "An analysis podcast series that helps convey major Whitepapers, primarily focused on cryptography, blockchains, and new technologies",
                  url: "https://podcast.arthurlabs.net",
                  inLanguage: "en",
                  publisher: {
                    "@id": "https://arthurlabs.net/#organization",
                  },
                },
                {
                  "@type": "WebSite",
                  "@id": "https://podcast.arthurlabs.net/#website",
                  url: "https://podcast.arthurlabs.net",
                  name: "Arthur Labs Podcast",
                  publisher: {
                    "@id": "https://arthurlabs.net/#organization",
                  },
                },
              ],
            }),
          }}
        />
      </head>
      <body className="flex min-h-full">
        <div className="w-full">{children}</div>
        <Analytics />
      </body>
    </html>
  )
}
