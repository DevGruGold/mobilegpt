import { CapacitorConfig } from '@capacitor/core';

const config: CapacitorConfig = {
  appId: 'com.mobilegpt.offlineai',
  appName: 'MobileGPT - Offline AI',
  webDir: 'dist',
  bundledWebRuntime: false,
  server: {
    androidScheme: 'https',
    iosScheme: 'https'
  },
  plugins: {
    Camera: {
      permissions: ['camera', 'photos']
    },
    Filesystem: {
      permissions: ['storage']
    },
    Preferences: {
      group: 'MobileGPT'
    },
    SplashScreen: {
      launchShowDuration: 3000,
      launchAutoHide: true,
      backgroundColor: '#000000',
      androidSplashResourceName: 'splash',
      androidScaleType: 'CENTER_CROP',
      showSpinner: true,
      spinnerColor: '#ffffff'
    },
    StatusBar: {
      style: 'DARK'
    }
  },
  android: {
    buildOptions: {
      keystorePath: undefined,
      keystoreAlias: undefined,
      keystoreAliasPassword: undefined,
      keystorePassword: undefined,
      releaseType: 'APK'
    },
    webContentsDebuggingEnabled: true
  },
  ios: {
    scheme: 'MobileGPT',
    contentInset: 'automatic'
  }
};

export default config;