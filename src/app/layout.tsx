// layout.tsx
import { AuthProvider } from "@/hooks/useAuth";
import { TooltipProvider } from "@/components/ui/base/tooltip"; 
import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import localFont from "next/font/local";
import App from "./_app";
import "./globals.css";
import 'leaflet/dist/leaflet.css';

// Configure fonts with optimized loading
const geistSans = localFont({
  src: [
    {
      path: '../fonts/GeistVF.woff2',
      weight: '100 900',
      style: 'normal',
    },
  ],
  variable: "--font-geist-sans",
  display: 'swap',
  preload: true,
  fallback: ['system-ui', 'arial'],
});

const geistMono = localFont({
  src: [
    {
      path: '../fonts/GeistMonoVF.woff2',
      weight: '100 900',
      style: 'normal',
    },
  ],
  variable: "--font-geist-mono",
  display: 'swap',
  preload: true,
  fallback: ['monospace'],
});

const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap',
  preload: true,
  fallback: ['system-ui', 'arial'],
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  display: 'swap',
  preload: true,
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
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${inter.className} ${poppins.className} antialiased`}
        suppressHydrationWarning
      >
        <AuthProvider>
          <TooltipProvider> {/* Wrap TooltipProvider here */}
            <App>{children}</App>
          </TooltipProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
