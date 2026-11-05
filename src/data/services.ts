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
    description: 'Extensiones resistentes para dar forma y longitud.',
    whatsappMessage: whatsappMessages.acrylics,
    icon: 'sparkles',
  },
  {
    id: 'esmaltado',
    name: 'Esmaltado',
    description: 'Color impecable y brillo para un acabado cuidado.',
    whatsappMessage: whatsappMessages.polish,
    icon: 'heart',
  },
  {
    id: 'semipermanente',
    name: 'Semipermanente',
    description: 'Color duradero con un acabado brillante.',
    whatsappMessage: whatsappMessages.forService('semipermanente'),
    icon: 'sparkles',
  },
  {
    id: 'soft-gel',
    name: 'Uñas en Soft Gel',
    description: 'Extensiones ligeras con apariencia natural.',
    whatsappMessage: whatsappMessages.forService('uñas en Soft Gel'),
    icon: 'flower',
  },
  {
    id: 'rubber',
    name: 'Nivelación de Rubber',
    description: 'Refuerzo y nivelación para uñas naturales.',
    whatsappMessage: whatsappMessages.forService('nivelación de Rubber'),
    icon: 'heart',
  },
  {
    id: 'manicura-natural',
    name: 'Manicura y brillo natural',
    description: 'Cuidado esencial con un brillo sutil y natural.',
    whatsappMessage: whatsappMessages.forService('manicura y brillo natural'),
    icon: 'flower',
  },
];
