// layout.tsx
import { AuthProvider } from "@/hooks/useAuth";
import { TooltipProvider } from "@/components/ui/base/tooltip";
import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import localFont from "next/font/local";
import App from "./_app";
import "./globals.css";
import 'leaflet/dist/leaflet.css';

// Configure Geist Sans
const geistSans = localFont({
  src: '../fonts/GeistVF.woff2',
  variable: '--font-geist-sans',
  display: 'swap',
  preload: true,
  fallback: ['system-ui', 'arial'],
});

// Configure Geist Mono
const geistMono = localFont({
  src: '../fonts/GeistMonoVF.woff2',
  variable: '--font-geist-mono',
  display: 'swap',
  preload: true,
  fallback: ['monospace'],
});

// Configure Inter
const inter = Inter({
  subsets: ["latin"],
  display: 'swap',
  preload: true,
  variable: '--font-inter',
  fallback: ['system-ui', 'arial'],
});

// Configure Poppins
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
        <AuthProvider>
          <TooltipProvider>
            <App>{children}</App>
          </TooltipProvider>
        </AuthProvider>
      </body>
    </html>
  );
}