const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

// Ensure Metro can resolve CommonJS and ESM files shipped by some packages
config.resolver = {
  ...config.resolver,
  sourceExts: Array.from(new Set([...(config.resolver?.sourceExts ?? []), 'cjs', 'mjs'])),
};

module.exports = withNativeWind(config, { input: './global.css' });
