import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';
import { useTheme } from '@/theme/ThemeProvider';

// Production ad unit IDs from AdMob (separate per platform)
const IOS_BANNER_ID = 'ca-app-pub-5658391580506757/2150490924';
const ANDROID_BANNER_ID = 'ca-app-pub-5658391580506757/8316513834';
const PROD_BANNER_ID = Platform.OS === 'ios' ? IOS_BANNER_ID : ANDROID_BANNER_ID;

interface Props {
  backgroundColor?: string;
}

export default function AdBanner({ backgroundColor }: Props) {
  const { resolvedMode } = useTheme();
  const bg = backgroundColor ?? (resolvedMode === 'dark' ? '#000000' : '#F2F2F7');

  const isDev = __DEV__;
  const adUnitId = isDev ? TestIds.BANNER : PROD_BANNER_ID;

  if (isDev) {
    console.log('[AdBanner] Using test ad unit');
  }

  return (
    <View style={[styles.container, { backgroundColor: bg }]}>
      <BannerAd
        unitId={adUnitId}
        size={BannerAdSize.BANNER}
        requestOptions={{
          requestNonPersonalizedAdsOnly: true,
        }}
        onAdFailedToLoad={(error) => {
          console.warn('[AdBanner] Ad failed to load:', error?.message ?? 'unknown error');
        }}
        onAdLoaded={() => {
          console.log('[AdBanner] Ad loaded successfully');
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
  },
});
