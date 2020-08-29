const os = require('os');

const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function ({ port, baseUrl, dir, cors, proxyUrl }) {
    const app = express();

    let baseUrlWithPrefix = /^\//.test(baseUrl) ? baseUrl : `/${baseUrl}`;

    if (proxyUrl == null) {
        app.use(baseUrlWithPrefix, express.static(dir));
    } else {
        app.use(baseUrlWithPrefix, createProxyMiddleware({ target: proxyUrl, changeOrigin: true }));
    }

    app.listen(port, () => {
        console.log('server is started on:');
        const networks = os.networkInterfaces();

        Object.keys(networks).forEach((n) => {
            networks[n].forEach((net) => {
                if (net.family === 'IPv4') {
                    console.log(`http://${net.address}:${port}${baseUrlWithPrefix}`);
                }
            });
        });
    });
};
