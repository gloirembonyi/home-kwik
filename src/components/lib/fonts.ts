// src/lib/fonts.ts
import localFont from 'next/font/local'

export const geist = localFont({
  src: [
    {
      path: '../fonts/GeistVF.woff2',
      weight: '300 700',
      style: 'normal',
    }
  ],
  variable: '--font-geist',
  display: 'swap',
})

export const geistMono = localFont({
  src: [
    {
      path: '../fonts/GeistMonoVF.woff2',
      weight: '300 700',
      style: 'normal',
    }
  ],
  variable: '--font-geist-mono',
  display: 'swap',
})