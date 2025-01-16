import express from 'express';
import path from 'path';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Serve static files
app.use(express.static(path.join(__dirname, 'dist')));

app.use(
  '/api',
  createProxyMiddleware({
    target: 'https://corvus-be-ea11e5b5e66c.herokuapp.com/api',
    changeOrigin: true,
  })
);

// Handle all other routes
app.get('*', (req, res) => {
  console.log(`📄 Serving index.html for: ${req.originalUrl}`);
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});




const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
