import { generatedDesigns } from './designs.generated';

export type Design = {
  id: string;
  name: string;
  description: string;
  category: string;
  image: string;
  thumbnail: string;
  imageAlt: string;
  width: number;
  height: number;
};

// Rebuilt from the original photographs in public/images/designs/originals/.
export const designs: Design[] = generatedDesigns;
