'use client'
import { catalog } from "@/data/catalog";
import { ArrowLeft, ShoppingCart } from "lucide-react";
import { useRouter } from 'next/navigation'

interface Props {
  params: {
    productId: string;
  };
}

export default function  ProductDetailPage({ params }: Props) {
const router = useRouter()
    const { productId } = params;
  const product = catalog.find((p) => p.id === productId);

  if (!product) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl text-gray-800 mb-4">Product Not Found</h1>
          <div  className="text-rose-500 hover:text-rose-600 font-medium flex items-center justify-center gap-2">
            <ArrowLeft className="w-4 h-4" onClick={() => router.push(`/catalogo/flores-amarillas/2026`)}/>
            Back to Home
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 px-4 h-16 flex items-center justify-between">
        <div 
          className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors text-gray-700"
          aria-label="Back to home"
        >
          <ArrowLeft className="w-6 h-6" onClick={() => router.push(`/catalogo/flores-amarillas/2026`)} />
        </div>
        <span className="text-lg font-medium tracking-wide text-gray-800 truncate px-4">
          {product.name}
        </span>
        <div className="w-10" /> {/* Spacer for visual balance */}
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
          {/* Header Info */}
          <div className="space-y-4">
            <div className="inline-block px-3 py-1 bg-rose-50 text-rose-600 text-sm font-medium rounded-full">
              Flores Amarillas
            </div>
            
            <div className="flex flex-col gap-2">
              <h1 className="text-3xl sm:text-4xl text-gray-900 font-light">
                {product.name}
              </h1>
              <p className="text-2xl sm:text-3xl text-rose-500 font-medium">
                ${product.price.toFixed(2)}
              </p>
            </div>
          </div>

          <div className="h-px bg-gray-100" />

          <div className="space-y-3">
            <h3 className="text-lg text-gray-900 font-medium">{product.description}</h3>
            <p className="text-gray-600 leading-relaxed text-lg whitespace-pre-line">
              {product.longDescription}
            </p>
          </div>

          <div className="bg-gray-50 rounded-2xl p-6 space-y-3 text-gray-600">
            <div className="flex items-center gap-3">
              <span className="text-rose-400">✓</span>
              <span>Flores frescas</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-rose-400">✓</span>
              <span>Disponibilidad limitada</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-rose-400">✓</span>
              <span>Incluye una carta para dejar un mensaje</span>
            </div>
            <div className="flex items-center gap-3">
              <span><strong>Importante: Flores podrian variar segun disponibilidad</strong></span>
            </div>
          </div>
        </div>
      </main>
     
      {/* Add padding to bottom of main to account for fixed footer */}
      <div className="h-24 sm:h-0" />
    </div>
  );
}
