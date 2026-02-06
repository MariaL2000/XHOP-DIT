import type { Metadata } from "next";
import { inter } from "@/config/fonts";

import "./globals.css";
import { Providers } from "@/components";
import ChatWrapper from "@/components/chat/ChatWrapper";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://xhop-dit.vercel.app",
  ),
  title: {
    default: "XHOP'DIT | Exclusive Fashion & Trends",
    template: "%s | XHOP'DIT",
  },
  description:
    "Descubre la última moda urbana y tendencias exclusivas en XHOP'DIT. Calidad premium con envíos a todo el país.",
  keywords: [
    "ecommerce xhop dit",
    "moda shop dit",
    "ropa urbana xhop dit",
    "XHOP'DIT",
    "xhopdit",
    "xhop dit",
    "shop dit",
    "tendencias XHOP'DIT",
  ],
  authors: [{ name: "XHOP'DIT Team" }],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: "https://xhop-dit.vercel.app/",
    siteName: "XHOP'DIT",
  },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <Providers>
          {children}
          <ChatWrapper />
        </Providers>
      </body>
    </html>
  );
}
