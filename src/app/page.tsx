'use client';
import Image from 'next/image';
import localFont from 'next/font/local';
import Link from 'next/link';
import { motion } from 'motion/react';
import { CatalogList } from './components/CatalogList';

const avenir = localFont({ src: '../../public/fonts/avenir_next.ttf' });

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

export default function Home() {
  return (
    <div
      className={`min-h-screen flex flex-col text-[#2d1f1a] ${avenir.className}`}
      style={{
        background: '#fdf8f5',
        backgroundImage:
          'radial-gradient(ellipse 70% 45% at 50% 0%, #f5ddd7 0%, transparent 65%)',
      }}
    >
      {/* ── Top nav ── */}
      <motion.header
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease }}
        className="pt-6 pb-4 px-6 flex justify-center"
      >
        <nav className="flex items-center flex-wrap justify-center gap-x-5 gap-y-2">
          {NAV.map((item, i) => (
            <span key={item.href} className="flex items-center gap-5">
              {i > 0 && (
                <span className="hidden sm:block w-px h-3 bg-[#e8c4b8]" aria-hidden />
              )}
              <Link
                href={item.href}
                className="text-[10px] tracking-[0.22em] uppercase text-[#b09890] hover:text-[#d89f94] transition-colors duration-300"
              >
                {item.label}
              </Link>
            </span>
          ))}
        </nav>
      </motion.header>

      {/* ── Hero ── */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-10">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.15, ease }}
        >

          <img
            src="/amaranta_logo_letras.png"
            alt="Amaranta"
            className="size-60 object-center transition-transform duration-700 group-hover:scale-105"
                  />
        
        </motion.div>

        {/* Animated divider */}
        <motion.div
          className="h-px bg-[#e8c4b8] origin-center mb-10"
          initial={{ scaleX: 0, width: 48 }}
          animate={{ scaleX: 1, width: 48 }}
          transition={{ duration: 0.9, delay: 0.75, ease }}
        />

        {/* Catalog cards */}
        <motion.div
          className="w-full max-w-3xl"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1.0, ease: 'easeOut' }}
        >
          <CatalogList />
        </motion.div>
      </main>

      {/* ── Footer ── */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1.15 }}
        className="py-6 px-6 flex items-center justify-center gap-6"
      >
        {SOCIAL.map((item, i) => (
          <span key={item.href} className="flex items-center gap-6">
            {i > 0 && (
              <span className="w-px h-3 bg-[#e8c4b8]" aria-hidden />
            )}
            <Link
              href={item.href}
              target="_blank"
              rel="noreferrer"
              className="text-[10px] tracking-[0.22em] uppercase text-[#b09890] hover:text-[#d89f94] transition-colors duration-300"
            >
              {item.label}
            </Link>
          </span>
        ))}
      </motion.footer>
    </div>
  );
}
