import type { Metadata } from "next";
import { Geist, Geist_Mono, Instrument_Serif, Archivo_Black } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
});

// Heavy display face for macro-typography (brutalist skill):
// massive section headings with tight tracking.
const archivoBlack = Archivo_Black({
  variable: "--font-archivo",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Andi Muh Haikal Lukman — Full Stack Developer",
  description:
    "Portfolio of Andi Muh Haikal Lukman, a Full Stack Developer based in Makassar, Indonesia.",
  openGraph: {
    title: "Andi Muh Haikal Lukman — Full Stack Developer",
    description:
      "Full Stack Developer based in Makassar, Indonesia.",
    type: "website",
    images: ["/images/hero-wide.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${instrumentSerif.variable} ${archivoBlack.variable} bg-background text-foreground antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
