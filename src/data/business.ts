export const business = {
  name: 'Nails by Valeria',
  shortName: 'VALERIA',
  tagline: 'Beauty in every detail.',
  description:
    'Nails by Valeria en Rivas, Belén, Nicaragua. Descubre trabajos de uñas acrílicas y esmaltado, explora la galería y consulta por WhatsApp.',
  whatsappNumber: '50586248657',
  instagram: '', // Añadir la URL o el usuario oficial de Instagram.
  location: 'Rivas, Belén, de la estación de bomberos 200 metros al sur.',
  country: 'Nicaragua',
  currency: 'NIO',
  startingPrice: 350,
  professionalName: 'Valeria',
  about:
    'Este es el espacio de Valeria para compartir sus trabajos de uñas. Elige tus diseños favoritos y escríbele para consultar por sus servicios y disponibilidad.',
  schedule: [
    { day: 'Lunes a sábado', hours: '7:00 a. m. a 5:00 p. m.' },
  ],
};

export const whatsappMessages = {
  general:
    'Hola Valeria, encontré tu página Nails by Valeria y me gustaría obtener información sobre tus servicios y disponibilidad para una cita.',
  acrylics:
    'Hola Valeria, estoy interesada en el servicio de uñas acrílicas. ¿Podrías brindarme información y disponibilidad?',
  polish:
    'Hola Valeria, estoy interesada en el servicio de esmaltado. ¿Podrías brindarme información y disponibilidad?',
  forDesign: (name: string) =>
    `Hola Valeria, vi este diseño en tu catálogo y me gustaría consultar su precio y disponibilidad: ${name}.`,
};

/** Returns a valid international telephone number without punctuation. */
export function getWhatsAppPhone(): string | undefined {
  const phone = business.whatsappNumber.replace(/\D/g, '');
  return /^505\d{8}$/.test(phone) ? phone : undefined;
}

/** Build a WhatsApp link only when a valid E.164-compatible number is configured. */
export function getWhatsAppUrl(message: string): string | undefined {
  const phone = getWhatsAppPhone();
  return phone ? `https://wa.me/${phone}?text=${encodeURIComponent(message)}` : undefined;
}

/** Accept the official Instagram URL or username, never a placeholder link. */
export function getInstagramUrl(): string | undefined {
  const instagram = business.instagram.trim();
  if (!instagram) return undefined;

  if (/^https?:\/\//i.test(instagram)) {
    try {
      const profile = new URL(instagram);
      if (!['instagram.com', 'www.instagram.com'].includes(profile.hostname.toLowerCase())) return undefined;
      const username = profile.pathname.split('/').filter(Boolean)[0];
      return username && /^[A-Za-z0-9._]{1,30}$/.test(username)
        ? `https://www.instagram.com/${username}/`
        : undefined;
    } catch {
      return undefined;
    }
  }

  const username = instagram.replace(/^@/, '');
  return /^[A-Za-z0-9._]{1,30}$/.test(username) ? `https://www.instagram.com/${username}/` : undefined;
}
