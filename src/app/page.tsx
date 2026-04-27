'use client';
import localFont from 'next/font/local';
import { Fraunces } from 'next/font/google';
import Link from 'next/link';
import { motion } from 'motion/react';
import { CatalogList } from './components/CatalogList';

const avenir = localFont({ src: '../../public/fonts/avenir_next.ttf' });
const fraunces = Fraunces({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  style: ['normal', 'italic'],
});

const ease = [0.16, 1, 0.3, 1] as const;

const NAV = [
  { label: 'Información bancaria', href: '/informacion-bancaria' },
  { label: 'Cuidado de ramos', href: '/cuidados-de-ramos' },
  { label: 'Cuidado de cajas', href: '/cuidados-de-cajas' },
];

const SOCIAL = [
  { label: 'Instagram', href: 'https://www.instagram.com/_amarantafloreria/' },
  { label: 'WhatsApp', href: 'https://api.whatsapp.com/message/FNMQNSMSPFDLE1?autoload=1&app_absent=0' },
];

// — paper grain via inline SVG, kept tiny so it tiles
const GRAIN_URI =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.42  0 0 0 0 0.12  0 0 0 0 0.17  0 0 0 0.06 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")";

export default function Home() {
  return (
    <div
      className={`${avenir.className} relative min-h-screen text-[#2d1f1a] overflow-hidden`}
      style={{ background: '#fbf3ee' }}
    >
      {/* warm wash */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 65% 55% at 18% 8%, #f6dcd2 0%, transparent 55%), radial-gradient(ellipse 55% 50% at 92% 92%, #efd6d2 0%, transparent 60%)',
        }}
      />
      {/* grain */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.55] mix-blend-multiply"
        style={{ backgroundImage: GRAIN_URI }}
      />

      {/* ── Eyebrow / masthead ── */}
      <motion.header
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease }}
        className="relative z-10 px-6 sm:px-10 pt-6"
      >
        <div className="flex items-center justify-between text-[10px] tracking-[0.32em] uppercase text-[#7a4f4a]">
          <span className="flex items-center gap-3">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#6b1e2c]" />
            <span>Amaranta · Florería</span>
          </span>
          <span className="hidden sm:inline">Colima, México — MMXXVI</span>
          <span className="sm:hidden">Colima, MX</span>
        </div>
        <div className="mt-4 h-px w-full bg-[#e2c5bd]" />
      </motion.header>

      {/* ── Hero ── */}
      <main className="relative z-10 px-6 sm:px-10 pt-10 sm:pt-16">
        {/* issue marker */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex items-baseline gap-3 mb-6"
        >
          <span className="text-[10px] tracking-[0.3em] uppercase text-[#a08379]">
            Floreria
          </span>
        </motion.div>

        {/* wordmark + mark */}
        <div className="grid grid-cols-12 items-end gap-4 sm:gap-8">
          <div className="col-span-12 lg:col-span-9">
            <motion.h1
              className={`${fraunces.className} font-light italic text-[#2d1f1a] leading-[0.86] tracking-[-0.02em]`}
              style={{ fontSize: 'clamp(72px, 16vw, 240px)' }}
              initial={{ opacity: 0, filter: 'blur(14px)', y: 16 }}
              animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
              transition={{ duration: 1.2, delay: 0.35, ease }}
            >
              Amaranta
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 1.05, ease }}
              className="mt-6 sm:mt-8 flex items-center gap-4"
            >
              <span className="block w-10 h-px bg-[#6b1e2c]" />
              <p
                className={`${fraunces.className} italic text-[#5a3d36] text-[18px] sm:text-[22px] leading-snug`}
              >
                flores que sostienen el instante.
              </p>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 1.25 }}
              className="mt-5 max-w-md text-[12px] tracking-[0.18em] uppercase text-[#9a7e75]"
            >
              Ramos · Cajas · Arreglos por encargo
            </motion.p>
          </div>

          {/* logo mark — colophon style */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.7, ease }}
            className="hidden lg:flex col-span-3 justify-end pb-4"
          >
            <div className="flex flex-col items-center gap-3">
              <img
                src="/amaranta_logo.png"
                alt=""
                className="w-24 h-24 object-contain opacity-90"
              />
              <span className="text-[9px] tracking-[0.34em] uppercase text-[#a08379]">
                Estudio floral
              </span>
            </div>
          </motion.div>
        </div>

        {/* ── Index section ── */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.35, ease }}
          className="mt-20 sm:mt-28"
        >
          <div className="flex items-center gap-4 mb-8">
            
            <span className="block h-px flex-1 bg-[#e2c5bd]" />
            <span className="text-[10px] tracking-[0.3em] uppercase text-[#a08379]">
              Catálogos vigentes
            </span>
          </div>

          <CatalogList />
        </motion.section>
      </main>

      {/* ── Colophon / footer ── */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1.6 }}
        className="relative z-10 mt-24 px-6 sm:px-10 pb-10"
      >
        <div className="h-px w-full bg-[#e2c5bd] mb-6" />
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <nav className="flex flex-wrap gap-x-5 gap-y-2">
            {NAV.map((item, i) => (
              <span key={item.href} className="flex items-center gap-5">
                {i > 0 && (
                  <span className="hidden sm:block w-px h-2.5 bg-[#d4b8b0]" aria-hidden />
                )}
                <Link
                  href={item.href}
                  className="text-[10px] tracking-[0.26em] uppercase text-[#7a4f4a] hover:text-[#6b1e2c] transition-colors duration-300"
                >
                  {item.label}
                </Link>
              </span>
            ))}
          </nav>
          <div className="flex items-center gap-5">
            {SOCIAL.map((item, i) => (
              <span key={item.href} className="flex items-center gap-5">
                {i > 0 && (
                  <span className="w-px h-2.5 bg-[#d4b8b0]" aria-hidden />
                )}
                <Link
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[10px] tracking-[0.26em] uppercase text-[#6b1e2c] hover:text-[#2d1f1a] transition-colors duration-300"
                >
                  {item.label}
                </Link>
              </span>
            ))}
          </div>
        </div>
      </motion.footer>
    </div>
  );
}
