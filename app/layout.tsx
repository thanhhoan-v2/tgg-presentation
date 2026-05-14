import type { Metadata } from "next";
import {
  DM_Sans,
  Playfair_Display,
  Space_Mono,
  Syne,
  Bricolage_Grotesque,
  Instrument_Serif,
} from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  variable: "--font-dm-sans",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-playfair",
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
  variable: "--font-space-mono",
});

const syne = Syne({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--font-syne",
});

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  variable: "--font-bricolage",
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
  variable: "--font-instrument",
});

export const metadata: Metadata = {
  title: "Harness Engineering: The Future of AI Agent Design",
  description: "A 10-minute presentation on Harness Engineering",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const fontVars = [
    dmSans.variable,
    playfair.variable,
    spaceMono.variable,
    syne.variable,
    bricolage.variable,
    instrumentSerif.variable,
  ].join(" ");

  return (
    <html lang="en" className={`${fontVars} h-full`}>
      <body className="h-full antialiased">{children}</body>
    </html>
  );
}
