import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "leaflet/dist/leaflet.css";
import "./globals.css";
import "./gmeet/index.css";
import { setPortfolioData } from "@/src/services/portfolioData";
import { fetchPortfolioDataFromFirebase } from "@/src/services/firebasePortfolio";

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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const firebaseData = await fetchPortfolioDataFromFirebase();
  setPortfolioData(firebaseData);
  const bootstrapData = JSON.stringify(firebaseData).replace(/</g, "\\u003c");

  return (
    <html lang="en" className="w-full h-full">
      <head>
        <Script
          id="portfolio-bootstrap"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.__PORTFOLIO_DATA__ = ${bootstrapData};
              try {
                sessionStorage.setItem('portfolio:firebase-data', JSON.stringify(window.__PORTFOLIO_DATA__));
              } catch (error) {}
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased w-full h-full`}
      >
        {children}
      </body>
    </html>
  );
}
