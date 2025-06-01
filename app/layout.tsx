import type React from "react";
import type { Metadata } from "next";
import { Orbitron, Rajdhani } from "next/font/google";
import "./globals.css";

const orbitron = Orbitron({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  variable: "--font-orbitron",
});

const rajdhani = Rajdhani({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-rajdhani",
});

export const metadata: Metadata = {
  title: "Mutation Chase - The Viral Escape",
  description: "A DNA pattern matching game using the Z-algorithm",
  generator: "v0.dev",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <style>{`
          @keyframes fadeUpAnimation {
            0% {
              opacity: 1;
              transform: translate(-50%, 0);
            }
            80% {
              opacity: 0.8;
            }
            100% {
              opacity: 0;
              transform: translate(-50%, -50px);
            }
          }
          
          .animate-fade-up {
            animation: fadeUpAnimation 1.5s forwards;
          }
        `}</style>
      </head>
      <body
        suppressHydrationWarning
        className={`${orbitron.variable} ${rajdhani.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
