export function HeaderImage() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-rose-50/50 to-white">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-12 sm:py-16 lg:py-20">
          <div className="relative h-48 sm:h-64 lg:h-80 rounded-2xl overflow-hidden mb-8">
            <img
              src={"https://cns8nmi1edqdsaeg.public.blob.vercel-storage.com/sanvalentin2026/gerebera.png"}
              alt="Beautiful flowers"
              className="w-full h-full object-cover object-[20%_44%]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
          </div>

          {/* Tagline */}
          <div className="text-center space-y-3">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl text-gray-800 tracking-tight">
              Catálogo
            </h1>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
              San Valentin 2026
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
