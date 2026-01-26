'use client';
import { Header } from "@/app/components/header";
import { Product } from '@/types/product';
import { HeaderImage } from "@/app/components/header-image";
import { ProductGrid } from "@/app/components/product-grid";
import { useRouter } from 'next/navigation'

export default function Catalog() {
    const router = useRouter()
    
    const handleProductClick = (product: Product) => {
        router.push(`/catalogo/san-valentin/2026/${product.id}`);
    };

    return (
         <div className="min-h-screen bg-white">
            <Header/>
            <main>
                <HeaderImage/>
                <ProductGrid onProductClick={handleProductClick}/>
            </main>
            
         </div>
    )
}
