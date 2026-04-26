'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { getActiveCatalogs, FirestoreCatalog } from '@/lib/firestore';
import { ArrowRight } from 'lucide-react';

const ease = [0.16, 1, 0.3, 1] as const;

export function CatalogList() {
  const [catalogs, setCatalogs] = useState<FirestoreCatalog[]>([]);

  useEffect(() => {
    getActiveCatalogs().then(setCatalogs).catch(() => {});
  }, []);

  if (catalogs.length === 0) return null;

  return (
    <div className="w-full">
      <motion.div
        className="flex flex-col sm:flex-row gap-4 justify-center flex-wrap"
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.12 } } }}
      >
        {catalogs.map((cat) => (
          <motion.div
            key={cat.id}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease } },
            }}
            className="w-full sm:w-52 flex-shrink-0"
          >
            <Link
              href={`/catalogo/${cat.slug}`}
              className="group relative rounded-2xl overflow-hidden block shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              {/* Image or gradient placeholder */}
              <div className="aspect-[3/4] w-full">
                {cat.coverImageUrl ? (
                  <img
                    src={cat.coverImageUrl}
                    alt={cat.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-[#f5ddd7] via-[#f0d0cc] to-[#e8c4b8]" />
                )}
              </div>

              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />

              {/* Text content */}
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <p className="text-white font-bold tracking-wide text-base leading-snug">
                  {cat.name}
                </p>
                {cat.description && (
                  <p className="text-white/65 text-[11px] mt-1 leading-snug line-clamp-2">
                    {cat.description}
                  </p>
                )}
                <div className="flex items-center gap-1 mt-2.5 text-white/70 text-[10px] tracking-[0.15em] uppercase group-hover:text-white transition-colors duration-300">
                  <span>Ver catálogo</span>
                  <ArrowRight className="w-2.5 h-2.5 group-hover:translate-x-0.5 transition-transform duration-300" />
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
