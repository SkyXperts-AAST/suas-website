import type { Metadata } from "next";
import {
  Barlow_Semi_Condensed,
  IBM_Plex_Mono,
  IBM_Plex_Sans,
} from "next/font/google";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import "./globals.css";
import CursorDrone from "@/components/CursorDrone";

// Body: IBM Plex Sans, an engineering-documentation grotesque. Headings:
// Barlow Semi Condensed, derived from highway and airfield signage lettering,
// which suits a vehicle-spec context far better than a generic UI sans.
const plexSans = IBM_Plex_Sans({
  variable: "--font-plex-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const headerSans = Barlow_Semi_Condensed({
  variable: "--font-header-sans",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

// Spec values in the vehicle InfoPanel. A real mono (rather than the system
// `ui-monospace` stack) keeps figures aligned and rendering identically across
// platforms — the system stack resolves to Menlo/Consolas/Liberation Mono
// depending on OS, which is a visibly different look for the same table.
const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "SkyXperts",
  description:
    "SkyXperts UAVs Club at AAST: a student team designing, building and flying autonomous aircraft.",
  icons: {
    icon: "/skyxperts-x.png",
    apple: "/skyxperts-x.png",
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
      className={`${plexSans.variable} ${headerSans.variable} ${plexMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-navy font-sans text-offwhite">
        <CursorDrone />
        <Nav />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}