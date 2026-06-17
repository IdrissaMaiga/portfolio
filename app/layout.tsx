import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import SessionProvider from "@/components/session-provider";

// Font configuration with responsive weights
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
  weight: ["400", "500", "600", "700"],
  preload: true,
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-space",
  weight: ["400", "500", "700"],
  preload: true,
});

// Metadata
export const metadata: Metadata = {
  title: "Idrissa Maiga | Full-Stack Developer",
  description:
    "Portfolio of Idrissa Maiga, a Full-Stack Developer specializing in Java, Spring Boot, React, and modern web technologies.",
  keywords: [
    "Java Developer",
    "Spring Boot",
    "React.js",
    "Full-Stack Developer",
    "Software Engineer",
    "Portfolio",
    "Programming",
  ],
  authors: [{ name: "Idrissa Maiga" }],
  creator: "Idrissa Maiga",
};

// Viewport export
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1.0,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#1f2937" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className="scroll-smooth">
      <head>
        {/* Favicon with responsive support */}
        <link rel="icon" href="/favicon.ico" />
        {/* Preconnect to Google Fonts */}
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={`${inter.variable} ${spaceGrotesk.variable} font-sans antialiased`}>
        <SessionProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            {children}
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}