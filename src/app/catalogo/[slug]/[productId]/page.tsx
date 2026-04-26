'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import localFont from 'next/font/local';
import Link from 'next/link';
import { motion } from 'motion/react';
import { getProductsByCatalog, AdminProduct } from '@/lib/firestore';
import { ArrowLeft } from 'lucide-react';

const avenir = localFont({ src: '../../../../../public/fonts/avenir_next.ttf' });

const ease = [0.16, 1, 0.3, 1] as const;

const WHATSAPP_NUMBER = '523122141945';

const DETAILS = [
  'Flores frescas',
  'Disponibilidad limitada',
  'Incluye carta para dejar un mensaje',
  'Flores podrían variar según disponibilidad',
];

interface Props {
  params: { slug: string; productId: string };
}

export default function DynamicProductDetailPage({ params }: Props) {
  const { slug, productId } = params;
  const router = useRouter();
  const [product, setProduct] = useState<AdminProduct | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProductsByCatalog(slug)
      .then((prods) => {
        setProduct(prods.find((p) => p.id === productId) ?? null);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [slug, productId]);

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

  if (!product) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center p-6 ${avenir.className}`}
        style={{ background: '#fdf8f5' }}
      >
        <div className="text-center">
          <p className="text-[13px] tracking-wide text-[#b09890] mb-6">
            Producto no disponible.
          </p>
          <button
            onClick={() => router.push(`/catalogo/${slug}`)}
            className="inline-flex items-center gap-1.5 text-[10px] tracking-[0.2em] uppercase text-[#b09890] hover:text-[#d89f94] transition-colors"
          >
            <ArrowLeft size={12} strokeWidth={1.5} />
            Volver al catálogo
          </button>
        </div>
      </div>
    );
  }

  const whatsappMessage = encodeURIComponent(
    `Hola! Me interesa este producto: ${product.name} ($${product.price.toLocaleString('es-MX')})`
  );
  const whatsappHref = `https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappMessage}`;

  return (
    <div
      className={`min-h-screen flex flex-col text-[#2d1f1a] ${avenir.className}`}
      style={{ background: '#fdf8f5' }}
    >
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease }}
        className="pt-6 pb-4 px-6 flex items-center justify-center relative"
      >
        <button
          onClick={() => router.push(`/catalogo/${slug}`)}
          className="absolute left-6 flex items-center gap-1.5 text-[10px] tracking-[0.2em] uppercase text-[#b09890] hover:text-[#d89f94] transition-colors duration-300"
        >
          <ArrowLeft size={12} strokeWidth={1.5} />
          Catálogo
        </button>
        <Link
          href="/"
          className="text-[10px] tracking-[0.28em] uppercase text-[#b09890] hover:text-[#d89f94] transition-colors duration-300"
        >
          Amaranta
        </Link>
      </motion.header>

      <main className="flex-1 flex flex-col items-center pb-10 w-full max-w-lg mx-auto">
        {/* Product image */}
        <motion.div
          className="w-full overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.1, ease }}
        >
          <div className="aspect-square w-full">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
        </motion.div>

        {/* Content */}
        <motion.div
          className="w-full px-6 pt-7"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.25, ease }}
        >
          {/* Catalog label */}
          <p className="text-[9px] tracking-[0.32em] uppercase text-[#c9a8a0] mb-3">
            {slug.replace(/-/g, ' ')}
          </p>

          {/* Name + price */}
          <h1 className="text-[22px] font-light leading-snug text-[#2d1f1a] mb-2">
            {product.name}
          </h1>
          <p className="text-[20px] font-medium text-[#d89f94] mb-6">
            ${product.price.toLocaleString('es-MX')}
          </p>

          {/* Divider */}
          <div className="h-px bg-[#edd8d0] mb-6" />

          {/* Description */}
          {(product.description || product.longDescription) && (
            <div className="mb-6 space-y-2">
              {product.description && (
                <p className="text-[12px] tracking-wide font-medium text-[#7a5c56]">
                  {product.description}
                </p>
              )}
              {product.longDescription && (
                <p className="text-[13px] leading-[1.8] text-[#5a4040] whitespace-pre-line">
                  {product.longDescription}
                </p>
              )}
            </div>
          )}

          {/* Details */}
          <div
            className="rounded-2xl p-5 mb-8 space-y-3"
            style={{
              background: 'rgba(255,252,250,0.95)',
              border: '1px solid #edd8d0',
            }}
          >
            <p className="text-[8px] tracking-[0.32em] uppercase text-[#c9a8a0] mb-4">
              Detalles
            </p>
            {DETAILS.map((item) => (
              <div key={item} className="flex items-start gap-3">
                <span className="text-[#d89f94] mt-0.5 text-[11px]">✦</span>
                <span className="text-[12px] leading-snug text-[#5a4040]">{item}</span>
              </div>
            ))}
          </div>

          {/* WhatsApp CTA */}
          <motion.a
            href={whatsappHref}
            target="_blank"
            rel="noreferrer"
            whileTap={{ scale: 0.98 }}
            className="flex items-center justify-center w-full rounded-2xl py-4 text-[11px] tracking-[0.28em] uppercase transition-opacity duration-300 hover:opacity-90"
            style={{
              background: '#d89f94',
              color: '#fff',
              boxShadow: '0 4px 20px rgba(216, 159, 148, 0.35)',
            }}
          >
            Pedir por WhatsApp
          </motion.a>
        </motion.div>
      </main>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.7 }}
        className="py-6 flex justify-center"
      >
        <p className="text-[9px] tracking-[0.22em] uppercase text-[#e0c4ba]">
          Amaranta Florería
        </p>
      </motion.footer>
    </div>
  );
}
