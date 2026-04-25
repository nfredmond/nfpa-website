import type { Metadata } from "next";
import { Cormorant_Garamond, Source_Sans_3 } from "next/font/google";
import "./globals.css";
import { ThemeScript } from "./theme-script";

const display = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "600", "700"],
});

const body = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "Nat Ford Planning & Analysis | Open-Source Planning, GIS, AI & Custom Software",
    template: "%s | Nat Ford Planning & Analysis",
  },
  description: "Free and open-source planning, GIS, aerial, AI, and operations software with paid implementation, custom forks, hosting, onboarding, support, and transportation planning services.",
  keywords: [
    "urban planning",
    "transportation planning",
    "GIS analysis",
    "aerial mapping",
    "photogrammetry",
    "grant writing",
    "open source software",
    "custom software development",
    "AI implementation",
    "United States",
    "rural planning",
    "tribal transportation",
    "small towns",
    "RTPA",
    "transportation commission",
  ],
  authors: [{ name: "Nathaniel Ford Redmond" }],
  creator: "Nat Ford Planning & Analysis",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.natfordplanning.com",
    siteName: "Nat Ford Planning & Analysis",
    title: "Nat Ford Planning & Analysis",
    description:
      "Free and open-source planning, GIS, aerial, AI, and operations software with paid implementation, custom forks, hosting, onboarding, support, and transportation planning services.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nat Ford Planning & Analysis",
    description:
      "Free and open-source planning, GIS, aerial, AI, and operations software with paid implementation, custom forks, hosting, onboarding, support, and transportation planning services.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body
        className={`${display.variable} ${body.variable} font-body antialiased transition-colors duration-200 bg-[color:var(--background)] text-[color:var(--foreground)]`}
      >
        {children}
      </body>
    </html>
  );
}
