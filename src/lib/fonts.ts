// src/lib/fonts.ts
import { Inter, Poppins } from "next/font/google";
import localFont from "next/font/local";

// Set up Google Fonts
export const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter'
});

export const poppins = Poppins({ 
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-poppins',
});

// Set up Geist fonts using localFont
export const geistSans = localFont({
  src: [
    {
      path: '../../public/fonts/GeistSans-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    // Add other weights if needed
  ],
  variable: '--font-geist-sans',
});

export const geistMono = localFont({
  src: [
    {
      path: '../../public/fonts/GeistMono-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    // Add other weights if needed
  ],
  variable: '--font-geist-mono',
});