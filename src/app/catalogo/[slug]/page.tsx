'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import localFont from 'next/font/local';
import Link from 'next/link';
import { motion } from 'motion/react';
import {
  getCatalogBySlug,
  getProductsByCatalog,
  FirestoreCatalog,
  AdminProduct,
} from '@/lib/firestore';
import { ArrowLeft } from 'lucide-react';

const avenir = localFont({ src: '../../../../public/fonts/avenir_next.ttf' });

const ease = [0.16, 1, 0.3, 1] as const;

interface Props {
  params: { slug: string };
}

function ProductCard({
  product,
  onClick,
}: {
  product: AdminProduct;
  onClick: () => void;
}) {
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className="group w-full text-left"
    >
      <div
        className="rounded-2xl overflow-hidden"
        style={{
          background: 'rgba(255, 252, 250, 0.95)',
          border: '1px solid #edd8d0',
          boxShadow: '0 2px 16px rgba(216, 159, 148, 0.07)',
        }}
      >
        <div className="aspect-square overflow-hidden">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        <div className="px-3.5 py-3">
          <p className="text-[12px] leading-snug text-[#2d1f1a] line-clamp-2 mb-1.5">
            {product.name}
          </p>
          <p className="text-[14px] font-medium text-[#d89f94]">
            ${product.price.toLocaleString('es-MX')}
          </p>
        </div>
      </div>
    </motion.button>
  );
}

export default function DynamicCatalogPage({ params }: Props) {
  const { slug } = params;
  const router = useRouter();
  const [catalog, setCatalog] = useState<FirestoreCatalog | null>(null);
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    async function load() {
      const [cat, prods] = await Promise.all([
        getCatalogBySlug(slug),
        getProductsByCatalog(slug),
      ]);
      if (!cat) {
        setNotFound(true);
        setLoading(false);
        return;
      }
      setCatalog(cat);
      setProducts(prods.filter((p) => p.active !== false));
      setLoading(false);
    }
    load().catch(() => {
      setNotFound(true);
      setLoading(false);
    });
  }, [slug]);

  if (loading) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${avenir.className}`}
        style={{ background: '#fdf8f5' }}
      >
        <div className="w-4 h-4 rounded-full border-[1.5px] border-[#d89f94] border-t-transparent animate-spin" />
      </div>
    );
  }

  if (notFound || !catalog) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center p-6 ${avenir.className}`}
        style={{ background: '#fdf8f5' }}
      >
        <div className="text-center">
          <p className="text-[13px] tracking-wide text-[#b09890] mb-6">
            Catálogo no disponible.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-[10px] tracking-[0.2em] uppercase text-[#b09890] hover:text-[#d89f94] transition-colors"
          >
            <ArrowLeft size={12} strokeWidth={1.5} />
            Volver al inicio
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen flex flex-col text-[#2d1f1a] ${avenir.className}`}
      style={{
        background: '#fdf8f5',
        backgroundImage:
          'radial-gradient(ellipse 70% 35% at 50% 0%, #f5ddd7 0%, transparent 60%)',
      }}
    >
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease }}
        className="pt-6 pb-4 px-6 flex items-center justify-center relative"
      >
        <Link
          href="/"
          className="absolute left-6 flex items-center gap-1.5 text-[10px] tracking-[0.2em] uppercase text-[#b09890] hover:text-[#d89f94] transition-colors duration-300"
        >
          <ArrowLeft size={12} strokeWidth={1.5} />
          Inicio
        </Link>
        <span className="text-[10px] tracking-[0.28em] uppercase text-[#b09890]">
          Amaranta
        </span>
      </motion.header>

      <main className="flex-1 flex flex-col items-center px-5 pt-4 pb-14 w-full max-w-2xl mx-auto">
        {/* Cover image */}
        {catalog.coverImageUrl && (
          <motion.div
            className="w-full rounded-2xl overflow-hidden mb-8"
            style={{ boxShadow: '0 4px 32px rgba(216, 159, 148, 0.15)' }}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease }}
          >
            <div className="aspect-[16/7] w-full">
              <img
                src={catalog.coverImageUrl}
                alt={catalog.name}
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>
        )}

        {/* Title */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: catalog.coverImageUrl ? 0.25 : 0.15, ease }}
        >
          <p className="text-[9px] tracking-[0.38em] uppercase text-[#c9a8a0] mb-2">
            Catálogo
          </p>
          <h1 className="text-[26px] font-light text-[#2d1f1a]">{catalog.name}</h1>
          {catalog.description && (
            <p className="text-[12px] leading-relaxed text-[#7a5c56] mt-3 max-w-xs mx-auto">
              {catalog.description}
            </p>
          )}
          <motion.div
            className="h-px bg-[#e8c4b8] mx-auto mt-5"
            initial={{ width: 0 }}
            animate={{ width: 40 }}
            transition={{ duration: 0.8, delay: 0.4, ease }}
          />
        </motion.div>

        {/* Products */}
        {products.length === 0 ? (
          <motion.p
            className="text-[12px] tracking-wide text-[#c9a8a0] mt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.45 }}
          >
            Próximamente...
          </motion.p>
        ) : (
          <motion.div
            className="w-full grid grid-cols-2 sm:grid-cols-3 gap-3"
            initial="hidden"
            animate="visible"
            variants={{
              visible: { transition: { staggerChildren: 0.07, delayChildren: 0.42 } },
            }}
          >
            {products.map((product) => (
              <motion.div
                key={product.id}
                variants={{
                  hidden: { opacity: 0, y: 16 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease } },
                }}
              >
                <ProductCard
                  product={product}
                  onClick={() => router.push(`/catalogo/${slug}/${product.id}`)}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </main>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="py-6 flex justify-center"
      >
        <p className="text-[9px] tracking-[0.22em] uppercase text-[#e0c4ba]">
          Amaranta Florería
        </p>
      </motion.footer>
    </div>
  );
}
