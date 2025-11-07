/**
 * Font Configuration using next/font/local
 *
 * This file defines local font loading with Next.js font optimization.
 * NOTE: Actual font files need to be placed in /public/fonts/
 * Currently using fallback to system fonts until real woff2 files are available.
 */

import localFont from 'next/font/local';

// Arabic serif font - Amiri
export const amiri = localFont({
  src: [
    {
      path: '../../public/fonts/amiri-400.woff2',
      weight: '400',
      style: 'normal',
    },
  ],
  variable: '--font-amiri',
  display: 'swap',
  preload: true,
  fallback: ['serif'],
  adjustFontFallback: 'Times New Roman',
});

// Arabic sans-serif font - Cairo
export const cairo = localFont({
  src: [
    {
      path: '../../public/fonts/cairo-400.woff2',
      weight: '400',
      style: 'normal',
    },
  ],
  variable: '--font-cairo',
  display: 'swap',
  preload: true,
  fallback: ['sans-serif'],
  adjustFontFallback: 'Arial',
});

// English serif font - Literata
export const literata = localFont({
  src: [
    {
      path: '../../public/fonts/literata-400.woff2',
      weight: '400',
      style: 'normal',
    },
  ],
  variable: '--font-literata',
  display: 'swap',
  preload: true,
  fallback: ['serif'],
  adjustFontFallback: 'Times New Roman',
});

// Monospace font - Source Code Pro
export const sourceCodePro = localFont({
  src: [
    {
      path: '../../public/fonts/source-code-pro-400.woff2',
      weight: '400',
      style: 'normal',
    },
  ],
  variable: '--font-source-code-pro',
  display: 'swap',
  preload: true,
  fallback: ['monospace'],
  adjustFontFallback: 'Courier New',
});

/**
 * To use these fonts in layout.tsx:
 *
 * import { amiri, cairo, literata, sourceCodePro } from './fonts';
 *
 * <html className={`${amiri.variable} ${cairo.variable} ${literata.variable} ${sourceCodePro.variable}`}>
 *
 * Then in globals.css:
 *
 * @layer base {
 *   :root {
 *     --font-body: var(--font-cairo);
 *     --font-headline: var(--font-amiri);
 *     --font-serif: var(--font-literata);
 *     --font-mono: var(--font-source-code-pro);
 *   }
 * }
 */
