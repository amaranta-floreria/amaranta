import { Product } from "@/types/product";
import { motion } from "motion/react";

interface ProductCardProps {
  product: Product;
  onClick: (product: Product) => void;
}

export function ProductCard({ product, onClick }: ProductCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="cursor-pointer group"
      onClick={() => onClick(product)}
    >
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
        {/* Product Image */}
        <div className="relative aspect-square overflow-hidden bg-gray-50">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>

        {/* Product Info */}
        <div className="p-4 space-y-2">
          <h3 className="text-base text-gray-800 line-clamp-1">
            {product.name}
          </h3>
          <p className="text-lg text-rose-500">
            ${product.price.toFixed(2)}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
