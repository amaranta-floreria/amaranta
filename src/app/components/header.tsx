import { Menu, Flower2 } from "lucide-react";

export function Header() {
    return(
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
            <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center gap-2">
                        <Flower2 className="w-6 h-6 text-rose-400" strokeWidth={1.5} />
                        <span className="text-lg tracking-wide text-gray-800">Amaranta Floreria</span>
                    </div>
                </div>
            </div>
        </header>
    )
}