import type { Metadata } from "next";
import { Instrument_Serif, JetBrains_Mono } from "next/font/google";
import InteractiveBackground from "@/components/InteractiveBackground";
import WebGLRoot from "@/components/webgl/WebGLRoot";
import EnvironmentalEffects from "@/components/EnvironmentalEffects";
import ChatrigoWidget from "@/components/ChatrigoWidget";
import BootLockScript from "@/components/BootLockScript";
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
      suppressHydrationWarning
      className={`${instrumentSerif.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-serif">
        <BootLockScript />
        <InteractiveBackground />
        <WebGLRoot />
        <EnvironmentalEffects />
        {children}
        <ChatrigoWidget />
      </body>
    </html>
  );
}
