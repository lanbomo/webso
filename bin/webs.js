const fs = require('fs');
const path = require('path');

const commander = require('commander');
const portfinder = require('portfinder');

const serverBoot = require('../server');

const pkgJson = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../package.json')).toString());
const version = pkgJson.version;

const { Command } = commander;
const program = new Command();
program.version(version);

const defaultPort = 8080;

program
    .arguments('[dir]')
    .description('webs is a command-line http server. by lanbo')
    .option('-p, --port <port>', "server's port (defaults to 8080)", parseInt)
    .option('-P, --proxy <proxy>', 'proxy request to url. e.g: -P http://url.com')
    .option('--cors', 'add CORS header Access-Control-Allow-Origin')
    .option('-b, --base-url <baseUrl>', 'base url (defaults to /)', '/')
    .action(async (dir, opts) => {
        let port = opts.port;
        if (opts.port == null) {
            portfinder.basePort = defaultPort;
            port = await portfinder.getPortPromise();
        }
        const absDir = path.resolve(process.cwd(), dir || './');
        console.log(port, process.cwd(), dir, absDir, opts.proxy);

        serverBoot({ port, dir: absDir, baseUrl: opts.baseUrl, cors: opts.cors, proxyUrl: opts.proxy });
    });

program.parse(process.argv);
