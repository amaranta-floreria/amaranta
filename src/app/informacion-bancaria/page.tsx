'use client';
import localFont from 'next/font/local';
import Link from 'next/link';
import { motion } from 'motion/react';
import { useState } from 'react';
import { Copy, Check, ArrowLeft } from 'lucide-react';

const avenir = localFont({ src: '../../../public/fonts/avenir_next.ttf' });

const ease = [0.16, 1, 0.3, 1] as const;

const PAYMENT_METHODS = [
  {
    id: 'oxxo',
    bank: 'OXXO',
    type: 'Depósito en efectivo',
    numberLabel: 'Número de tarjeta',
    number: '4217 4700 2118 8921',
    rawNumber: '4217470021188921',
    name: 'Vanessa Urzúa',
    accountType: 'Débito',
  },
  {
    id: 'bbva',
    bank: 'BBVA',
    type: 'Transferencia',
    numberLabel: 'CLABE interbancaria',
    number: '012180 015302 741892',
    rawNumber: '012180015302741892',
    name: 'Vanessa Urzúa',
    accountType: 'Débito',
  },
];

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-1.5 transition-all duration-300 select-none"
      style={{ color: copied ? '#d89f94' : '#c9a8a0' }}
      aria-label="Copiar número"
    >
      <motion.span
        key={copied ? 'check' : 'copy'}
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.18 }}
      >
        {copied ? (
          <Check size={13} strokeWidth={1.5} />
        ) : (
          <Copy size={13} strokeWidth={1.5} />
        )}
      </motion.span>
      <span className="text-[9px] tracking-[0.22em] uppercase">
        {copied ? 'Copiado' : 'Copiar'}
      </span>
    </button>
  );
}

export default function BankInformation() {
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
      <main className="flex-1 flex flex-col items-center px-5 pt-6 pb-12 w-full max-w-sm mx-auto">
        {/* Title block */}
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15, ease }}
        >
          <p className="text-[9px] tracking-[0.38em] uppercase text-[#c9a8a0] mb-3">
            Formas de pago
          </p>
          <h1 className="text-[26px] font-light text-[#2d1f1a] leading-snug">
            Información<br />Bancaria
          </h1>
          <motion.div
            className="h-px bg-[#e8c4b8] mx-auto mt-5"
            initial={{ width: 0 }}
            animate={{ width: 40 }}
            transition={{ duration: 0.8, delay: 0.45, ease }}
          />
        </motion.div>

        {/* Cards */}
        <div className="w-full space-y-4">
          {PAYMENT_METHODS.map((method, i) => (
            <motion.div
              key={method.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.35 + i * 0.18, ease }}
            >
              <div
                className="rounded-2xl px-6 py-7 relative overflow-hidden"
                style={{
                  background: 'rgba(255, 252, 250, 0.9)',
                  border: '1px solid #edd8d0',
                  boxShadow: '0 4px 24px rgba(216, 159, 148, 0.07), 0 1px 4px rgba(216, 159, 148, 0.06)',
                }}
              >
                {/* Decorative circle */}
                <div
                  className="absolute -top-8 -right-8 w-36 h-36 rounded-full pointer-events-none"
                  style={{
                    background: 'radial-gradient(circle, #f5ddd7 0%, transparent 70%)',
                    opacity: 0.5,
                  }}
                />

                {/* Bank name + badge */}
                <div className="flex items-start justify-between mb-1 relative">
                  <div>
                    <p className="text-[8px] tracking-[0.32em] uppercase text-[#c9a8a0] mb-1.5">
                      {method.type}
                    </p>
                    <h2 className="text-[24px] font-medium tracking-wider text-[#2d1f1a]">
                      {method.bank}
                    </h2>
                  </div>
                  <span
                    className="text-[8px] tracking-[0.18em] uppercase px-2.5 py-1 rounded-full mt-1.5"
                    style={{ background: '#f5ddd7', color: '#b09890' }}
                  >
                    {method.accountType}
                  </span>
                </div>

                {/* Divider */}
                <div className="h-px bg-[#f0d5cc] my-5" />

                {/* Account number */}
                <div className="mb-5">
                  <p className="text-[8px] tracking-[0.3em] uppercase text-[#c9a8a0] mb-2">
                    {method.numberLabel}
                  </p>
                  <div className="flex items-center justify-between gap-3">
                    <p
                      className="text-[15px] tracking-[0.1em] text-[#2d1f1a] font-medium leading-none"
                      style={{ fontVariantNumeric: 'tabular-nums' }}
                    >
                      {method.number}
                    </p>
                    <CopyButton text={method.rawNumber} />
                  </div>
                </div>

                {/* Name */}
                <div>
                  <p className="text-[8px] tracking-[0.3em] uppercase text-[#c9a8a0] mb-1.5">
                    Titular
                  </p>
                  <p className="text-[13px] tracking-wide text-[#7a5c56]">
                    {method.name}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Note */}
        <motion.p
          className="text-center text-[9px] tracking-[0.18em] uppercase text-[#c9a8a0] mt-10 leading-[2.2]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.75 }}
        >
          Una vez realizado el pago,<br />
          envía tu comprobante por WhatsApp
        </motion.p>
      </main>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.9 }}
        className="py-6 flex justify-center"
      >
        <p className="text-[9px] tracking-[0.22em] uppercase text-[#e0c4ba]">
          Amaranta Florería
        </p>
      </motion.footer>
    </div>
  );
}
