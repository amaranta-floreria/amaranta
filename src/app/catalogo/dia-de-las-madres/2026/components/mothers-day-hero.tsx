export function MothersDayHero() {
  return (
    <section className="bg-gradient-to-br from-[#fdf0ec] via-[#f9e8e4] to-[#f5e0d8]">
      <div className="max-w-screen-xl mx-auto px-6 sm:px-8 lg:px-12 py-14 sm:py-20">
        <div className="flex flex-col-reverse sm:flex-row items-center gap-10 sm:gap-16">

          {/* Text column */}
          <div className="flex-1 text-center sm:text-left space-y-6">
            <p className="text-xs tracking-[0.22em] uppercase text-[#b5606a] font-medium">
              Florería Amaranta · 2026
            </p>

            <h1 className="font-serif italic text-[#3d2a2a] text-5xl sm:text-6xl lg:text-7xl leading-[1.08]">
              Día de las<br />Madres
            </h1>

            <div className="w-12 h-px bg-[#d4a8a0] sm:mx-0 mx-auto" />

            <p className="font-serif text-[#7a4f4f] text-lg sm:text-xl leading-relaxed max-w-sm sm:max-w-none">
              Flores que hablan cuando las palabras no alcanzan.
            </p>
          </div>

          {/* Image column */}
          <div className="w-full sm:w-auto sm:flex-shrink-0 sm:w-64 lg:w-80">
            <div className="relative aspect-[3/4] w-full max-w-[260px] mx-auto sm:max-w-none overflow-hidden rounded-2xl shadow-md">
              <img
                src="https://cns8nmi1edqdsaeg.public.blob.vercel-storage.com/portada.jpeg"
                alt="Arreglo floral Amaranta"
                className="w-full h-full object-cover object-[20%_44%]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#3d2a2a]/25 to-transparent rounded-2xl" />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
