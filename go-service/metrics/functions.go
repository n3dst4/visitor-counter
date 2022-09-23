package metrics

import (
	"fmt"
	"strings"
)

// create a shallow copy of a map
func copyMap[K comparable, V any](m map[K]V) map[K]V {
	m2 := make(map[K]V)
	for k, v := range m {
		m2[k] = v
	}
	return m2
}

func makeLabel(name string, data map[string]string) string {
	label := fmt.Sprintf(`%s{`, name)
	for k, v := range data {
		label += fmt.Sprintf(`%s="%s",`, k, v)
	}
	label = strings.TrimRight(label, ",")
	label += "}"
	return label
}
