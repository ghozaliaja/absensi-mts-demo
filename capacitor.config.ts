import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.absendigitalmts.guru',
  appName: 'MTsN1 Labuhan Batu',
  webDir: 'public',
  server: {
    url: 'https://www.absendigitalmts.com/guru',
    cleartext: true
  }
};

export default config;
