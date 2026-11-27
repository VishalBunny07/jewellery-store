
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Jewellery Store",
  description: "Discover beautiful jewellery collections.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
