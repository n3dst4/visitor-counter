package main

import "strings"

func getMajorVersion(version string) string {
	return strings.Split(version, ".")[0]
}

// given a headers object, return a simplified version where all the keys are
// lowercased and all the values are strings
func squashHeaders(headers map[string][]string) map[string]string {
	squashed := make(map[string]string)
	for k, v := range headers {
		squashed[strings.ToLower(k)] = strings.Join(v, ",")
	}
	return squashed
}
