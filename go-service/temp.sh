#! /usr/bin/env bash

curl -s -X POST -H "Content-Type: application/json" -d '{"name":"John"}' http://localhost:8080/echo