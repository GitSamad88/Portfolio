import type { Metadata } from "next";
import {
  Space_Grotesk,
  Inter,
  IBM_Plex_Mono,
  IBM_Plex_Sans,
  Playfair_Display,
  Source_Sans_3,
  Poppins,
  JetBrains_Mono,
} from "next/font/google";
import "./globals.css";

// Curated font presets, selectable later from the admin Theme tab.
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-space-grotesk", weight: ["500", "700"] });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", weight: ["400", "500", "600"] });
const plexMono = IBM_Plex_Mono({ subsets: ["latin"], variable: "--font-plex-mono", weight: ["400", "600"] });
const plexSans = IBM_Plex_Sans({ subsets: ["latin"], variable: "--font-plex-sans", weight: ["400", "500", "600"] });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair", weight: ["600", "700"] });
const sourceSans = Source_Sans_3({ subsets: ["latin"], variable: "--font-source-sans", weight: ["400", "500", "600"] });
const poppins = Poppins({ subsets: ["latin"], variable: "--font-poppins", weight: ["400", "500", "600"] });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains", weight: ["400", "500"] });

const fontVariables = [
  spaceGrotesk.variable,
  inter.variable,
  plexMono.variable,
  plexSans.variable,
  playfair.variable,
  sourceSans.variable,
  poppins.variable,
  jetbrains.variable,
].join(" ");

export const metadata: Metadata = {
  title: "Portfolio",
  description: "AI Automation & Data Science portfolio",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={fontVariables}>
      <body className="font-body">{children}</body>
    </html>
  );
}
