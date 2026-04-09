import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import TabNav from "@/components/TabNav";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NSW Driving Licence Guide — Process & Practice Test",
  description:
    "Complete guide to getting your NSW driver licence. Interactive flowchart of the L → P1 → P2 → Full process, plus 50+ DKT practice questions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <TabNav />
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
