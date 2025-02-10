const express = require('express');
const path = require('path');
import { createProxyMiddleware } from 'http-proxy-middleware';

const app = express();
const PORT = process.env.PORT || 3000;

const API_URL = 'https://corvus-be-ea11e5b5e66c.herokuapp.com';

// Serve static files
app.use(express.static(path.join(__dirname, 'dist')));

app.use(
  '/api',
  createProxyMiddleware({
      target: 'https://corvus-be-ea11e5b5e66c.herokuapp.com/api',
      changeOrigin: true,
  })
);


// Handle client-side routing
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Frontend server running on port ${PORT}`);
}); 