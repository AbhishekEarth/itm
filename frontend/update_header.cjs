const fs = require('fs');
let content = fs.readFileSync('./src/components/Header.jsx', 'utf8');

// Increase tap target size for mobile links
content = content.replace(/py-1\.5 font-medium/g, 'py-2.5 font-medium text-[14px]');

// Add top safe area to header
content = content.replace(/className=\"fixed top-0 left-0 right-0 z-\[200\]/g, 'className=\"fixed top-0 left-0 right-0 z-[200] pt-safe');

// Make sure mobile dropdown itself handles bottom safe area
content = content.replace(/className=\"flex flex-col p-6 gap-5 text-\[14px\]\"/g, 'className=\"flex flex-col p-6 pb-safe gap-5 text-[14px]\"');

fs.writeFileSync('./src/components/Header.jsx', content);
