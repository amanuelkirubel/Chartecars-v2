/**
 * Charte Cars — single source of truth for platform fees.
 *
 * Put this file at: src/config/pricing.ts
 *
 * The listing verification fee used to be hard-coded as "50" in six
 * different files, which meant a price change had to be made in six places
 * (and one of them always got missed). Change it HERE only.
 */

// Mandatory one-time listing verification fee, in ETB.
export const LISTING_FEE_ETB = 600;

/** "600 ETB" / "600 ብር" — for inline use in UI copy. */
export const listingFeeLabel = (lang: 'en' | 'am'): string =>
  lang === 'am' ? `${LISTING_FEE_ETB} ብር` : `${LISTING_FEE_ETB} ETB`;
