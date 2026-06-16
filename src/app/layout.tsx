import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { setPortfolioData } from "@/src/services/portfolioData";
import { fetchPortfolioDataFromFirebase } from "@/src/services/firebasePortfolio";
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

const SITE_URL = "https://mohit8181.me";
const SITE_NAME = "Mohit8181";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} | Portfolio`,
    template: `%s | ${SITE_NAME}`,
  },
  description: "Portfolio of Mohit Arora, full stack developer and robotics enthusiast.",
  applicationName: SITE_NAME,
  authors: [{ name: "Mohit Arora" }],
  creator: "Mohit Arora",
  publisher: SITE_NAME,
  keywords: [
    "Mohit Arora",
    "portfolio",
    "full stack developer",
    "robotics enthusiast",
    "React",
    "Next.js",
    "Firebase",
    "research",
    "projects",
  ],
  icons: {
    icon: 'https://media.licdn.com/dms/image/v2/D5603AQG0cK8tZmPDAQ/profile-displayphoto-scale_400_400/B56Z5_MgzwIUAg-/0/1780250448976?e=1782345600&v=beta&t=Bc7E5SgJB3is3YCY7Wz8oLz0SPYlcmxKwRacLm_46aU',
  },
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} | Portfolio`,
    description: "Projects, experience, research, and clone apps by Mohit Arora.",
    images: [
      {
        url: "https://media.licdn.com/dms/image/v2/D5603AQG0cK8tZmPDAQ/profile-displayphoto-scale_400_400/B56Z5_MgzwIUAg-/0/1780250448976?e=1782345600&v=beta&t=Bc7E5SgJB3is3YCY7Wz8oLz0SPYlcmxKwRacLm_46aU",
        width: 400,
        height: 400,
        alt: "Mohit Arora profile photo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} | Portfolio`,
    description: "Projects, experience, research, and clone apps by Mohit Arora.",
    images: [
      "https://media.licdn.com/dms/image/v2/D5603AQG0cK8tZmPDAQ/profile-displayphoto-scale_400_400/B56Z5_MgzwIUAg-/0/1780250448976?e=1782345600&v=beta&t=Bc7E5SgJB3is3YCY7Wz8oLz0SPYlcmxKwRacLm_46aU",
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const firebaseData = await fetchPortfolioDataFromFirebase();
  setPortfolioData(firebaseData);
  const structuredData = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Person",
    name: firebaseData.meta.name,
    jobTitle: firebaseData.meta.tagline,
    url: SITE_URL,
    image: firebaseData.meta.avatar,
    email: firebaseData.meta.email,
    telephone: firebaseData.meta.phone,
    sameAs: [
      firebaseData.meta.links.linkedin,
      firebaseData.meta.links.github,
      firebaseData.meta.links.leetcode,
      firebaseData.meta.links.geeksforgeeks,
    ].filter(Boolean),
    knowsAbout: [
      ...Object.values(firebaseData.skills).flatMap((group) => group.items),
      ...firebaseData.projects.map((project) => project.name),
      ...firebaseData.research.map((paper) => paper.title),
    ],
  }).replace(/</g, "\\u003c");

  return (
    <html lang="en" className="w-full h-full">
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: structuredData }} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased w-full h-full`}
      >
        {children}
      </body>
    </html>
  );
}
