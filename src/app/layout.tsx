import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
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
  title: "MusicFlow - YouTube Music Player",
  description: "A beautiful, modern music player that lets you search and play your favorite music from YouTube. Create playlists, manage your queue, and enjoy seamless playback.",
  keywords: ["music", "player", "YouTube", "streaming", "playlist", "music player"],
  authors: [{ name: "MusicFlow" }],
  icons: {
    icon: "https://img.icons8.com/fluency/48/music.png",
  },
  openGraph: {
    title: "MusicFlow - YouTube Music Player",
    description: "Search and play your favorite music from YouTube",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "MusicFlow - YouTube Music Player",
    description: "Search and play your favorite music from YouTube",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-zinc-950 text-white`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
