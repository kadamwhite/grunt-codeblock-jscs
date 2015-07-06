#!/bin/bash

# Paths are relative to root of project
node_modules/.bin/grunt codeblock-jscs:passing > tests/fixtures/output/passing.txt
node_modules/.bin/grunt codeblock-jscs:failing > tests/fixtures/output/failing.txt
node_modules/.bin/grunt codeblock-jscs:filtered > tests/fixtures/output/filtered.txt
node_modules/.bin/grunt codeblock-jscs:forced > tests/fixtures/output/forced.txt
node_modules/.bin/grunt codeblock-jscs:with-jscs-options > tests/fixtures/output/with-jscs-options.txt

echo "Done!"
