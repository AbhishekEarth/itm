const fs = require('fs');
const path = require('path');

// Create directories
const dirs = [
  'public/images/company_logos/Engineering_Computing',
  'public/images/company_logos/Life_Sciences_Pharmacy',
  'src/assets'
];

dirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Create placeholder PNG (1x1 transparent)
const placeholderPNG = Buffer.from([
  0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, 0x00, 0x00, 0x00, 0x0D,
  0x49, 0x48, 0x44, 0x52, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
  0x08, 0x06, 0x00, 0x00, 0x00, 0x1F, 0x15, 0xC4, 0x89, 0x00, 0x00, 0x00,
  0x0A, 0x49, 0x44, 0x41, 0x54, 0x78, 0x9C, 0x63, 0x00, 0x01, 0x00, 0x00,
  0x05, 0x00, 0x01, 0x0D, 0x0A, 0x2D, 0xB4, 0x00, 0x00, 0x00, 0x00, 0x49,
  0x45, 0x4E, 0x44, 0xAE, 0x42, 0x60, 0x82
]);

// Create asset images
const assetFiles = {
  'src/assets/logo.png': placeholderPNG,
  'src/assets/NAACLogo.png': placeholderPNG,
  'src/assets/29years.png': placeholderPNG,
  'src/assets/slider1.jpg': placeholderPNG,
  'src/assets/slider2.jpg': placeholderPNG
};

Object.entries(assetFiles).forEach(([file, buffer]) => {
  fs.writeFileSync(file, buffer);
  console.log(`✅ Created ${file}`);
});

// Create company logo placeholders
for (let i = 0; i < 25; i++) {
  fs.writeFileSync(`public/images/company_logos/Engineering_Computing/logo_${i}.png`, placeholderPNG);
}
console.log(`✅ Created 25 Engineering logos`);

for (let i = 0; i < 20; i++) {
  fs.writeFileSync(`public/images/company_logos/Life_Sciences_Pharmacy/logo_${i}.png`, placeholderPNG);
}
console.log(`✅ Created 20 Management logos`);

console.log('\n✅ All placeholder images created!');