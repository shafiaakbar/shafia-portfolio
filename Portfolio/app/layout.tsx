import type { Metadata } from "next";
import { Geist, Geist_Mono, Orbitron } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
  weight: ["700", "800", "900"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://shafiab.com"),
  title: {
    default: "Shafia B",
    template: "%s | Shafia B",
  },
  description:
    "Forward Deployed Engineer at Karing.ai. Building AI agents that handle 5,000+ calls/day. Open to new projects.",
  authors: [{ name: "Shafia Bahar", url: "https://shafiab.com" }],
  creator: "Shafia Bahar",
  alternates: { canonical: "https://shafiab.com" },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://shafiab.com",
    siteName: "Shafia Bahar",
    title: "Shafia Bahar — Forward Deployed Engineer",
    description:
      "Forward Deployed Engineer at Karing.ai. Building AI agents that handle 5,000+ calls/day. Open to new projects.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Shafia Bahar — Forward Deployed Engineer",
    description:
      "Forward Deployed Engineer at Karing.ai. Building AI agents that handle 5,000+ calls/day. Open to new projects.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Shafia Bahar",
    url: "https://shafiab.com",
    jobTitle: "Forward Deployed Engineer",
    worksFor: { "@type": "Organization", name: "Karing.ai" },
    sameAs: [
      "https://www.linkedin.com/in/shafia-b-05810427a/",
      "https://www.instagram.com/shafiaa.ai/",
    ],
  };

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${orbitron.variable} h-full antialiased`}
    >
      <head>
        <link rel="preconnect" href="https://prod.spline.design" />
        <link rel="preconnect" href="https://api.elevenlabs.io" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
