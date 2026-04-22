'use client';
import { Header } from "@/app/components/header";
import { Product } from '@/types/product';
import { HeaderImage } from "@/app/components/header-image";
import { ProductGrid } from "@/app/components/product-grid";
import { useRouter } from 'next/navigation'
import { catalog } from "@/data/catalog-mothers-day";

export default function Catalog() {
    const router = useRouter()
    
    const handleProductClick = (product: Product) => {
        router.push(`/catalogo/dia-de-las-madres/2026/${product.id}`);
    };

    return (
         <div className="min-h-screen bg-white">
            <Header/>
            <main>
                <HeaderImage/>
                <div className="text-center space-y-3">
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl text-gray-800 tracking-tight">
                      Día de las madres 
                    </h2>
                </div>
                <ProductGrid products={catalog} onProductClick={handleProductClick}/>
            </main>
            
         </div>
    )
}
