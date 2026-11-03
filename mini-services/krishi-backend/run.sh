#!/bin/bash
# KrishiAI Java Backend Runner with auto-restart
DIR="$(cd "$(dirname "$0")" && pwd)"
JAVA_HOME="/tmp/jdk-21.0.2"

echo "Starting KrishiAI Backend on port 8080..."
while true; do
  cd "$DIR"
  $JAVA_HOME/bin/java -cp "out:lib/*" com.krishiai.Main 2>&1
  echo "[run.sh] Server stopped. Restarting in 3s..."
  sleep 3
done