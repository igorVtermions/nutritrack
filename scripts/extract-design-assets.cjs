const fs = require('node:fs');
const { Buffer } = require('node:buffer');
const path = require('node:path');
const sharp = require('sharp');
const root = path.resolve(__dirname, '..');
const today = fs.readFileSync(
  path.join(root, 'design/screens/02-today.svg'),
  'utf8',
);
const groups = [...today.matchAll(/<g transform="[^"]+">([\s\S]*?)<\/g>/g)].map(
  (match) => match[1],
);
const assets = {
  logo: { body: groups[0], size: 32 },
  oatmeal: { body: groups[1], size: 80 },
  salad: { body: groups[2], size: 80 },
};
for (const name of [
  'home',
  'chart',
  'food',
  'settings',
  'back',
  'chevron',
  'plus',
  'flame',
  'calendar',
  'check',
]) {
  assets[name] = {
    xml: fs.readFileSync(path.join(root, `design/icons/${name}.svg`), 'utf8'),
  };
}
const xml = Object.fromEntries(
  Object.entries(assets).map(([name, asset]) => [
    name,
    asset.xml ||
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${asset.size} ${asset.size}">${asset.body}</svg>`,
  ]),
);
fs.mkdirSync(path.join(root, 'src/design-system/icons'), { recursive: true });
fs.writeFileSync(
  path.join(root, 'src/design-system/icons/assets.ts'),
  '// Extracted from local design SVGs; regenerate with node scripts/extract-design-assets.cjs.\nexport const assets = ' +
    JSON.stringify(xml, null, 2) +
    ' as const;\n',
);
fs.mkdirSync(path.join(root, 'assets/images'), { recursive: true });
sharp(Buffer.from(xml.logo))
  .resize(256, 256)
  .png()
  .toFile(path.join(root, 'assets/images/logo.png'))
  .catch((error) => {
    throw error;
  });
