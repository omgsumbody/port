import type { Metadata } from "next";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import PageTransition from "@/components/PageTransition";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
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
  title: "Portfolio Template",
  description: "Responsive Next.js Template",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${perfectlyNineties.variable} font-sans antialiased text-[#3D495A] bg-white`}>
        <PageTransition>{children}</PageTransition>
      </body>
    </html>
  );
}
