'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/app/components/header';
import { ProductGrid } from '@/app/components/product-grid';
import { getCatalogBySlug, getProductsByCatalog, FirestoreCatalog, AdminProduct } from '@/lib/firestore';
import { Product } from '@/types/product';
import { ArrowLeft } from 'lucide-react';

interface Props {
  params: { slug: string };
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
      if (!cat) { setNotFound(true); setLoading(false); return; }
      setCatalog(cat);
      setProducts(prods);
      setLoading(false);
    }
    load().catch(() => { setNotFound(true); setLoading(false); });
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-6 h-6 rounded-full border-2 border-rose-300 border-t-transparent animate-spin" />
      </div>
    );
  }

  if (notFound || !catalog) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Catálogo no disponible.</p>
          <button
            onClick={() => router.push('/')}
            className="flex items-center gap-2 text-rose-500 hover:text-rose-600 mx-auto"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        {/* Hero */}
        <section className="relative overflow-hidden bg-gradient-to-b from-rose-50/50 to-white">
          <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="py-12 sm:py-16 lg:py-20">
              {catalog.coverImageUrl && (
                <div className="relative h-48 sm:h-64 lg:h-80 rounded-2xl overflow-hidden mb-8">
                  <img
                    src={catalog.coverImageUrl}
                    alt={catalog.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                </div>
              )}
            </div>
          </div>
        </section>

        <div className="text-center space-y-2 pb-2">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl text-gray-800 tracking-tight">
            {catalog.name}
          </h2>
          {catalog.description && (
            <p className="text-gray-500 text-base">{catalog.description}</p>
          )}
        </div>

        <ProductGrid
          products={products as unknown as Product[]}
          onProductClick={(p) => router.push(`/catalogo/${slug}/${p.id}`)}
        />
      </main>
    </div>
  );
}
