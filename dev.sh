#!/bin/bash
export PATH="/usr/local/bin:$PATH"
cd /Users/fshinde/Documents/Claude/Projects/nsw-driving-guide
exec /usr/local/bin/node node_modules/next/dist/bin/next dev --webpack -p ${PORT:-3000}
