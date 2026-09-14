import fs from 'fs';
let content = fs.readFileSync('client/index.html', 'utf8');
content = content.replace(/<script[^>]*src="%VITE_ANALYTICS_ENDPOINT%\/umami"[^>]*><\/script>/gi, '');
fs.writeFileSync('client/index.html', content);
