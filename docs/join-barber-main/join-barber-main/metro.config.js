const { getDefaultConfig, mergeConfig } = require("@react-native/metro-config");
const { withNativeWind } = require("nativewind/metro");
const path = require("path");

const config = mergeConfig(getDefaultConfig(__dirname), {
  resolver: {
    alias: {
      '~': path.resolve(__dirname),
      '@': path.resolve(__dirname, 'src'),
    },
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
  },
});

module.exports = withNativeWind(config, { input: "./src/styles/global.css" });