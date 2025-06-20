import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import Header from "@/components/use-case/layout/header";
import Footer from "@/components/use-case/layout/footer";

const inter = Inter({
  variable: "--font-primary",
  subsets: ["latin"],
  display: "swap",
});

const grotesk = Space_Grotesk({
  variable: "--font-secondary",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Portfólio de Felipe Souto",
  description: "Seja bem vindo ao meu portfólio!",
  keywords: [
    "portfólio",
    "frontend",
    "react",
    "tailwind",
    "three.js",
    "phaser",
    "developer",
  ],
  authors: [{ name: "Felipe Souto", url: "https://felipesouto.dev" }],
  metadataBase: new URL("https://felipesouto.dev"),
  themeColor: "#ffffff",
  creator: "Felipe Souto",
  robots: "index, follow",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={` ${inter.variable} ${grotesk.variable} 
        font-primary
        bg-foreground-blue
        text-text
        antialiased 
        selection:bg-primary/20`}
      >
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
