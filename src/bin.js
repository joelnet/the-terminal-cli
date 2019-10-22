#!/bin/sh
':' //# comment; exec /usr/bin/env NODE_ENV=production node "$0" "$@"

require('./index.js')
