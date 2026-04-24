import { MothersDayProductCard } from "./mothers-day-product-card";
import { Product } from "@/types/product";

interface MothersDayProductGridProps {
  products: Product[];
  onProductClick: (product: Product) => void;
}

export function MothersDayProductGrid({ products, onProductClick }: MothersDayProductGridProps) {
  return (
    <section className="py-8 sm:py-12 bg-[#fdfaf8]">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {products.map((product) => (
            <MothersDayProductCard
              key={product.id}
              product={product}
              onClick={onProductClick}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
