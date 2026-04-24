'use client'
import { catalog } from "@/data/catalog-mothers-day";
import { Playfair_Display } from 'next/font/google';
import { ArrowLeft } from "lucide-react";
import { useRouter } from 'next/navigation';

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-playfair',
});

interface Props {
  params: {
    productId: string;
  };
}

export default function ProductDetailPage({ params }: Props) {
  const router = useRouter();
  const { productId } = params;
  const product = catalog.find((p) => p.id === productId);

  if (!product) {
    return (
      <div className={`min-h-screen bg-[#fdfaf8] flex items-center justify-center p-4 ${playfair.variable}`}>
        <div className="text-center">
          <h1 className="font-serif text-2xl text-[#3d2a2a] mb-4">Producto no encontrado</h1>
          <div
            className="text-[#b5606a] hover:text-[#9a4f59] font-medium flex items-center justify-center gap-2 cursor-pointer"
            onClick={() => router.push('/catalogo/dia-de-las-madres/2026')}
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al catálogo
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-[#fdfaf8] ${playfair.variable}`}>
      {/* Navigation Header */}
      <header className="sticky top-0 z-50 bg-[#fdf8f5]/90 backdrop-blur-md border-b border-rose-100 px-4 h-16 flex items-center justify-between">
        <div
          className="p-2 -ml-2 rounded-full hover:bg-rose-50 transition-colors text-[#b5606a] cursor-pointer"
          aria-label="Volver al catálogo"
          onClick={() => router.push('/catalogo/dia-de-las-madres/2026')}
        >
          <ArrowLeft className="w-6 h-6" />
        </div>
        <span className="font-serif text-base tracking-wide text-[#3d2a2a] truncate px-4">
          {product.name}
        </span>
        <div className="w-10" />
      </header>

      <main className="pb-8">
        {/* Product Image */}
        <div className="relative aspect-square sm:aspect-[4/3] w-full overflow-hidden bg-rose-50">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Product Content */}
        <div className="max-w-screen-md mx-auto p-6 sm:p-8 space-y-8">
          {/* Header Info */}
          <div className="space-y-4">
            <div className="inline-block px-3 py-1 bg-rose-50 text-[#b5606a] text-sm font-medium rounded-full border border-[#e8c4bc]">
              Día de las Madres 2026
            </div>

            <div className="flex flex-col gap-2">
              <h1 className="font-serif font-normal text-3xl sm:text-4xl text-[#3d2a2a]">
                {product.name}
              </h1>
              <p className="text-2xl sm:text-3xl text-[#b5606a] font-medium">
                ${product.price.toLocaleString('es-MX')}
              </p>
            </div>
          </div>

          <div className="h-px bg-rose-100" />

          <div className="space-y-3">
            <h3 className="text-sm text-[#b5606a] font-medium">{product.description}</h3>
            <p className="text-gray-700 leading-relaxed text-base whitespace-pre-line">
              {product.longDescription}
            </p>
          </div>

          <div className="bg-[#fdf0ec] rounded-2xl p-6 space-y-3 text-gray-800">
            <p className="text-xs uppercase tracking-widest text-[#b5606a] font-medium mb-4">Detalles</p>
            <div className="flex items-center gap-3">
              <span className="text-[#b5606a]">✓</span>
              <span>Flores frescas</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[#b5606a]">✓</span>
              <span>Disponibilidad limitada</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[#b5606a]">✓</span>
              <span>Incluye una carta para dejar un mensaje</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[#b5606a]">✓</span>
              <span><strong>Importante: Flores podrían variar según disponibilidad</strong></span>
            </div>
          </div>
        </div>
      </main>

      <div className="h-24 sm:h-0" />
    </div>
  );
}
