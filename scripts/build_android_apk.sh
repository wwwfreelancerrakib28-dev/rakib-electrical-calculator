#!/usr/bin/env bash
set -e

WORKSPACE_DIR="$(pwd)"
TOOLS_DIR="$WORKSPACE_DIR/.tools"
mkdir -p "$TOOLS_DIR"

echo "=== 1. Setting up JDK 21 ==="
if [ ! -d "$TOOLS_DIR/jdk21/bin" ]; then
  echo "Downloading OpenJDK 21..."
  curl -sSL -o /tmp/jdk21.tar.gz https://github.com/adoptium/temurin21-binaries/releases/download/jdk-21.0.6%2B7/OpenJDK21U-jdk_x64_linux_hotspot_21.0.6_7.tar.gz
  mkdir -p "$TOOLS_DIR/jdk21"
  tar -xzf /tmp/jdk21.tar.gz -C "$TOOLS_DIR/jdk21" --strip-components=1
  rm -f /tmp/jdk21.tar.gz
fi

export JAVA_HOME="$TOOLS_DIR/jdk21"
export PATH="$JAVA_HOME/bin:$PATH"
java -version

echo "=== 2. Setting up Android SDK ==="
ANDROID_SDK="$TOOLS_DIR/android-sdk"
mkdir -p "$ANDROID_SDK/cmdline-tools"

if [ ! -d "$ANDROID_SDK/cmdline-tools/latest/bin" ]; then
  echo "Downloading Android Commandline Tools..."
  curl -sSL -o /tmp/cmdline-tools.zip https://dl.google.com/android/repository/commandlinetools-linux-11076708_latest.zip
  unzip -q /tmp/cmdline-tools.zip -d "$ANDROID_SDK/cmdline-tools"
  rm -rf "$ANDROID_SDK/cmdline-tools/latest"
  mv "$ANDROID_SDK/cmdline-tools/cmdline-tools" "$ANDROID_SDK/cmdline-tools/latest"
  rm -f /tmp/cmdline-tools.zip
fi

export ANDROID_HOME="$ANDROID_SDK"
export PATH="$ANDROID_HOME/cmdline-tools/latest/bin:$ANDROID_HOME/platform-tools:$PATH"

echo "Accepting Android SDK licenses..."
yes | sdkmanager --licenses > /dev/null 2>&1 || true

echo "Installing Android platform and build-tools..."
sdkmanager --install "platform-tools" "build-tools;34.0.0" "platforms;android-34"

echo "=== 3. Syncing Capacitor Web Build ==="
npm run build
npx cap sync android

echo "=== 4. Configuring Android Project ==="
mkdir -p "$WORKSPACE_DIR/android"
echo "sdk.dir=$ANDROID_HOME" > "$WORKSPACE_DIR/android/local.properties"
chmod +x "$WORKSPACE_DIR/android/gradlew"

echo "=== 5. Compiling Android Debug APK ==="
cd "$WORKSPACE_DIR/android"
./gradlew assembleDebug

echo "=== 6. Locating and Verifying APK ==="
BUILT_APK="$WORKSPACE_DIR/android/app/build/outputs/apk/debug/app-debug.apk"

if [ ! -f "$BUILT_APK" ]; then
  echo "ERROR: APK was not found at $BUILT_APK"
  exit 1
fi

FILE_SIZE=$(stat -c%s "$BUILT_APK")
echo "Generated APK size: $FILE_SIZE bytes"

if [ "$FILE_SIZE" -lt 1000000 ]; then
  echo "ERROR: APK file size ($FILE_SIZE bytes) is less than 1 MB!"
  exit 1
fi

mkdir -p "$WORKSPACE_DIR/.build-outputs"
mkdir -p "$WORKSPACE_DIR/APK_DOWNLOAD"

cp "$BUILT_APK" "$WORKSPACE_DIR/.build-outputs/app-debug.apk"
cp "$BUILT_APK" "$WORKSPACE_DIR/APK_DOWNLOAD/app-debug.apk"

echo "=== SUCCESS! ==="
ls -lh "$WORKSPACE_DIR/.build-outputs/app-debug.apk"
ls -lh "$WORKSPACE_DIR/APK_DOWNLOAD/app-debug.apk"
