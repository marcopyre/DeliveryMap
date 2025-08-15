import type React from "react";
import type { Metadata } from "next";
import { Urbanist } from "next/font/google";
import "./globals.css";

const urbanist = Urbanist({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-urbanist",
});

export const metadata: Metadata = {
  title: "Gestion de Tournées",
  description:
    "Application de gestion et optimisation des tournées de livraison",
  generator: "v0.app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${urbanist.variable} antialiased`}>
      <body className="font-sans">{children}</body>
    </html>
  );
}
