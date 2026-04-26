'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getProductsByCatalog, AdminProduct } from '@/lib/firestore';
import { ArrowLeft } from 'lucide-react';

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
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-6 h-6 rounded-full border-2 border-rose-300 border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl text-gray-800 mb-4">Producto no encontrado</h1>
          <button
            onClick={() => router.push(`/catalogo/${slug}`)}
            className="text-rose-500 hover:text-rose-600 font-medium flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al catálogo
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 px-4 h-16 flex items-center justify-between">
        <div
          className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors text-gray-700 cursor-pointer"
          onClick={() => router.push(`/catalogo/${slug}`)}
          aria-label="Volver al catálogo"
        >
          <ArrowLeft className="w-6 h-6" />
        </div>
        <span className="text-lg font-medium tracking-wide text-gray-800 truncate px-4">
          {product.name}
        </span>
        <div className="w-10" />
      </header>

      <main className="pb-8">
        {/* Product Image */}
        <div className="relative aspect-square sm:aspect-[4/3] w-full overflow-hidden bg-gray-50">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Product Content */}
        <div className="max-w-screen-md mx-auto p-6 sm:p-8 space-y-8">
          <div className="space-y-4">
            <div className="inline-block px-3 py-1 bg-rose-50 text-rose-600 text-sm font-medium rounded-full">
              {slug.replace(/-/g, ' ')}
            </div>
            <div className="flex flex-col gap-2">
              <h1 className="text-3xl sm:text-4xl text-gray-900 font-light">
                {product.name}
              </h1>
              <p className="text-2xl sm:text-3xl text-rose-500 font-medium">
                ${product.price.toLocaleString('es-MX')}
              </p>
            </div>
          </div>

          <div className="h-px bg-gray-100" />

          <div className="space-y-3">
            {product.description && (
              <h3 className="text-sm text-rose-500 font-medium">{product.description}</h3>
            )}
            <p className="text-gray-600 leading-relaxed text-base whitespace-pre-line">
              {product.longDescription}
            </p>
          </div>

          <div className="bg-gray-50 rounded-2xl p-6 space-y-3 text-gray-800">
            <p className="text-xs uppercase tracking-widest text-rose-400 font-medium mb-4">Detalles</p>
            {[
              'Flores frescas',
              'Disponibilidad limitada',
              'Incluye una carta para dejar un mensaje',
            ].map((item) => (
              <div key={item} className="flex items-center gap-3">
                <span className="text-rose-400">✓</span>
                <span>{item}</span>
              </div>
            ))}
            <div className="flex items-center gap-3">
              <span className="text-rose-400">✓</span>
              <span><strong>Importante: Flores podrían variar según disponibilidad</strong></span>
            </div>
          </div>
        </div>
      </main>

      <div className="h-24 sm:h-0" />
    </div>
  );
}
