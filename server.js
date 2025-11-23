// Simple local development server for testing Vercel functions
require('dotenv').config(); // Load environment variables from .env file
const http = require('http');
const { URL } = require('url');

// Import API handlers
const panelsHandler = require('./api/panels');

const PORT = 3000;

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const pathname = url.pathname;

    // Create a mock request object compatible with Vercel
    const mockReq = {
      url: req.url,
      query: Object.fromEntries(url.searchParams),
      method: req.method,
      headers: req.headers
    };

    // Create a mock response object compatible with Vercel
    const mockRes = {
      statusCode: 200,
      headers: {},
      setHeader: function(name, value) {
        this.headers[name] = value;
        return this;
      },
      send: function(data) {
        if (!res.headersSent) {
          res.writeHead(this.statusCode || 200, this.headers);
        }
        res.end(data);
      },
      status: function(code) {
        this.statusCode = code;
        return this;
      }
    };

    if (pathname === '/api/panels') {
      await panelsHandler(mockReq, mockRes);
    } else {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not Found');
    }
  } catch (error) {
    console.error('Server error:', error);
    console.error('Stack:', error.stack);
    if (!res.headersSent) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Internal Server Error: ' + error.message);
    }
  }
});

server.on('error', (err) => {
  console.error('Server error:', err);
});

server.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
  console.log(`📝 Test endpoint:`);
  console.log(`   http://localhost:${PORT}/api/panels?username=varchasvakhare2022`);
  if (process.env.GITHUB_TOKEN) {
    console.log(`✅ GitHub token loaded (${process.env.GITHUB_TOKEN.substring(0, 10)}...)`);
  } else {
    console.log(`⚠️  No GitHub token found. Add GITHUB_TOKEN to .env for higher rate limits.`);
  }
});
