
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar2 from "@/components/Navbar2";
import Navbar from "@/components/Navbar";
import LoadingScreen from '@/components/LoadingScreen';
import { LoadingProvider } from '@/context/LoadingProvider';
import AuthListener from "@/components/AuthListener";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {

  return (
    <html lang="es">
      <head>
      <link rel="preconnect" href="https://fonts.googleapis.com"/>
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=Caveat:wght@400..700&display=swap" rel="stylesheet" />
      </head>
      <body>
        <Navbar />
        <LoadingProvider>
          <LoadingScreen />
          <AuthListener />
          {children}
        </LoadingProvider>
      </body>
    </html>
  );
}