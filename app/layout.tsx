import type { Metadata } from "next";
import { Inter, DM_Serif_Display } from "next/font/google";
import "remixicon/fonts/remixicon.css";
import "./globals.css";

// Inter carries the whole system (UI, body, data). Variable, optical sizing.
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

// DM Serif Display — brand wordmark only.
const dmSerif = DM_Serif_Display({
  variable: "--font-dm-serif",
  subsets: ["latin"],
  display: "swap",
  weight: ["400"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  ),
  title: {
    default: "Wealth AIR: find your All India Wealth Rank",
    template: "%s | Wealth AIR",
  },
  description:
    "Add up what you own and find your All India Wealth Rank — exactly where you stand among everyone who's played. Free and takes a minute. By BondScanner.",
  keywords: [
    "all india wealth rank",
    "wealth rank india",
    "india wealth calculator",
    "total wealth rank india",
    "find your air",
  ],
  openGraph: {
    title: "What's your All India Wealth Rank?",
    description:
      "Add up what you own and find out exactly where you rank in India.",
    type: "website",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "What's your All India Wealth Rank?",
    description: "Add up what you own and find out exactly where you rank in India.",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${dmSerif.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
