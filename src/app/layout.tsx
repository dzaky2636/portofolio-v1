import type { Metadata } from "next";
import { Instrument_Serif, JetBrains_Mono } from "next/font/google";
import InteractiveBackground from "@/components/InteractiveBackground";
import WebGLLoader from "@/components/webgl/WebGLLoader";
import EnvironmentalEffects from "@/components/EnvironmentalEffects";
import BootLockScript from "@/components/BootLockScript";
import { SITE_URL } from "@/lib/site";
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
  metadataBase: new URL(SITE_URL),
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
        <WebGLLoader />
        <EnvironmentalEffects />
        {children}
      </body>
    </html>
  );
}
