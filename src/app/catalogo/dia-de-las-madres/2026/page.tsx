'use client';
import { Playfair_Display } from 'next/font/google';
import { Header } from "@/app/components/header";
import { Product } from '@/types/product';
import { MothersDayHero } from "./components/mothers-day-hero";
import { MothersDayProductGrid } from "./components/mothers-day-product-grid";
import { useRouter } from 'next/navigation';
import { catalog } from "@/data/catalog-mothers-day";

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-playfair',
});

export default function Catalog() {
  const router = useRouter();

  const handleProductClick = (product: Product) => {
    router.push(`/catalogo/dia-de-las-madres/2026/${product.id}`);
  };

  return (
    <div className={`min-h-screen bg-[#fdfaf8] ${playfair.variable}`}>
      <Header />
      <main>
        <MothersDayHero />
        <MothersDayProductGrid products={catalog} onProductClick={handleProductClick} />
      </main>
    </div>
  );
}
