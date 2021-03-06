#! /usr/bin/env node

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
const desc = `webso is a command-line http server. current version is ${version}\nby lanbo`;

program
    .arguments('[dir]')
    .description(desc)
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

        console.log(desc + '\n');

        serverBoot({ port, dir: absDir, baseUrl: opts.baseUrl, cors: opts.cors, proxyUrl: opts.proxy });
    });

program.parse(process.argv);
