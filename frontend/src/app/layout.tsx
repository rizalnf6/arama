import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  title: "Villa Arama Riverside | Luxury Riverside Retreat in Bali",
  description: "Experience tranquility at Villa Arama Riverside, a stunning luxury villa nestled along the banks of a pristine river in Bali. Book your exclusive riverside retreat today.",
  keywords: ["villa", "bali", "riverside", "luxury", "accommodation", "retreat", "ubud"],
  openGraph: {
    title: "Villa Arama Riverside | Luxury Riverside Retreat in Bali",
    description: "Experience tranquility at Villa Arama Riverside, a stunning luxury villa in Bali.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${playfair.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
