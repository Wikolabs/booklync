import type { Metadata } from "next";
import { Cormorant_Garamond, Sora } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({ subsets: ["latin"], weight: ["400","600","700"], variable: "--font-display", display: "swap" });
const sora = Sora({ subsets: ["latin"], variable: "--font-body", display: "swap" });

export const metadata: Metadata = {
  title: "BookLync — Votre agenda rempli. Automatiquement.",
  description: "3 créneaux Calendly proposés, confirmation, brief pré-call et rappel J-1. Zéro intervention.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${cormorant.variable} ${sora.variable}`}>
      <body style={{ fontFamily: "var(--font-body)", background: "#faf5ff" }}>{children}</body>
    </html>
  );
}
