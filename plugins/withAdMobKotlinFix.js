const { withProjectBuildGradle } = require('expo/config-plugins');

/**
 * Upgrades the Kotlin Gradle Plugin version from 2.1.20 to 2.3.0.
 *
 * expo-build-properties' kotlinVersion only upgrades the stdlib, not
 * the compiler. The compiler version is set by the Expo version catalog
 * (expoLibs). This plugin patches the root build.gradle to replace
 * the Kotlin plugin alias with an explicit version declaration.
 */
function withAdMobKotlinFix(config) {
  return withProjectBuildGradle(config, (config) => {
    if (config.modResults.contents.includes('kotlinUpgrade-2.3.0')) {
      return config;
    }

    let contents = config.modResults.contents;

    // 1. Replace Kotlin Android plugin alias with explicit v2.3.0
    const kotlinPluginPattern = /alias\(.*?plugins\.kotlin(?:\.android)?\)\s+apply\s+false/g;
    const kotlinReplacement = 'id "org.jetbrains.kotlin.android" version "2.3.0" apply false';
    contents = contents.replace(kotlinPluginPattern, `${kotlinReplacement}  // kotlinUpgrade-2.3.0`);

    // 2. Replace KSP plugin alias if present (KSP for Kotlin 2.3.0 = 2.3.7)
    const kspPluginPattern = /alias\(.*?plugins\.ksp(?:\.android)?\)\s+apply\s+false/g;
    const kspReplacement = 'id "com.google.devtools.ksp" version "2.3.7" apply false';
    contents = contents.replace(kspPluginPattern, `${kspReplacement}  // kotlinUpgrade-2.3.0`);

    // 3. Replace any inline Kotlin version references in the plugins block
    //    e.g. kotlin("android") version "2.1.20" -> kotlin("android") version "2.3.0"
    contents = contents.replace(
      /(kotlin\("android"\)\s+version\s+)"[^"]+"/g,
      '$1"2.3.0"'
    );

    // 4. Replace any remaining version catalog version references for Kotlin
    //    e.g. kotlin = "2.1.20" in ext block
    contents = contents.replace(
      /(kotlin\s*=\s*)"[^"]*"/g,
      `$1"2.3.0"  // kotlinUpgrade-2.3.0`
    );

    // 5. Replace ksp version in ext block
    contents = contents.replace(
      /(ksp\s*=\s*)"[^"]*"/g,
      `$1"2.3.7"  // kotlinUpgrade-2.3.0`
    );

    config.modResults.contents = contents;
    return config;
  });
}

module.exports = withAdMobKotlinFix;
