'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { getActiveCatalogs, FirestoreCatalog } from '@/lib/firestore';
import { ArrowRight } from 'lucide-react';

const ease = [0.16, 1, 0.3, 1] as const;

export function CatalogList() {
  const [catalogs, setCatalogs] = useState<FirestoreCatalog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getActiveCatalogs()
      .then(setCatalogs)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <div className="w-4 h-4 rounded-full border-[1.5px] border-[#d89f94] border-t-transparent animate-spin" />
      </div>
    );
  }

  if (catalogs.length === 0) return null;

  return (
    <div className="w-full">
      <motion.div
        className="flex flex-col sm:flex-row gap-4 justify-center flex-wrap"
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.13 } } }}
      >
        {catalogs.map((cat) => (
          <motion.div
            key={cat.id}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease } },
            }}
            className="w-full sm:w-52 flex-shrink-0"
          >
            <Link
              href={`/catalogo/${cat.slug}`}
              className="group relative rounded-2xl overflow-hidden block"
              style={{
                boxShadow: '0 4px 24px rgba(216, 159, 148, 0.14)',
              }}
            >
              {/* Image or warm gradient placeholder */}
              <div
                className="aspect-[3/4] w-full"
                style={{
                  background: 'linear-gradient(135deg, #f5ddd7 0%, #f0d0cc 50%, #e0b8b0 100%)',
                }}
              >
                {cat.coverImageUrl && (
                  <img
                    src={cat.coverImageUrl}
                    alt={cat.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />
                )}
              </div>

              {/* Warm overlay */}
              <div
                className="absolute inset-0"
                style={{
                  background:
                    'linear-gradient(to top, rgba(45,31,26,0.75) 0%, rgba(45,31,26,0.08) 48%, transparent 100%)',
                }}
              />

              {/* Text */}
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <p className="text-white/95 tracking-wide text-[15px] font-medium leading-snug">
                  {cat.name}
                </p>
                {cat.description && (
                  <p className="text-white/50 text-[11px] tracking-wide mt-1 leading-snug line-clamp-2">
                    {cat.description}
                  </p>
                )}
                <div className="flex items-center gap-1.5 mt-3 text-[9px] tracking-[0.22em] uppercase text-white/55 group-hover:text-white/90 transition-colors duration-300">
                  <span>Ver catálogo</span>
                  <ArrowRight className="w-2.5 h-2.5 transition-transform duration-300 group-hover:translate-x-0.5" />
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
