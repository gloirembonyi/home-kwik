import { Analytics } from '@vercel/analytics/react';
import { TooltipProvider } from "@/components/ui/base/tooltip";
import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import localFont from "next/font/local";
import App from "./_app";
import "./globals.css";
import 'leaflet/dist/leaflet.css';
import { Toaster } from "sonner";
import { AuthProvider } from '@/components/hooks/useAuth';
import { AnalyticsProvider } from '@/components/contexts/AppContext';


// Your font configurations remain the same
const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  display: 'swap',
  preload: true,
  fallback: ['system-ui', 'arial'],
});

const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  display: 'swap',
  preload: true,
  fallback: ['monospace'],
});

const inter = Inter({
  subsets: ["latin"],
  display: 'swap',
  preload: true,
  variable: '--font-inter',
  fallback: ['system-ui', 'arial'],
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  display: 'swap',
  preload: true,
  variable: '--font-poppins',
  fallback: ['system-ui', 'arial'],
});

export const metadata: Metadata = {
  title: "Kwik Ride | Admin Dashboard",
  description: "Kwik Ride Admin Dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} ${poppins.variable}`}
    >
      <body
        className="antialiased font-sans"
        suppressHydrationWarning
      >
        <AnalyticsProvider>
        <AuthProvider>
          <TooltipProvider>
            <App>{children}</App>
          </TooltipProvider>
        </AuthProvider>
        <Toaster />
        <Analytics />
        </AnalyticsProvider>
       
      </body>
    </html>
  );
}