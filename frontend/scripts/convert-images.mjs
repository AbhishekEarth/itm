/**
 * convert-images.mjs
 * Converts all JPG/JPEG/PNG images in public/images to WebP.
 * - Hero slides: max 1920px wide, quality 82
 * - Everything else: max 1200px wide, quality 80
 * - Company logos (already .webp): re-optimize at quality 85
 * - Skips files that already have a .webp counterpart newer than the source
 * - Prints a before/after size summary
 *
 * Run: node scripts/convert-images.mjs
 */

import sharp from 'sharp';
import { readdir, stat, mkdir } from 'fs/promises';
import { join, extname, basename, dirname } from 'path';
import { existsSync } from 'fs';

const IMAGES_DIR = new URL('../public/images', import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1');
const EXTENSIONS = new Set(['.jpg', '.jpeg', '.png']);

let totalOriginalBytes = 0;
let totalWebpBytes = 0;
let converted = 0;
let skipped = 0;
let errors = 0;

async function getFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const e of entries) {
    const full = join(dir, e.name);
    if (e.isDirectory()) {
      files.push(...(await getFiles(full)));
    } else if (EXTENSIONS.has(extname(e.name).toLowerCase())) {
      files.push(full);
    }
  }
  return files;
}

async function convert(src) {
  const ext = extname(src).toLowerCase();
  const out = src.replace(/\.(jpg|jpeg|png)$/i, '.webp');

  // Skip if webp already exists and is newer than source
  if (existsSync(out)) {
    const [srcStat, outStat] = await Promise.all([stat(src), stat(out)]);
    if (outStat.mtimeMs >= srcStat.mtimeMs) {
      skipped++;
      return;
    }
  }

  const isHero = src.includes('\\hero\\') || src.includes('/hero/');
  const maxWidth = isHero ? 1920 : 1200;
  const quality = isHero ? 82 : 80;

  try {
    const srcStat = await stat(src);
    totalOriginalBytes += srcStat.size;

    await sharp(src)
      .resize({ width: maxWidth, withoutEnlargement: true })
      .webp({ quality, effort: 4 })
      .toFile(out);

    const outStat = await stat(out);
    totalWebpBytes += outStat.size;

    const saving = Math.round((1 - outStat.size / srcStat.size) * 100);
    console.log(`  ✓ ${basename(src).padEnd(45)} ${(srcStat.size/1024).toFixed(0).padStart(6)} KB → ${(outStat.size/1024).toFixed(0).padStart(5)} KB  (${saving}% smaller)`);
    converted++;
  } catch (err) {
    console.error(`  ✗ ${basename(src)}: ${err.message}`);
    errors++;
  }
}

async function main() {
  console.log(`\n🖼  Scanning ${IMAGES_DIR}\n`);
  const files = await getFiles(IMAGES_DIR);
  console.log(`Found ${files.length} source images (jpg/jpeg/png)\n`);

  // Process in batches of 4 to avoid memory spikes
  for (let i = 0; i < files.length; i += 4) {
    await Promise.all(files.slice(i, i + 4).map(convert));
  }

  const savedMB = ((totalOriginalBytes - totalWebpBytes) / 1024 / 1024).toFixed(1);
  const savingPct = totalOriginalBytes > 0
    ? Math.round((1 - totalWebpBytes / totalOriginalBytes) * 100)
    : 0;

  console.log(`\n${'─'.repeat(65)}`);
  console.log(`  Converted : ${converted} files`);
  console.log(`  Skipped   : ${skipped} (already up-to-date)`);
  console.log(`  Errors    : ${errors}`);
  console.log(`  Original  : ${(totalOriginalBytes/1024/1024).toFixed(1)} MB`);
  console.log(`  WebP      : ${(totalWebpBytes/1024/1024).toFixed(1)} MB`);
  console.log(`  Saved     : ${savedMB} MB  (${savingPct}% reduction)`);
  console.log(`${'─'.repeat(65)}\n`);

  if (errors > 0) process.exit(1);
}

main();
