'use client';
import localFont from 'next/font/local';
import Link from 'next/link';
import { motion } from 'motion/react';
import { ArrowLeft, Instagram } from 'lucide-react';

const avenir = localFont({ src: '../../../public/fonts/avenir_next.ttf' });

const ease = [0.16, 1, 0.3, 1] as const;

const TIPS = [
  {
    number: '01',
    text: 'Mantén sus pétalos limpios.',
  },
  {
    number: '02',
    text: 'Todos los días añade una taza de agua con delicadeza evitando mojar los pétalos.',
  },
  {
    number: '03',
    text: 'Evita exponerlas al sol directo o corrientes de aire.',
  },
];

export default function BoxCare() {
  return (
    <div
      className={`min-h-screen flex flex-col text-[#2d1f1a] ${avenir.className}`}
      style={{
        background: '#fdf8f5',
        backgroundImage:
          'radial-gradient(ellipse 70% 45% at 50% 0%, #f5ddd7 0%, transparent 65%)',
      }}
    >
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease }}
        className="pt-6 pb-4 px-6 flex items-center justify-center relative"
      >
        <Link
          href="/"
          className="absolute left-6 flex items-center gap-1.5 text-[10px] tracking-[0.2em] uppercase text-[#b09890] hover:text-[#d89f94] transition-colors duration-300"
        >
          <ArrowLeft size={12} strokeWidth={1.5} />
          Inicio
        </Link>
        <span className="text-[10px] tracking-[0.28em] uppercase text-[#b09890]">
          Amaranta
        </span>
      </motion.header>

      {/* Main */}
      <main className="flex-1 flex flex-col items-center px-6 pt-6 pb-14 w-full max-w-sm mx-auto">
        {/* Title block */}
        <motion.div
          className="text-center mb-9"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15, ease }}
        >
          <p className="text-[9px] tracking-[0.38em] uppercase text-[#c9a8a0] mb-3">
            Guía de cuidados
          </p>
          <h1 className="text-[26px] font-light text-[#2d1f1a] leading-snug">
            Cuidados<br />de Cajas
          </h1>
          <motion.div
            className="h-px bg-[#e8c4b8] mx-auto mt-5"
            initial={{ width: 0 }}
            animate={{ width: 40 }}
            transition={{ duration: 0.8, delay: 0.45, ease }}
          />
        </motion.div>

        {/* Intro */}
        <motion.p
          className="text-center text-[12px] leading-[1.85] text-[#7a5c56] mb-10 px-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.4 }}
        >
          Haz que este momento dure mucho. Sigue nuestros tips para que conserves tus flores bonitas el mayor tiempo posible.
        </motion.p>

        {/* Tips list */}
        <div className="w-full">
          <div className="h-px bg-[#edd8d0] w-full" />

          {TIPS.map((tip, i) => (
            <motion.div
              key={tip.number}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.55, delay: 0.5 + i * 0.13, ease }}
            >
              <div className="flex items-start gap-5 py-6">
                <span
                  className="text-[30px] leading-none font-light tabular-nums shrink-0 pt-0.5"
                  style={{ color: '#e8c4b8' }}
                >
                  {tip.number}
                </span>
                <p className="text-[13px] leading-[1.8] text-[#2d1f1a] pt-1.5">
                  {tip.text}
                </p>
              </div>
              <div className="h-px bg-[#edd8d0] w-full" />
            </motion.div>
          ))}
        </div>

        {/* Closing note */}
        <motion.p
          className="text-center text-[12px] leading-[1.9] text-[#d89f94] mt-10 mb-8 px-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.82 }}
        >
          ¡Listo! Disfrútalas mucho y no olvides<br />etiquetarnos en tus fotos ♥
        </motion.p>

        {/* Social handles */}
        <motion.div
          className="flex flex-col items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.92 }}
        >
          <div className="flex items-center gap-2">
            <Instagram size={11} strokeWidth={1.5} color="#b09890" />
            <span className="text-[9px] tracking-[0.22em] uppercase text-[#b09890]">
              _amarantafloreria
            </span>
          </div>
          <span className="text-[9px] tracking-[0.18em] text-[#c9a8a0]">
            312 214 19 45
          </span>
        </motion.div>
      </main>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1.0 }}
        className="py-6 flex justify-center"
      >
        <p className="text-[9px] tracking-[0.22em] uppercase text-[#e0c4ba]">
          Amaranta Florería
        </p>
      </motion.footer>
    </div>
  );
}
