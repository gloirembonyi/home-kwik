import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Inter, Poppins } from "next/font/google";
import App from "./_app";
import { AuthProvider } from "@/hooks/useAuth";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});
const inter = Inter({ subsets: ["latin"] });
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
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
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${inter.className} ${poppins.className} antialiased`}
      >
        <AuthProvider>
          <App>{children}</App>
        </AuthProvider>
      </body>
    </html>
  );
}
