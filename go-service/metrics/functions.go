package metrics

// create a shallow copy of a map
func copyMap[K comparable, V any](m map[K]V) map[K]V {
	m2 := make(map[K]V)
	for k, v := range m {
		m2[k] = v
	}
	return m2
}
