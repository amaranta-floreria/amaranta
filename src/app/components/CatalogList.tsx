'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { Fraunces } from 'next/font/google';
import { getActiveCatalogs, FirestoreCatalog } from '@/lib/firestore';

const fraunces = Fraunces({
  subsets: ['latin'],
  weight: ['300', '400'],
  style: ['normal', 'italic'],
});

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
      <div className="flex justify-center py-16">
        <div className="w-3 h-3 rounded-full border-[1.5px] border-[#6b1e2c] border-t-transparent animate-spin" />
      </div>
    );
  }

  if (catalogs.length === 0) return null;

  return (
    <motion.ul
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-5 gap-y-10"
      initial="hidden"
      animate="visible"
      variants={{ visible: { transition: { staggerChildren: 0.11 } } }}
    >
      {catalogs.map((cat, i) => (
        <motion.li
          key={cat.id}
          variants={{
            hidden: { opacity: 0, y: 22 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease } },
          }}
        >
          <Link href={`/catalogo/${cat.slug}`} className="group block">
            {/* index row */}
            <div className="flex items-baseline justify-between mb-3">
              <span
                className={`${fraunces.className} italic text-[#6b1e2c] text-[15px]`}
              >
                {String(i + 1).padStart(2, '0')}
                <span className="text-[#a08379] not-italic"> / {String(catalogs.length).padStart(2, '0')}</span>
              </span>
              <span className="text-[9px] tracking-[0.3em] uppercase text-[#a08379] transition-colors duration-300 group-hover:text-[#6b1e2c]">
                Ver
              </span>
            </div>

            {/* image */}
            <div
              className="relative aspect-[3/4] w-full overflow-hidden rounded-[2px]"
              style={{
                background: 'linear-gradient(135deg, #f5ddd7 0%, #e9c5bd 60%, #c98c84 100%)',
                boxShadow: '0 1px 0 #e2c5bd, 0 18px 40px -22px rgba(107,30,44,0.35)',
              }}
            >
              {cat.coverImageUrl && (
                <img
                  src={cat.coverImageUrl}
                  alt={cat.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1100ms] ease-out group-hover:scale-[1.06]"
                  style={{ filter: 'saturate(0.96)' }}
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
              )}

              {/* hairline frame */}
              <div className="absolute inset-2 border border-white/30 pointer-events-none" />

              {/* deep wash on hover */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  background:
                    'linear-gradient(to top, rgba(45,15,20,0.55) 0%, rgba(45,15,20,0.05) 60%, transparent 100%)',
                }}
              />

              {/* serif corner glyph */}
              <span
                className={`${fraunces.className} italic text-white/85 text-[13px] absolute top-3 left-3 drop-shadow-sm`}
              >
                ❦
              </span>
            </div>

            {/* caption */}
            <div className="mt-4">
              <h3
                className={`${fraunces.className} text-[#2d1f1a] text-[20px] leading-[1.15] tracking-[-0.005em] transition-colors duration-300 group-hover:text-[#6b1e2c]`}
              >
                {cat.name}
              </h3>
              {cat.description && (
                <p className="mt-1.5 text-[12px] leading-snug text-[#8a6b63] line-clamp-2">
                  {cat.description}
                </p>
              )}
              <div className="mt-3 h-px w-8 bg-[#d4b8b0] group-hover:w-16 group-hover:bg-[#6b1e2c] transition-all duration-500" />
            </div>
          </Link>
        </motion.li>
      ))}
    </motion.ul>
  );
}
