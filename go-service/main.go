package main

import (
	"crypto/sha256"
	"fmt"
	"net/http"
	"net/url"

	"github.com/gin-gonic/gin"

	"encoding/json"
)

// TODO generate this at startup
var salt string = "lkdfjbnavk;jdfba;kdj"

var visits map[string]int64 = make(map[string]int64)

func getVisit(c *gin.Context) {
	headers := squashHeaders(c.Request.Header)
	visitType := c.Param("type")
	name := c.Param("name")
	version := c.Query("version")
	fvtt_version := c.Query("fvtt_version")
	country := c.Query("country")
	username_hash := c.Query("username_hash")

	major_version := getMajorVersion(version)
	fvtt_major_version := getMajorVersion(fvtt_version)

	// build up anonymous hash
	ip := c.ClientIP()
	ua := headers["user-agent"]
	hash := "unknown"
	json, err := json.Marshal(
		map[string]string{ip: ip, ua: ua, username_hash: username_hash, salt: salt},
	)
	if err == nil {
		hash = fmt.Sprintf("%x", sha256.Sum256(json))
	}

	// headers
	referer := headers["referer"]
	parsedReferer, err := url.Parse(referer)
	var origin string
	var scheme string
	if err == nil {
		hostname := parsedReferer.Hostname()
		port := parsedReferer.Port()
		scheme = parsedReferer.Scheme
		if port != "" {
			port = ":" + port
		}
		origin = fmt.Sprintf("%s://%s%s", scheme, hostname, port)
	} else {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
	}

	// visits{type="system",name="investigator",origin="https://fvtt-testing.lumphammer.net",scheme="https:",hash="55f0927173b82657fcfce0d3b262d0b04a746bdc26403949d2d5a33d7e514310",country="GB",version="5.1.2",major_version="5",fvtt_version="10.285",fvtt_major_version="10"} 2

	label := fmt.Sprintf(
		`visits{type="%s",name="%s",origin="%s",scheme="%s",hash="%s",country="%s",version="%s",major_version="%s",fvtt_version="%s",fvtt_major_version="%s"}`,
		visitType,
		name,
		origin,
		scheme,
		hash,
		country,
		version,
		major_version,
		fvtt_version,
		fvtt_major_version,
	)

	// in go you can just ++ any key and if it wasn't there before it will
	// incrememnt the zero value, which is 0, so you get 1
	visits[label]++
	c.IndentedJSON(200, visits)
}

func getMetrics(c *gin.Context) {
	output := "# HELP visits number of times it's been hit\n" +
		"# TYPE visits counter\n"
	for k, v := range visits {
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

// exmaple url:
// https://visitors.lumphammer.net/api/visit/system/investigator?fvtt_version=10.285&version=5.1.2&country=GB&username_hash=3603c7c94f0782ecb2775f5a8876f9f65a89a07984c90b09e9441b2d2563c502&cache_buster=1663505115560
