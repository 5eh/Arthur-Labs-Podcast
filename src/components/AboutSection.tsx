'use client'

import { useState } from 'react'
import clsx from 'clsx'

import { TinyWaveFormIcon } from '@/components/TinyWaveFormIcon'

export function AboutSection(props: React.ComponentPropsWithoutRef<'section'>) {
  let [isExpanded, setIsExpanded] = useState(false)

  return (
    <section {...props}>
      <h2 className="flex items-center font-mono text-sm/7 font-medium text-slate-900">
        <TinyWaveFormIcon
          colors={['fill-slate-300', 'fill-slate-500']}
          className="h-2.5 w-2.5"
        />
        <span className="ml-2.5 text-gray-200">About</span>
      </h2>
      <p
        className={clsx(
          'mt-2 text-base/7 text-white',
          !isExpanded && 'lg:line-clamp-4',
        )}
      >
        This series introduces a conversational perspective of leading
        Whitepapers in the blockchain and advanced technologies sector. Papers
        range from a collection of Web3 to AI, as well as any interesting and
        unique concepts. This is provided freely by Arthur Labs with the honest
        intention of growing viewership in the Arthur Labs ecosystem.
      </p>
      {!isExpanded && (
        <button
          type="button"
          className="mt-2 hidden text-sm/6 font-bold text-pink-500 hover:text-pink-700 active:text-pink-900 lg:inline-block"
          onClick={() => setIsExpanded(true)}
        >
          Show more
        </button>
      )}
    </section>
  )
}
