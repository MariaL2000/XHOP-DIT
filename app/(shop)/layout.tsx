import type { Metadata } from "next";
import {
  Footer,
  Sidebar,
  TopMenu,
  HomeSlider,
  ModernBanner,
  InfoSection,
} from "@/components";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  ),
  title: {
    // Usamos comillas dobles afuera para poder usar la comilla simple adentro sin error
    default: "XHOP'DIT | Exclusive Fashion & Trends",
    template: "%s | XHOP'DIT",
  },
  description:
    "Descubre la última moda urbana y tendencias exclusivas en XHOP'DIT. Calidad premium con envíos a todo el país.",
  keywords: ["ecommerce", "moda", "ropa urbana", "XHOP'DIT", "tendencias 2026"],

  // Corregido: Estructura de autores con comillas dobles
  authors: [{ name: "XHOP'DIT Team" }],

  openGraph: {
    title: "XHOP'DIT | Tu Estilo, Tu Regla",
    description:
      "La mejor selección de productos exclusivos. Vive la experiencia XHOP'DIT.",
    siteName: "XHOP'DIT",
    type: "website",
    locale: "es_ES",
  },
  twitter: {
    card: "summary_large_image",
    title: "XHOP'DIT",
    description: "Ecommerce moderno con Next.js",
  },
  robots: "index, follow",
};
export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen flex flex-col antialiased">
      <TopMenu />
      <Sidebar />

      <section className="w-full">
        <HomeSlider />
      </section>

      <div className="flex-1 w-full max-w-360 mx-auto transition-all duration-300 ease-in-out">
        <div className="px-4 md:px-10 lg:px-16">
          <div className="py-6 sm:py-10">
            <ModernBanner />
          </div>

          <div className="min-h-[50vh]">{children}</div>
        </div>
      </div>

      <div className="w-full mt-10 md:mt-20 border-t border-gray-100">
        <div className="max-w-360 mx-auto px-4 md:px-10 lg:px-16">
          <InfoSection />
        </div>
      </div>

      <Footer />
    </main>
  );
}
