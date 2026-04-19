import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'copy-404',
      closeBundle() {
        // Copy index.html to 404.html for GitHub Pages SPA routing
        const indexPath = 'dist/index.html';
        const html = fs.readFileSync(indexPath, 'utf-8');
        fs.writeFileSync('dist/404.html', html);
      }
    }
  ],
  base: './',
})
