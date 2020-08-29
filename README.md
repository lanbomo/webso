# webso
webso is a command-line http server.

# usage

```shell
webso [dir] [options]
```

    Options:
    -V, --version             output the version number
    -p, --port <port>         server's port (defaults to 8080)
    -P, --proxy <proxy>       proxy request to url. e.g: -P http://url.com
    --cors                    add CORS header Access-Control-Allow-Origin
    -b, --base-url <baseUrl>  base url (defaults to /) (default: "/")
    -h, --help                display help for command