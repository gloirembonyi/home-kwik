import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { Analytics } from "@vercel/analytics/react";
import { Provider as RollbarProvider, ErrorBoundary } from "@rollbar/react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Kwik Ride Dashboard",
  description: "Admin dashboard for Kwik Ride",
};

const rollbarConfig = {
  accessToken: process.env.NEXT_PUBLIC_ROLLBAR_CLIENT_TOKEN,
  environment: process.env.NODE_ENV,
  enabled: process.env.NODE_ENV === "production",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <RollbarProvider config={rollbarConfig}>
        <ErrorBoundary>
          <body className={inter.className}>
            {children}
            <Toaster position="top-right" />
            <SpeedInsights />
            <Analytics />
          </body>
        </ErrorBoundary>
      </RollbarProvider>
    </html>
  );
}
