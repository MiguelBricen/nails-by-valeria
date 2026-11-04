import { whatsappMessages } from './business';

export type Service = {
  id: string;
  name: string;
  description: string;
  whatsappMessage: string;
  image?: string;
  icon?: 'sparkles' | 'heart' | 'flower';
};

export const services: Service[] = [
  {
    id: 'unas-acrilicas',
    name: 'Uñas acrílicas',
    description: 'Consulta detalles y disponibilidad para este servicio.',
    whatsappMessage: whatsappMessages.acrylics,
    icon: 'sparkles',
  },
  {
    id: 'esmaltado',
    name: 'Esmaltado',
    description: 'Consulta detalles y disponibilidad para este servicio.',
    whatsappMessage: whatsappMessages.polish,
    icon: 'heart',
  },
];
