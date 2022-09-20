package main

import (
	"crypto/sha256"
	"encoding/json"
	"fmt"
	"net/url"
	"sync"
)

var metrics map[string]int64 = make(map[string]int64)

var mutex = &sync.Mutex{}

func registerVisit(label string) {
	mutex.Lock()
	defer mutex.Unlock()
	// in Go you can just ++ any key and if it wasn't there before it will
	// incrememnt the zero value, which is 0, so you get 1
	metrics[label]++
}

type createLabelArgs struct {
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

func createLabel(args *createLabelArgs) (string, error) {
	// build up anonymous hash
	hash := "unknown"
	json, err := json.Marshal(
		map[string]string{
			"ip":            args.ip,
			"ua":            args.ua,
			"username_hash": args.username_hash,
			"salt":          args.salt,
		},
	)
	if err == nil {
		hash = fmt.Sprintf("%x", sha256.Sum256(json))
	}

	major_version := getMajorVersion(args.version)
	fvtt_major_version := getMajorVersion(args.fvtt_version)

	parsedReferer, err := url.Parse(args.referer)
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
		return "", err
	}

	// visits{type="system",name="investigator",origin="https://fvtt-testing.lumphammer.net",scheme="https:",hash="55f0927173b82657fcfce0d3b262d0b04a746bdc26403949d2d5a33d7e514310",country="GB",version="5.1.2",major_version="5",fvtt_version="10.285",fvtt_major_version="10"} 2
	label := fmt.Sprintf(
		`visits{type="%s",name="%s",origin="%s",scheme="%s",hash="%s",country="%s",version="%s",major_version="%s",fvtt_version="%s",fvtt_major_version="%s"}`,
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
	)
	return label, nil
}
