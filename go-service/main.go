package main

import (
	"fmt"
	"log"
	"net/http"
	"os"

	"encoding/base64"

	"github.com/gin-gonic/gin"
)

// TODO generate this at startup
var salt string = "lkdfjbnavk;jdfba;kdj"

// gifFromCopilot := "R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
var gifInBase64 = "R0lGODlhAQABAPAAAAAAAAAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw=="
var gifBytes, _ = base64.StdEncoding.DecodeString(gifInBase64)

var logger = log.New(os.Stderr, "[visitor counter]", log.LstdFlags)

func getVisit(c *gin.Context) {
	// get the response out to the client asap
	c.Header("Content-Type", "image/gif")
	c.Data(http.StatusOK, "image/gif", gifBytes)

	// get all the intersting data out of the context
	headers := squashHeaders(c.Request.Header)
	label, err := createLabel(
		&createLabelArgs{
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

	// deal with logging the visit in a goroutine
	go registerVisit(label)

	if err != nil {
		logger.Printf("error creating label: %s", err)
	}
}

func getMetrics(c *gin.Context) {
	output := "# HELP visits number of times it's been hit\n" +
		"# TYPE visits counter\n"
	for k, v := range metrics {
		output += fmt.Sprintf("%s %d\n", k, v)
	}
	c.Data(http.StatusOK, "text/plain", []byte(output))
}

func MapExample() {
	foo := make(map[string]int64)
	foo["bar"] = 1
	foo["baz"]++
	foo["baz"]++
	fmt.Println(foo["corge"]) // 0
	fmt.Println(foo["bar"])   // 1
	fmt.Println(foo["baz"])   // 2
}

func main() {
	r := gin.Default()
	// good enough for now 9working in caddy
	// see https://pkg.go.dev/github.com/gin-gonic/gin#readme-don-t-trust-all-proxies
	r.SetTrustedProxies([]string{"127.0.0.1"})
	r.GET("/api/visit/:type/:name", getVisit)
	r.GET("/api/metrics", getMetrics)
	r.Run(":8080")
}

// example url:
// https://visitors.lumphammer.net/api/visit/system/investigator?fvtt_version=10.285&version=5.1.2&country=GB&username_hash=3603c7c94f0782ecb2775f5a8876f9f65a89a07984c90b09e9441b2d2563c502&cache_buster=1663505115560
