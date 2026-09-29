import type { Metadata } from "next";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import ViewportGate from "@/components/ViewportGate";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

// v2 editorial fonts — only the cuts DESIGN.md calls for, to keep payload small
const anthropicSerif = localFont({
  src: [
    {
      path: "../../public/Anthropic Serif/AnthropicSerif-Display-Regular-Static.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/Anthropic Serif/AnthropicSerif-Display-RegularItalic-Static.otf",
      weight: "400",
      style: "italic",
    },
  ],
  variable: "--font-anthropic-serif",
  display: "swap",
});

const anthropicSans = localFont({
  src: [
    {
      path: "../../public/Anthropic Sans/AnthropicSans-Text-Regular-Static.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/Anthropic Sans/AnthropicSans-Text-Medium-Static.otf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/Anthropic Sans/AnthropicSans-Text-Semibold-Static.otf",
      weight: "600",
      style: "normal",
    },
  ],
  variable: "--font-anthropic-sans",
  display: "swap",
});

const perfectlyNineties = localFont({
  src: [
    {
      path: "../../public/fonts/perfectlynineties-regular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/perfectlynineties-regularitalic.otf",
      weight: "400",
      style: "italic",
    },
    {
      path: "../../public/fonts/perfectlynineties-semibold.otf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../public/fonts/perfectlynineties-semibolditalic.otf",
      weight: "600",
      style: "italic",
    },
    {
      path: "../../public/fonts/perfectlynineties-bold.otf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../public/fonts/perfectlynineties-bolditalic.otf",
      weight: "700",
      style: "italic",
    },
    {
      path: "../../public/fonts/perfectlynineties-extrabold.otf",
      weight: "800",
      style: "normal",
    },
    {
      path: "../../public/fonts/perfectlynineties-extrabolditalic.otf",
      weight: "800",
      style: "italic",
    },
    {
      path: "../../public/fonts/perfectlynineties-black.otf",
      weight: "900",
      style: "normal",
    },
    {
      path: "../../public/fonts/perfectlynineties-blackitalic.otf",
      weight: "900",
      style: "italic",
    },
  ],
  variable: "--font-perfectly-nineties",
});

export const metadata: Metadata = {
  title: "Harsha Peddinti",
  description: "Responsive Next.js Template",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${anthropicSerif.variable} ${anthropicSans.variable} ${perfectlyNineties.variable} font-sans antialiased text-[#3D495A] bg-white`}>
        <ViewportGate>{children}</ViewportGate>
      </body>
    </html>
  );
}
