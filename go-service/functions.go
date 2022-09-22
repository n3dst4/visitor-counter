package main

import (
	"crypto/sha256"
	"encoding/json"
	"fmt"
	"net/url"
	"strings"
)

const COLLECTOR = "go_service"

// Given a dot-separated version string, return the major version (first/most
// significant part)
func getMajorVersion(version string) string {
	return strings.Split(version, ".")[0]
}

// Given a headers object, return a simplified version where all the keys are
// lowercased and all the values are strings
func squashHeaders(headers map[string][]string) map[string]string {
	squashed := make(map[string]string)
	for k, v := range headers {
		squashed[strings.ToLower(k)] = strings.Join(v, ",")
	}
	return squashed
}

type createVisitLabelArgs struct {
	country       string
	fvtt_version  string
	ip            string
	name          string
	salt          string
	ua            string
	username_hash string
	version       string
	visitType     string
	referer       string
}

// Given a bunch of properties, make a label for the metrics
func createVisitLabel(args *createVisitLabelArgs) string {
	// build up anonymous hash. we don't want to record ip, user agent, or
	// username hash, we only want to build up a hash that is unique to the visit.
	hash := "unknown"
	json, jsonErr := json.Marshal(
		map[string]string{
			"ip":            args.ip,
			"ua":            args.ua,
			"username_hash": args.username_hash,
			"salt":          args.salt,
		},
	)
	if jsonErr == nil {
		hash = fmt.Sprintf("%x", sha256.Sum256(json))
	} else {
		logger.Printf("error creating hash: %s", jsonErr)
		hash = "unknown"
	}

	major_version := getMajorVersion(args.version)
	fvtt_major_version := getMajorVersion(args.fvtt_version)

	// use the referer to get the origin and scheme
	parsedReferer, urlErr := url.Parse(args.referer)
	var origin string
	var scheme string
	if urlErr == nil {
		hostname := parsedReferer.Hostname()
		port := parsedReferer.Port()
		scheme = parsedReferer.Scheme
		if port != "" {
			port = ":" + port
		}
		origin = fmt.Sprintf("%s://%s%s", scheme, hostname, port)
	} else {
		logger.Printf("Error parsing referer: %s", urlErr)
		origin = "unknown"
		scheme = "unknown"
	}

	// visits{type="system",name="investigator",origin="https://fvtt-testing.lumphammer.net",scheme="https:",hash="55f0927173b82657fcfce0d3b262d0b04a746bdc26403949d2d5a33d7e514310",country="GB",version="5.1.2",major_version="5",fvtt_version="10.285",fvtt_major_version="10"} 2
	label := fmt.Sprintf(
		`visits{type="%s",name="%s",origin="%s",scheme="%s",hash="%s",country="%s",version="%s",major_version="%s",fvtt_version="%s",fvtt_major_version="%s,collector="%s"}`,
		args.visitType,
		args.name,
		origin,
		scheme,
		hash,
		args.country,
		args.version,
		major_version,
		args.fvtt_version,
		fvtt_major_version,
		COLLECTOR,
	)
	return label
}

func createCollectionLabel(userAgent string) string {
	return fmt.Sprintf(`collection{user_agent="%s"}`, userAgent)
}
