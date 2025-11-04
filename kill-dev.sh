#!/bin/bash

# Kill development processes
pkill -f "next dev" && pkill -f "tsx watch" && sleep 2

# Kill processes on ports 3001 and 9002
lsof -ti:3001,9002 | xargs -r kill -9

echo "Development servers stopped"