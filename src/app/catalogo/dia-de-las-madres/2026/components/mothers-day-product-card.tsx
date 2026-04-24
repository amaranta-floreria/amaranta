'use client';
import { Product } from "@/types/product";
import { motion } from "motion/react";

interface MothersDayProductCardProps {
  product: Product;
  onClick: (product: Product) => void;
}

export function MothersDayProductCard({ product, onClick }: MothersDayProductCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="cursor-pointer group"
      onClick={() => onClick(product)}
    >
      <div className="bg-[#fdf8f5] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
        {/* Product Image — portrait 3:4 */}
        <div className="relative aspect-[3/4] overflow-hidden">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>

        {/* Product Info */}
        <div className="px-4 pt-3 pb-4 space-y-1">
          <h3 className="font-serif text-[#3d2a2a] text-base leading-snug line-clamp-2">
            {product.name}
          </h3>
          <p className="text-[#b5606a] text-lg font-medium">
            ${product.price.toLocaleString('es-MX')}
          </p>
          <p className="text-xs text-gray-400 line-clamp-1">
            {product.description}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
