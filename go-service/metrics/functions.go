package metrics

import (
	"fmt"
	"sort"
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
	sorted_keys := make([]string, 0, len(data))
	for k := range data {
		sorted_keys = append(sorted_keys, k)
	}
	sort.Strings(sorted_keys)
	for _, k := range sorted_keys {
		label += fmt.Sprintf(`%s="%s",`, k, data[k])
	}
	label = strings.TrimRight(label, ",")
	label += "}"
	return label
}
