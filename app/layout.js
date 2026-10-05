import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SessionWrapper from "@/components/SessionWrapper";
import { Analytics } from "@vercel/analytics/next"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "GetMeAChai | Support creators",
  description: "Support independent creators with a chai and help them keep creating.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-screen flex flex-col">
        <SessionWrapper>
          <Navbar />
          <div className="text-white flex-1 flex flex-col">
            <div className="app-bg" aria-hidden="true" />
            {children}
          </div>
          <Footer />
        </SessionWrapper>
        <Analytics />
      </body>
    </html>
  );
}
