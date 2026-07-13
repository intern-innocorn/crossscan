const { withProjectBuildGradle } = require('expo/config-plugins');

/**
 * Forces play-services-ads to v24.6.0 which is compatible with Kotlin 2.1.20.
 * react-native-google-mobile-ads v16 pulls in play-services-ads 25.x
 * which requires Kotlin 2.3.0 that Expo SDK 57 does not support.
 */
function withAdMobKotlinFix(config) {
  return withProjectBuildGradle(config, (config) => {
    if (config.modResults.contents.includes('googleMobileAdsKotlinFix')) {
      return config;
    }

    const strategy = `
// [googleMobileAdsKotlinFix] Force play-services-ads version compatible with Kotlin 2.1.20
allprojects {
    configurations.all {
        resolutionStrategy.eachDependency { DependencyResolveDetails details ->
            if (details.requested.group == 'com.google.android.gms' && details.requested.name == 'play-services-ads') {
                details.useVersion '24.6.0'
            }
        }
    }
}
`;
    config.modResults.contents += `\n${strategy}`;
    return config;
  });
}

module.exports = withAdMobKotlinFix;
