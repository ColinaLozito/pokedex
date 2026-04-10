module.exports = (api) => {
  api.cache(true)
  return {
    presets: [['babel-preset-expo', { jsxRuntime: 'automatic' }]],
    plugins: [
      [
        '@tamagui/babel-plugin',
        {
          config: './theme/tamagui.config.ts',
          components: ['tamagui'],
          importsWhitelist: ['constants.js', 'colors.js'],
          disableExtractInlineCSS: true,
        },
      ],

      // NOTE: this is only necessary if you are using reanimated for animations
      'react-native-reanimated/plugin',
    ],
  }
}
