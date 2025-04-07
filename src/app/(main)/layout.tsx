import { Fragment } from 'react'
import Image from 'next/image'
import Link from 'next/link'

import { AboutSection } from '@/components/AboutSection'
import { AudioProvider } from '@/components/AudioProvider'
import { AudioPlayer } from '@/components/player/AudioPlayer'
import posterImage from '../LOGO.png'
import { LampContainer } from '@/components/ui/lamp'

function SpotifyIcon(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg aria-hidden="true" viewBox="0 0 32 32" {...props}>
      <path d="M15.8 3a12.8 12.8 0 1 0 0 25.6 12.8 12.8 0 0 0 0-25.6Zm5.87 18.461a.8.8 0 0 1-1.097.266c-3.006-1.837-6.787-2.252-11.244-1.234a.796.796 0 1 1-.355-1.555c4.875-1.115 9.058-.635 12.432 1.427a.8.8 0 0 1 .265 1.096Zm1.565-3.485a.999.999 0 0 1-1.371.33c-3.44-2.116-8.685-2.728-12.755-1.493a1 1 0 0 1-.58-1.91c4.65-1.41 10.428-.726 14.378 1.7a1 1 0 0 1 .33 1.375l-.002-.002Zm.137-3.629c-4.127-2.45-10.933-2.675-14.871-1.478a1.196 1.196 0 1 1-.695-2.291c4.52-1.374 12.037-1.107 16.785 1.711a1.197 1.197 0 1 1-1.221 2.06" />
    </svg>
  )
}

function PersonIcon(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg aria-hidden="true" viewBox="0 0 11 12" {...props}>
      <path d="M5.019 5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Zm3.29 7c1.175 0 2.12-1.046 1.567-2.083A5.5 5.5 0 0 0 5.019 7 5.5 5.5 0 0 0 .162 9.917C-.39 10.954.554 12 1.73 12h6.578Z" />
    </svg>
  )
}

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  let hosts = ['Arthur Labs', 'Watson Lewis-Rodriguez']

  return (
    <AudioProvider>
      <div className="overflow-x-hidden">
        <header className="bg-gradient-to-b from-black via-gray-900 to-black lg:fixed lg:inset-y-0 lg:left-0 lg:flex lg:w-112 lg:items-start lg:overflow-y-auto xl:w-120">
          {' '}
          <div className="hidden lg:sticky lg:top-0 lg:flex lg:w-16 lg:flex-none lg:items-center lg:px-12 lg:text-sm/7 lg:whitespace-nowrap lg:[writing-mode:vertical-rl]">
            <span className="font-mono text-gray-300">Hosted by</span>
            <span className="mt-6 flex gap-6 font-bold text-white">
              {hosts.map((host, hostIndex) => (
                <Fragment key={host}>
                  {hostIndex !== 0 && (
                    <span aria-hidden="true" className="text-gray-300">
                      /
                    </span>
                  )}
                  {host}
                </Fragment>
              ))}
            </span>
          </div>
          <div className="relative z-10 mx-auto px-4 pt-10 pb-4 sm:px-6 md:max-w-2xl md:px-4 lg:min-h-full lg:flex-auto lg:border-x lg:border-slate-200 lg:px-8 lg:py-12 xl:px-12">
            <Link
              href="/"
              className="relative mx-auto block w-48 overflow-hidden rounded-lg bg-slate-200 shadow-xl shadow-gray-800 sm:w-64 sm:rounded-xl lg:w-auto lg:rounded-2xl"
              aria-label="Homepage"
            >
              <Image
                className="w-full"
                src={posterImage}
                alt=""
                sizes="(min-width: 1024px) 20rem, (min-width: 640px) 16rem, 12rem"
                priority
              />
              <div className="absolute inset-0 rounded-lg ring-1 ring-black ring-inset sm:rounded-xl lg:rounded-2xl" />
            </Link>
            <div className="mt-10 text-center lg:mt-12 lg:text-left">
              <p className="text-xl font-bold text-slate-100">
                <Link href="/">Whitepaper overviews</Link>
              </p>
              <p className="mt-3 text-lg/8 font-medium text-gray-300">
                Artificially generated overviews of the worlds most complex
                whitepapers. Designed for blockchain reviews, progressing
                towards overall technology.
              </p>
            </div>
            <AboutSection className="mt-12 hidden lg:block" />
            <section className="mt-10 lg:mt-12">
              <h2 className="sr-only flex items-center font-mono text-sm/7 font-medium text-slate-900 lg:not-sr-only">
                <span className="ml-2.5 text-gray-200">Listen</span>
              </h2>
              <div className="h-px bg-linear-to-r from-slate-200/0 via-slate-200 to-slate-200/0 lg:hidden" />
              <ul
                role="list"
                className="mt-4 flex justify-center gap-10 text-base/7 font-medium text-slate-700 sm:gap-8 lg:flex-col lg:gap-4"
              >
                {([['Spotify', SpotifyIcon]] as const).map(([label, Icon]) => (
                  <li key={label} className="flex">
                    <Link
                      href="/"
                      className="group flex items-center text-gray-200"
                      aria-label={label}
                    >
                      <Icon className="h-8 w-8 fill-slate-100 group-hover:fill-slate-300" />
                      <span className="hidden sm:ml-3 sm:block">{label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </header>
        <main className="overflow-x-hidden border-t border-slate-200 lg:relative lg:mb-28 lg:ml-112 lg:border-t-0 xl:ml-120">
          <div className="pointer-events-none sticky top-[.5px] left-0 -z-2 w-full overflow-visible">
            <div className="sticky inset-x-0 w-full" style={{ height: '1vh' }}>
              <LampContainer className="w-full bg-transparent">
                <div className="invisible">Hidden content</div>
              </LampContainer>
            </div>
          </div>

          {/* Main Content */}
          <div className="relative w-full">
            <h1 className="mx-12 my-8 px-12 pt-4 text-2xl font-bold text-slate-100 sm:px-6 lg:px-8">
              Episodes
            </h1>
            <div className="w-full">{children}</div>
          </div>
        </main>
        <footer className="border-t border-slate-200 bg-slate-50 py-10 pb-40 sm:py-16 sm:pb-32 lg:hidden">
          <div className="mx-auto px-4 sm:px-6 md:max-w-2xl md:px-4">
            <AboutSection />
            <h2 className="mt-8 flex items-center font-mono text-sm/7 font-medium text-slate-900">
              <PersonIcon className="h-3 w-auto fill-slate-300" />
              <span className="ml-2.5">Hosted by</span>
            </h2>
            <div className="mt-2 flex gap-6 text-sm/7 font-bold text-slate-900">
              {hosts.map((host, hostIndex) => (
                <Fragment key={host}>
                  {hostIndex !== 0 && (
                    <span aria-hidden="true" className="text-slate-400">
                      /
                    </span>
                  )}
                  {host}
                </Fragment>
              ))}
            </div>
          </div>
        </footer>
        <div className="fixed inset-x-0 bottom-0 z-10 lg:left-112 xl:left-120">
          <AudioPlayer />
        </div>
      </div>
    </AudioProvider>
  )
}
