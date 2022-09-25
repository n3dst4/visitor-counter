# Visitor counter (Go Service)

Janky in-memory visitor counter service written in Go. Slightly less janky than the predecessor written as a Next.js app.

## Deployment

Haha there isn't anything! On Ulthar,

```sh
pm2 stop visitor-counter
```

Then, on dev machine in this folder:

```sh
go build .
scp visitor-counter ulthar:~/.local.bin
```

On Ulthar,

```sh
pm2 start visitor-counter
```

## Notes

As of right now, this service gets collected by grafana-agent on Ulthar, which forwards to my hosted Prometheus instance.


## Future work

* Rewrite in Rust? Question mark?
* Use Redis instead of in-memory map.
