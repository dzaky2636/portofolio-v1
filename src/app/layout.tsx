import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import InteractiveBackground from "@/components/InteractiveBackground";
import Interactive3DScatter from "@/components/Interactive3DScatter";
import EnvironmentalEffects from "@/components/EnvironmentalEffects";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Dzaky Fatur Rahman — Lead Fullstack Engineer & AI Integrator",
  description:
    "Portfolio of Dzaky Fatur Rahman: Architecting scalable omnichannel SaaS platforms, AI-integrated systems, and secure civic web infrastructure.",
  icons: {
    icon: "/boar.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <InteractiveBackground />
        <Interactive3DScatter />
        <EnvironmentalEffects />
        {children}
      </body>
    </html>
  );
}
