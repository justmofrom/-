const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
// Allowed origins for CORS (restrict in production)
const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : ['*'];

// Helper function to serve a file with proper error handling
function serveFile(filePath, contentType, res) {
    fs.readFile(filePath, (err, data) => {
        if (err) {
            const statusCode = err.code === 'ENOENT' ? 404 : 403;
            const message = err.code === 'ENOENT' ? 'Not Found' : 'Forbidden';
            res.writeHead(statusCode);
            res.end(message);
            return;
        }
        res.writeHead(200, { 'Content-Type': contentType + '; charset=utf-8' });
        res.end(data);
    });
}

const server = http.createServer((req, res) => {
    // Handle CORS - configure allowed origins via ALLOWED_ORIGINS env var
    const origin = req.headers.origin || '*';
    const allowedOrigin = ALLOWED_ORIGINS.includes('*') ? '*' : 
                          ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
    
    res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    if (req.url === '/' || req.url === '/index.html') {
        serveFile(path.join(__dirname, 'index.html'), 'text/html', res);
    } else if (req.url === '/data.json') {
        serveFile(path.join(__dirname, 'data.json'), 'application/json', res);
    } else {
        res.writeHead(404);
        res.end('Not Found');
    }
});

server.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
