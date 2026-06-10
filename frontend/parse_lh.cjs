const fs = require('fs');
const html = fs.readFileSync('./lighthouse-mobile.html', 'utf8');

const match = html.match(/window\.__LIGHTHOUSE_JSON__ = (\{.*?\});<\/script>/);
if (match) {
  const data = JSON.parse(match[1]);
  const cats = data.categories;
  console.log('--- SCORES ---');
  console.log('Performance:', Math.round(cats.performance.score * 100));
  console.log('Accessibility:', Math.round(cats.accessibility.score * 100));
  console.log('Best Practices:', Math.round(cats['best-practices'].score * 100));
  console.log('SEO:', Math.round(cats.seo.score * 100));
  
  console.log('\n--- FAILED AUDITS ---');
  for (const key in data.audits) {
    const audit = data.audits[key];
    if (audit.score === 0 && audit.scoreDisplayMode !== 'notApplicable' && audit.scoreDisplayMode !== 'informative') {
      console.log(key + ': ' + audit.title);
    }
  }
  
  console.log('\n--- METRICS ---');
  console.log('LCP:', data.audits['largest-contentful-paint'].displayValue);
  console.log('CLS:', data.audits['cumulative-layout-shift'].displayValue);
  console.log('TBT:', data.audits['total-blocking-time'].displayValue);
} else {
  console.log('No json found');
}
