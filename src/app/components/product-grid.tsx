
import { ProductCard} from "@/app/components/product-card";
import { Product } from "@/types/product";
import { catalog } from "@/data/catalog";

interface ProductGridProps {
  onProductClick: (product: Product) => void;
}

export function ProductGrid({ onProductClick }: ProductGridProps) {
  return (
    <section className="py-8 sm:py-12 bg-white">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {catalog.map((product) => (
            <ProductCard
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
