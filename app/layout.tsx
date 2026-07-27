import type { Metadata } from "next";
import { Barlow_Condensed, Plus_Jakarta_Sans } from "next/font/google";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import "./globals.css";
import CursorDrone from "@/components/CursorDrone";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const headerSans = Barlow_Condensed({
  variable: "--font-header-sans",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

export const metadata: Metadata = {
  title: "SkyXperts",
  description: "SkyXperts SUAS team website",
  icons: {
    icon: "/small logo.png",
    apple: "/small logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${plusJakarta.variable} ${headerSans.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-navy font-sans text-offwhite">
        <CursorDrone />
        <Nav />
        <main className="flex-1 overflow-x-clip">{children}</main>
        <Footer />
      </body>
    </html>
  );
}