import type { Metadata } from "next";
import { Comic_Neue, Ranchers, VT323 } from "next/font/google";
import "./globals.css";

const ranchers = Ranchers({
  subsets: ["latin"],
  variable: "--font-ranchers",
  weight: "400",
});

const comicNeue = Comic_Neue({
  subsets: ["latin"],
  variable: "--font-comic-neue",
  weight: ["400", "700"],
});

const vt323 = VT323({
  subsets: ["latin"],
  variable: "--font-vt323",
  weight: "400",
});

export const metadata: Metadata = {
  title: "Knipe Ranch Tool Shed",
  description: "Shared tools for the Knipe family homestead",
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      className={`${ranchers.variable} ${comicNeue.variable} ${vt323.variable}`}
      lang="en"
    >
      <body className="min-h-dvh font-comic">{children}</body>
    </html>
  );
}
