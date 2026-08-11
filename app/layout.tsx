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
  metadataBase: new URL("https://wealthrank.india"),
  title: {
    default:
      "India Wealth Ranker: see where your net worth stands in India",
    template: "%s | India Wealth Ranker",
  },
  description:
    "Discover your wealth percentile in India. Compare your net worth against the general population, the top 10%, and the elite 1%. By BondScanner.",
  keywords: [
    "wealth rank india",
    "net worth percentile india",
    "india wealth calculator",
    "top 1 percent india",
    "wealth distribution india",
  ],
  openGraph: {
    title: "India Wealth Ranker: are you in the top 1%?",
    description:
      "Enter your assets & liabilities. See where you rank in India's wealth hierarchy.",
    type: "website",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "India Wealth Ranker: are you in the top 1%?",
    description: "See where you stand in India's wealth hierarchy.",
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
