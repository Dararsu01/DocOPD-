#!/bin/bash
# DocOPD APK Build Script

echo "================================================="
echo "🩺 Building DocOPD Android APK..."
echo "================================================="

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR/android" || exit 1

chmod +x ./gradlew
./gradlew assembleDebug --stacktrace

if [ -f "app/build/outputs/apk/debug/app-debug.apk" ]; then
    cp app/build/outputs/apk/debug/app-debug.apk app/build/outputs/apk/debug/app-release.apk
    cp app/build/outputs/apk/debug/app-debug.apk "$SCRIPT_DIR/app-release.apk"
    echo ""
    echo "================================================="
    echo "✅ SUCCESS! Android APK built successfully:"
    echo "📁 $SCRIPT_DIR/app-release.apk"
    echo "================================================="
else
    echo "❌ Build failed. Please check the error logs above."
fi
