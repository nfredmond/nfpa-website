import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Nat Ford Planning & Analysis | Northern California Planning, GIS & Aerial Mapping",
    template: "%s | Nat Ford Planning & Analysis",
  },
  description: "Data-driven urban planning, GIS, and aerial insights for Northern California communities. Expert transportation planning, grant writing, and spatial analysis.",
  keywords: [
    "urban planning",
    "transportation planning",
    "GIS analysis",
    "aerial mapping",
    "photogrammetry",
    "grant writing",
    "Northern California",
    "rural planning",
    "small municipalities",
  ],
  authors: [{ name: "Nathaniel Ford Redmond" }],
  creator: "Nat Ford Planning & Analysis",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://natfordplanning.com",
    siteName: "Nat Ford Planning & Analysis",
    title: "Nat Ford Planning & Analysis",
    description: "Data-driven urban planning, GIS, and aerial insights for Northern California communities.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nat Ford Planning & Analysis",
    description: "Data-driven urban planning, GIS, and aerial insights for Northern California communities.",
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
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
