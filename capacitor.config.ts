import { CapacitorConfig } from '@capacitor/core';

const config: CapacitorConfig = {
  appId: 'app.lovable.a3e0ee1975a441d6991902854c780b02',
  appName: 'MobileGPT',
  webDir: 'dist',
  server: {
    url: 'https://a3e0ee19-75a4-41d6-9919-02854c780b02.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    Camera: {
      permissions: ['camera', 'photos']
    }
  }
};

export default config;