const { withSettingsGradle, withProjectBuildGradle } = require('expo/config-plugins');

const TAG = 'kotlinUpgrade-2.3.0';

function withAdMobKotlinFix(config) {
  // 1. Override Kotlin plugin version in settings.gradle pluginManagement
  //    This is where the Gradle PLUGIN (compiler) version is resolved.
  config = withSettingsGradle(config, (config) => {
    if (config.modResults.contents.includes(TAG)) return config;

    let contents = config.modResults.contents;

    // If pluginManagement block exists, inject resolutionStrategy into it
    if (contents.includes('pluginManagement')) {
      contents = contents.replace(
        /(pluginManagement\s*\{)/,
        `$1
        resolutionStrategy {
            eachPlugin {
                if (requested.id.namespace == 'org.jetbrains.kotlin') {
                    useVersion '2.3.0'
                }
                if (requested.id.namespace == 'com.google.devtools.ksp') {
                    useVersion '2.3.7'
                }
            }
        }  // ${TAG}`
      );
    } else {
      // No pluginManagement block, prepend one and add Kotlin/KSP version catalog overrides
      contents =
`pluginManagement {
    resolutionStrategy {
        eachPlugin {
            if (requested.id.namespace == 'org.jetbrains.kotlin') {
                useVersion '2.3.0'
            }
            if (requested.id.namespace == 'com.google.devtools.ksp') {
                useVersion '2.3.7'
            }
        }
    }  // ${TAG}
}
${contents}`;
    }

    config.modResults.contents = contents;
    return config;
  });

  // 2. Also patch root build.gradle as backup
  config = withProjectBuildGradle(config, (config) => {
    if (config.modResults.contents.includes(TAG)) return config;

    let contents = config.modResults.contents;

    // Replace Kotlin plugin aliases with explicit versions
    contents = contents.replace(
      /alias\(.*?plugins\.kotlin(?:\.android)?\)\s+apply\s+false/g,
      `id "org.jetbrains.kotlin.android" version "2.3.0" apply false  // ${TAG}`
    );

    contents = contents.replace(
      /alias\(.*?plugins\.ksp(?:\.android)?\)\s+apply\s+false/g,
      `id "com.google.devtools.ksp" version "2.3.7" apply false  // ${TAG}`
    );

    // Update ext version strings
    contents = contents.replace(
      /(kotlin\s*=\s*)"[^"]*"/g,
      `$1"2.3.0"  // ${TAG}`
    );

    config.modResults.contents = contents;
    return config;
  });

  return config;
}

module.exports = withAdMobKotlinFix;
