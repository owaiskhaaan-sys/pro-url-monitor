const { createServer } = require('http');
const { parse } = require('url');
const path = require('path');

// Load Next.js standalone server
const NextServer = require('./.next/standalone/server.js');

const hostname = '0.0.0.0';
const port = process.env.PORT || 3000;

console.log(`> Starting ProURLMonitor on http://${hostname}:${port}`);
console.log(`> Environment: ${process.env.NODE_ENV || 'development'}`);

// Start the server
const app = NextServer;
