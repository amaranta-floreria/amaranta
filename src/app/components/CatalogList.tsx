'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getActiveCatalogs, FirestoreCatalog } from '@/lib/firestore';
import { ArrowRight } from 'lucide-react';

export function CatalogList() {
  const [catalogs, setCatalogs] = useState<FirestoreCatalog[]>([]);

  useEffect(() => {
    getActiveCatalogs().then(setCatalogs).catch(() => {});
  }, []);

  if (catalogs.length === 0) return null;

  return (
    <div className="w-full px-6 mt-8">
      <p className="text-xs tracking-[0.2em] text-[#c9a0a0] uppercase text-center mb-5">
        Catálogos disponibles
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center flex-wrap">
        {catalogs.map((cat) => (
          <Link
            key={cat.id}
            href={`/catalogo/${cat.slug}`}
            className="group relative rounded-2xl overflow-hidden flex-shrink-0 w-full sm:w-48"
          >
            {/* Image or gradient background */}
            <div className="aspect-[3/4] w-full">
              {cat.coverImageUrl ? (
                <img
                  src={cat.coverImageUrl}
                  alt={cat.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-[#f9e8e4] to-[#f0d0cc]" />
              )}
            </div>

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

            {/* Text */}
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <p className="text-white font-bold tracking-wide text-base leading-snug">
                {cat.name}
              </p>
              {cat.description && (
                <p className="text-white/70 text-xs mt-1 leading-snug line-clamp-2">
                  {cat.description}
                </p>
              )}
              <div className="flex items-center gap-1 mt-2 text-white/80 text-xs group-hover:text-white transition-colors">
                <span>Ver catálogo</span>
                <ArrowRight className="w-3 h-3 translate-x-0 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
