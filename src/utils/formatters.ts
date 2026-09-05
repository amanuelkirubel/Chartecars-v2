import { Currency } from '../types';
import { USD_TO_ETB_RATE, CONTACT_INFO } from '../data/mockListings';

export function formatPrice(amountInEtb: number, currency: Currency = 'ETB'): string {
  if (currency === 'USD') {
    const usd = Math.round(amountInEtb / USD_TO_ETB_RATE);
    return `$${usd.toLocaleString('en-US')}`;
  }
  return `${amountInEtb.toLocaleString('en-US')} ETB`;
}

export function formatCarPrice(amountInEtb: number, type: 'sale' | 'rent' = 'sale', currency: Currency = 'ETB', lang: 'en' | 'am' = 'en'): string {
  const base = formatPrice(amountInEtb, currency);
  if (type === 'rent') {
    return lang === 'am' ? `${base} / ቀን` : `${base} / day`;
  }
  return base;
}

export function formatPriceCompact(amountInEtb: number, currency: Currency = 'ETB'): string {
  if (currency === 'USD') {
    const usd = amountInEtb / USD_TO_ETB_RATE;
    if (usd >= 1000000) return `$${(usd / 1000000).toFixed(1)}M`;
    if (usd >= 1000) return `$${(usd / 1000).toFixed(0)}k`;
    return `$${Math.round(usd)}`;
  }

  if (amountInEtb >= 1000000) {
    const millions = amountInEtb / 1000000;
    return `${millions % 1 === 0 ? millions.toFixed(0) : millions.toFixed(1)}M ETB`;
  }
  if (amountInEtb >= 1000) {
    return `${Math.round(amountInEtb / 1000)}k ETB`;
  }
  return `${amountInEtb} ETB`;
}

// Strip spam / direct numbers so all inquiries stay organized through Charte Homes official desk
const CONTACT_PATTERN = /(\+?\d[\d\s\-()]{6,}\d)|(@[a-zA-Z0-9_]{3,})|(\bt\.me\/\S+)|(\btelegram\b)|(\bwhatsapp\b)|(\btiktok\b)|(\b[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}\b)/gi;

export function sanitizeListingText(text: string): string {
  return String(text || '')
    .replace(CONTACT_PATTERN, '')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

export function createWhatsAppInquiryLink(propertyTitle: string, priceEtb: number, propertyId: string, phone: string = CONTACT_INFO.whatsappNumber): string {
  const text = `Hello Charte Homes! I am interested in viewing this property on your website:\n\n*${propertyTitle}*\nPrice: ${priceEtb.toLocaleString()} ETB\nRef ID: #${propertyId}\n\nPlease let me know when we can schedule a visit.`;
  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
}

export function createTelegramInquiryLink(propertyTitle: string, priceEtb: number, handle: string = CONTACT_INFO.telegram): string {
  return `https://t.me/${handle}?text=${encodeURIComponent(`Hi Charte Homes (@${handle}), inquiry regarding: ${propertyTitle} (${priceEtb.toLocaleString()} ETB)`)}`;
}
