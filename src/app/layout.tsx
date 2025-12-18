import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "./mobile.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "UID BYPASS Management - Advanced License System",
  description: "Advanced UID bypass and license management system with Discord OAuth integration. Built with Next.js, TypeScript, and modern UI technologies.",
  keywords: ["UID Bypass", "License Management", "Discord OAuth", "Next.js", "TypeScript", "Tailwind CSS", "shadcn/ui"],
  authors: [{ name: "UID BYPASS Team" }],
  icons: {
    icon: "https://z-cdn.chatglm.cn/z-ai/static/logo.svg",
  },
  openGraph: {
    title: "UID BYPASS Management",
    description: "Advanced UID bypass and license management system",
    url: "https://chat.z.ai",
    siteName: "UID BYPASS",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "UID BYPASS Management",
    description: "Advanced UID bypass and license management system",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
