import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import TransitionProvider from "./components/TransitionProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "DevSpace — Built for Engineers",
  description:
    "DevSpace is a premium community platform where engineers, builders, and developers connect, solve challenges, earn certificates, and grow together.",
  keywords: [
    "engineers",
    "developer community",
    "coding challenges",
    "certificates",
    "builders",
    "DevSpace",
    "aura points",
    "engineering network",
  ],
  openGraph: {
    title: "DevSpace — Built for Engineers",
    description:
      "A premium ecosystem for builders, developers, and creators to connect, grow, and ship.",
    type: "website",
    siteName: "DevSpace",
  },
  twitter: {
    card: "summary_large_image",
    title: "DevSpace — Built for Engineers",
    description: "The premium platform for serious engineers.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-black text-white overflow-x-hidden selection:bg-[#f5c140]/30">
        <TransitionProvider>
          {children}
        </TransitionProvider>
      </body>
    </html>
  );
}
