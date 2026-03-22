import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'n8n-webhook-plugin',
      configureServer(server) {
        server.middlewares.use('/api/save', (req, res) => {
          if (req.method === 'POST') {
            let body = '';
            req.on('data', chunk => body += chunk);
            req.on('end', () => {
              fs.writeFileSync('./public/data/stories.json', body);
              res.end('Success');
            });
          }
        });
      }
    }
  ],
})
