import type { Metadata } from "next";
import { Instrument_Serif, JetBrains_Mono } from "next/font/google";
import InteractiveBackground from "@/components/InteractiveBackground";
import WebGLRoot from "@/components/webgl/WebGLRoot";
import EnvironmentalEffects from "@/components/EnvironmentalEffects";
import ChatrigoWidget from "@/components/ChatrigoWidget";
import "./globals.css";

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
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
      className={`${instrumentSerif.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-serif">
        <InteractiveBackground />
        <WebGLRoot />
        <EnvironmentalEffects />
        {children}
        <ChatrigoWidget />
      </body>
    </html>
  );
}
