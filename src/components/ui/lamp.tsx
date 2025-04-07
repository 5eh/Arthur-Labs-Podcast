'use client'
import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

export function LampDemo() {
  return (
    <LampContainer>
      <motion.h1
        initial={{ opacity: 0.5, y: 100 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.3,
          duration: 0.8,
          ease: 'easeInOut',
        }}
        className="mt-8 bg-gradient-to-br from-slate-300 to-slate-500 bg-clip-text py-4 text-center text-4xl font-medium tracking-tight text-transparent md:text-7xl"
      >
        Build lamps <br /> the right way
      </motion.h1>
    </LampContainer>
  )
}

export const LampContainer = ({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) => {
  return (
    <div
      className={cn(
        'relative -z-20 flex w-full flex-col items-center justify-center overflow-visible bg-slate-950',
        className,
      )}
    >
      <div className="relative isolate -z-10 flex w-full flex-1 items-center justify-center">
        <motion.div
          initial={{ opacity: 0, width: '0%' }}
          whileInView={{ opacity: 1, width: '50%' }}
          viewport={{ once: false }}
          transition={{
            delay: 0.2,
            duration: 1.0,
            ease: 'easeOut',
          }}
          style={{
            backgroundImage: `conic-gradient(var(--conic-position), var(--tw-gradient-stops))`,
          }}
          className="bg-gradient-conic absolute inset-auto right-1/2 h-56 w-1/2 overflow-visible from-cyan-500 via-transparent to-transparent text-white [--conic-position:from_70deg_at_center_top]"
        >
          <div className="absolute bottom-0 left-0 z-20 h-40 w-full bg-slate-950 [mask-image:linear-gradient(to_top,white,transparent)]" />
          <div className="absolute bottom-0 left-0 z-20 h-full w-40 bg-slate-950 [mask-image:linear-gradient(to_right,white,transparent)]" />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, width: '0%' }}
          whileInView={{ opacity: 1, width: '50%' }}
          viewport={{ once: false }}
          transition={{
            delay: 0.2,
            duration: 1.0,
            ease: 'easeOut',
          }}
          style={{
            backgroundImage: `conic-gradient(var(--conic-position), var(--tw-gradient-stops))`,
          }}
          className="bg-gradient-conic absolute inset-auto left-1/2 h-56 w-1/2 from-transparent via-transparent to-cyan-500 text-white [--conic-position:from_290deg_at_center_top]"
        >
          <div className="absolute right-0 bottom-0 z-20 h-full w-40 bg-slate-950 [mask-image:linear-gradient(to_left,white,transparent)]" />
          <div className="absolute right-0 bottom-0 z-20 h-40 w-full bg-slate-950 [mask-image:linear-gradient(to_top,white,transparent)]" />
        </motion.div>
        <div className="absolute top-1/2 h-48 w-full translate-y-12 scale-x-150 bg-slate-950 blur-2xl"></div>
        <div className="absolute top-1/2 h-48 w-full bg-gradient-to-b from-transparent via-slate-950/80 to-slate-950 opacity-90"></div>
        <div className="absolute top-1/2 z-50 h-48 w-full bg-transparent opacity-10 backdrop-blur-md"></div>
        <div className="absolute inset-auto z-50 h-36 w-full -translate-y-1/2 rounded-full bg-cyan-500 opacity-50 blur-3xl"></div>
        <motion.div
          initial={{ width: '0%' }}
          whileInView={{ width: '60%' }}
          viewport={{ once: false }}
          transition={{
            delay: 0.3,
            duration: 0.9,
            ease: 'easeOut',
          }}
          className="absolute inset-auto z-30 h-36 w-3/5 -translate-y-[6rem] rounded-full bg-cyan-400 blur-2xl"
        ></motion.div>
        <motion.div
          initial={{ width: '0%' }}
          whileInView={{ width: '100%' }}
          viewport={{ once: false }}
          transition={{
            delay: 0.25,
            duration: 1.2,
            ease: 'easeOut',
          }}
          className="absolute inset-auto z-50 h-0.5 w-full -translate-y-[7rem] bg-cyan-400"
        ></motion.div>

        <div className="absolute inset-x-0 bottom-0 h-24 w-full bg-gradient-to-t from-slate-950 via-slate-950/95 to-transparent"></div>
        <div className="absolute inset-auto bottom-0 z-40 h-0.5 w-full bg-cyan-400/30"></div>
      </div>

      <div className="relative z-50 flex flex-col items-center px-5">
        {children}
      </div>
    </div>
  )
}
