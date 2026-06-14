import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "leaflet/dist/leaflet.css";
import "./globals.css";
import "./gmeet/index.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mohit8181",
  description: "Created by +91 9667067062",
  icons: {
    icon: 'https://media.licdn.com/dms/image/v2/D5603AQG0cK8tZmPDAQ/profile-displayphoto-scale_400_400/B56Z5_MgzwIUAg-/0/1780250448976?e=1782345600&v=beta&t=Bc7E5SgJB3is3YCY7Wz8oLz0SPYlcmxKwRacLm_46aU',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="w-full h-full">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased w-full h-full`}
      >
        {children}
      </body>
    </html>
  );
}
