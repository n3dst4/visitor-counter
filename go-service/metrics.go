package main

import "sync"

var metrics map[string]int64 = make(map[string]int64)

// channel, because we're pretending that the persistence is a database so we
// want to offload that to a thread
var visitChan = make(chan string, 1024)

// mutex, to protect the actual in-memory map we're using
var mutx = &sync.Mutex{}

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

// thread-safe map update
func updateMetrics(c chan string, metrics map[string]int64) {
	for label := range c {
		// in Go you can just ++ any key and if it wasn't there before it will
		// incrememnt the zero value, which is 0, so you get 1
		mutx.Lock()
		metrics[label]++
		mutx.Unlock()
	}
}

// create a shallow copy of a map
func readMetrics() map[string]int64 {
	mutx.Lock()
	defer mutx.Unlock()
	return copyMap(metrics)
}
