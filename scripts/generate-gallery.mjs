import { createHash } from 'node:crypto';
import { readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const originalDirectory = path.join(root, 'public', 'images', 'designs', 'originals');
const metadataPath = path.join(root, 'src', 'data', 'designs.metadata.json');
const outputPath = path.join(root, 'src', 'data', 'designs.generated.ts');
const metadata = JSON.parse(await readFile(metadataPath, 'utf8'));
const originals = (await readdir(originalDirectory, { withFileTypes: true }))
  .filter((entry) => entry.isFile() && /\.(?:jpe?g|png|webp)$/i.test(entry.name))
  .map((entry) => entry.name)
  .sort((left, right) => Number(left.match(/\d+/)?.[0]) - Number(right.match(/\d+/)?.[0]));

const knownFiles = new Set();
const generatedIds = new Set();
const hashes = new Map();
const designs = [];

for (const original of originals) {
  const id = path.parse(original).name;
  const details = metadata[id];
  if (!details?.alt || !details?.description) {
    throw new Error(`Añade un texto alternativo y una descripción para ${original} en designs.metadata.json.`);
  }

  const bytes = await readFile(path.join(originalDirectory, original));
  const hash = createHash('sha256').update(bytes).digest('hex');
  if (hashes.has(hash)) {
    throw new Error(`Fotografías duplicadas: ${hashes.get(hash)} y ${original}.`);
  }
  hashes.set(hash, original);

  if (!/^design-\d{2}$/.test(details.id) || generatedIds.has(details.id)) {
    throw new Error(`El identificador de galería de ${original} debe ser único y usar el formato design-01.`);
  }
  const designId = details.id;
  const fullImage = `/images/designs/${designId}-1200.webp`;
  const thumbnail = `/images/designs/${designId}-480.webp`;
  for (const imagePath of [fullImage, thumbnail]) {
    const file = path.join(root, 'public', imagePath.slice(1));
    try {
      await readFile(file);
    } catch {
      throw new Error(`Falta optimizar ${original}: no se encuentra ${imagePath}.`);
    }
  }

  const { width, height } = details;
  knownFiles.add(id);
  generatedIds.add(designId);
  designs.push({
    id: designId,
    name: String(designs.length + 1).padStart(2, '0'),
    description: details.description,
    category: 'Galería',
    image: fullImage,
    thumbnail,
    imageAlt: details.alt,
    width,
    height,
  });
}

for (const id of Object.keys(metadata)) {
  if (!knownFiles.has(id)) throw new Error(`No se encontró la fotografía original para el identificador ${id}.`);
}

await writeFile(
  outputPath,
  `import type { Design } from './designs';\n\nexport const generatedDesigns: Design[] = ${JSON.stringify(designs, null, 2)};\n`,
  'utf8',
);
console.log(`Galería generada automáticamente: ${designs.length} fotografías, sin duplicados.`);
