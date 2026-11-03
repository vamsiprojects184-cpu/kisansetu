#!/bin/bash
# KrishiAI Backend Build Script

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR"

export JAVA_HOME=${JAVA_HOME:-/tmp/jdk-21.0.2}
export PATH="$JAVA_HOME/bin:$PATH"

LIB_DIR="$SCRIPT_DIR/lib"
SRC_DIR="$SCRIPT_DIR/src/main/java"
OUT_DIR="$SCRIPT_DIR/out"

echo "========================================="
echo "  🌾 KrishiAI Backend Build Script"
echo "========================================="

# Download JARs if not present
if [ ! -f "$LIB_DIR/gson-2.10.1.jar" ]; then
    echo "[BUILD] Downloading gson-2.10.1.jar..."
    curl -L -o "$LIB_DIR/gson-2.10.1.jar" "https://repo1.maven.org/maven2/com/google/code/gson/gson/2.10.1/gson-2.10.1.jar"
fi

if [ ! -f "$LIB_DIR/sqlite-jdbc-3.45.1.0.jar" ]; then
    echo "[BUILD] Downloading sqlite-jdbc-3.45.1.0.jar..."
    curl -L -o "$LIB_DIR/sqlite-jdbc-3.45.1.0.jar" "https://repo1.maven.org/maven2/org/xerial/sqlite-jdbc/3.45.1.0/sqlite-jdbc-3.45.1.0.jar"
fi

if [ ! -f "$LIB_DIR/slf4j-api-2.0.9.jar" ]; then
    echo "[BUILD] Downloading slf4j-api-2.0.9.jar..."
    curl -L -o "$LIB_DIR/slf4j-api-2.0.9.jar" "https://repo1.maven.org/maven2/org/slf4j/slf4j-api/2.0.9/slf4j-api-2.0.9.jar"
fi

if [ ! -f "$LIB_DIR/slf4j-simple-2.0.9.jar" ]; then
    echo "[BUILD] Downloading slf4j-simple-2.0.9.jar..."
    curl -L -o "$LIB_DIR/slf4j-simple-2.0.9.jar" "https://repo1.maven.org/maven2/org/slf4j/slf4j-simple/2.0.9/slf4j-simple-2.0.9.jar"
fi

# Clean output directory
rm -rf "$OUT_DIR"
mkdir -p "$OUT_DIR"

# Compile
echo "[BUILD] Compiling Java files..."
CP="$LIB_DIR/*"
find "$SRC_DIR" -name "*.java" > /tmp/krishi_sources.txt
javac -cp "$CP" -d "$OUT_DIR" -sourcepath "$SRC_DIR" @/tmp/krishi_sources.txt

if [ $? -ne 0 ]; then
    echo "[BUILD] ❌ Compilation failed!"
    exit 1
fi

echo "[BUILD] ✅ Compilation successful!"

# Create run.sh
echo "[BUILD] Creating run.sh..."
cat > "$SCRIPT_DIR/run.sh" << 'RUNEOF'
#!/bin/bash
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR"
export JAVA_HOME=${JAVA_HOME:-/tmp/jdk-21.0.2}
export PATH="$JAVA_HOME/bin:$PATH"
java -cp "out:lib/*" com.krishiai.Main
RUNEOF
chmod +x "$SCRIPT_DIR/run.sh"

echo "========================================="
echo "  ✅ Build complete!"
echo "  Run with: ./run.sh"
echo "========================================="
