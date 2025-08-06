import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MindfulBreath - Daily Meditation & Wellness",
  description: "Reduce stress and improve focus with guided breathing exercises. Track your meditation progress and build a consistent mindfulness practice.",
  openGraph: {
    title: "MindfulBreath - Daily Meditation & Wellness",
    description: "Reduce stress and improve focus with guided breathing exercises. Track your meditation progress and build a consistent mindfulness practice.",
    images: [
      {
        url: "/images/social-share.svg",
        width: 1200,
        height: 630,
        alt: "MindfulBreath - Daily Meditation & Wellness App"
      }
    ],
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "MindfulBreath - Daily Meditation & Wellness",
    description: "Reduce stress and improve focus with guided breathing exercises. Track your meditation progress and build a consistent mindfulness practice.",
    images: ["/images/social-share.svg"]
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}
