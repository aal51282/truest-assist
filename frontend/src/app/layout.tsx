import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Truest Assist",
  description: "Making Cents of Business",
  icons: [
    {
      rel: 'icon',
      url: '/petals.png',
      type: 'image/png',
    },
    {
      rel: 'apple-touch-icon',
      url: '/petals.png',
      type: 'image/png',
    }
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/petals.png" type="image/png" sizes="any" />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
