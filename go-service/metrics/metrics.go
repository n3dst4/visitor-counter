package metrics

import (
	"fmt"
	"sync"
)

type Counter struct {
	name    string
	help    string
	metrics map[string]int64
	channel chan string
	mutex   *sync.Mutex
}

func NewCounter(name string, help string) Counter {
	c := Counter{
		name:    name,
		help:    help,
		metrics: make(map[string]int64),
		channel: make(chan string, 1024),
		mutex:   &sync.Mutex{},
	}
	go func() {
		for label := range c.channel {
			// in Go you can just ++ any key and if it wasn't there before it will
			// incrememnt the zero value, which is 0, so you get 1
			c.mutex.Lock()
			c.metrics[label]++
			c.mutex.Unlock()
		}
	}()
	return c
}

func (c Counter) Inc(s string) {
	// shove it in the channel, it will get picked up by the goroutine
	c.channel <- s
}

func (c Counter) Format() string {
	metrics := c.read()
	output := fmt.Sprintf("# HELP %s %s\n# TYPE %s counter\n", c.name, c.help, c.name)
	for k, v := range metrics {
		output += fmt.Sprintf("%s %d\n", k, v)
	}
	return output
}

func (c Counter) read() map[string]int64 {
	c.mutex.Lock()
	defer c.mutex.Unlock()
	return copyMap(c.metrics)
}
