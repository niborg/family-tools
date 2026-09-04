import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tools",
  description: "Shared tools for the Knipe family",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body className="min-h-dvh antialiased">{children}</body>
    </html>
  );
}
