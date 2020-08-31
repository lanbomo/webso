const os = require('os');

const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function ({ port, baseUrl, dir, cors, proxyUrl }) {
    const app = express();

    let baseUrlWithPrefix = /^\//.test(baseUrl) ? baseUrl : `/${baseUrl}`;

    const corsHeaders = [
        { key: 'Access-Control-Allow-Origin', value: '*' },
        { key: 'Access-Control-Allow-Headers', value: 'Origin, X-Requested-With, Content-Type, Accept, Range, *' },
    ];

    if (proxyUrl == null) {
        app.use(
            baseUrlWithPrefix,
            express.static(dir, {
                setHeaders: (res) => {
                    if (cors) {
                        corsHeaders.forEach((v) => {
                            res.set(v.key, v.value);
                        });
                    }
                },
            })
        );
    } else {
        app.use(
            baseUrlWithPrefix,
            createProxyMiddleware({
                target: proxyUrl,
                changeOrigin: true,
                onProxyRes: (res) => {
                    if (cors) {
                        corsHeaders.forEach((v) => {
                            res.headers[v.key] = v.value;
                        });
                    }
                },
            })
        );
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
