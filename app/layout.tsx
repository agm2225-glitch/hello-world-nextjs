import type { Metadata } from "next";
import { Caveat } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";

const caveat = Caveat({
  variable: "--font-handwritten",
  subsets: ["latin"],
  weight: ["500", "700"],
});

export const metadata: Metadata = {
  title: "Caption Rater",
  description: "Upload a photo, get an AI caption, vote on the funniest ones.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${caveat.variable} h-full antialiased`}>
      <body
        className="min-h-full flex flex-col bg-[#E8E2D5] text-[#2C3E50]"
        style={{ fontFamily: "Arial, Helvetica, sans-serif" }}
      >
        <Header />
        {children}
      </body>
    </html>
  );
}