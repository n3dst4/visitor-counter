package main

import (
	"log"
	"net/http"
	"os"

	"encoding/base64"

	"github.com/gin-gonic/gin"

	"github.com/n3dst4/visitor-counter/metrics"
)

// TODO generate this at startup
var salt string = "lkdfjbnavk;jdfba;kdj"
var gifBytes, _ = base64.StdEncoding.DecodeString("R0lGODlhAQABAPAAAAAAAAAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==")
var logger = log.New(os.Stderr, "[visitor counter]", log.LstdFlags)
var visitMetrics metrics.Counter = metrics.NewCounter("visits", "number of times a visit has been registered")
var collectionMetrics metrics.Counter = metrics.NewCounter("collections", "number of times that metrics have been collected")

func getVisit(c *gin.Context) {
	// get the response out to the client asap
	c.Header("Content-Type", "image/gif")
	c.Header("Content-Disposition", `attachment; filename="1x1transparent.gif"`)
	c.Data(http.StatusOK, "image/gif", gifBytes)

	// get all the intersting data out of the context
	headers := squashHeaders(c.Request.Header)
	label := createVisitLabel(
		&createVisitLabelArgs{
			country:       c.Query("country"),
			fvtt_version:  c.Query("fvtt_version"),
			ip:            c.ClientIP(),
			name:          c.Param("name"),
			referer:       headers["referer"],
			salt:          salt,
			ua:            headers["user-agent"],
			username_hash: c.DefaultQuery("username_hash", "unknown"),
			version:       c.Query("version"),
			visitType:     c.Param("type"),
		},
	)

	visitMetrics.Inc(label)
}

func getMetrics(c *gin.Context) {
	headers := squashHeaders(c.Request.Header)
	label := createCollectionLabel(headers["user-agent"])
	// there's almost a race here, because .Inc is async so you may not see it
	// reflected in the results a few lines down. This is fine - the event is
	// still getting recorded and will be counted in due course.
	collectionMetrics.Inc(label)
	output := visitMetrics.Format()
	output += "\n"
	output += collectionMetrics.Format()
	c.Data(http.StatusOK, "text/plain", []byte(output))
}

func getRoot(c *gin.Context) {
	// c.Redirect(http.StatusMovedPermanently, ")
	c.Data(http.StatusOK, "text/html", []byte("<html><h1>visitor counter</h1></html>\n"))
}

func main() {
	r := gin.Default()
	// good enough for now (working in caddy)
	// see https://pkg.go.dev/github.com/gin-gonic/gin#readme-don-t-trust-all-proxies
	r.SetTrustedProxies([]string{"127.0.0.1"})
	// visit routes
	r.GET("/api/visit/:type/:name", getVisit)
	r.GET("/visit/:type/:name", getVisit)
	// collection routes
	r.GET("/api/metrics", getMetrics)
	r.GET("/metrics", getMetrics)
	// root route
	r.GET("/", getRoot)
	// start the server
	r.Run(":9876")
}

// example url:
// https://visitors.lumphammer.net/api/visit/system/investigator?fvtt_version=10.285&version=5.1.2&country=GB&username_hash=3603c7c94f0782ecb2775f5a8876f9f65a89a07984c90b09e9441b2d2563c502&cache_buster=1663505115560
