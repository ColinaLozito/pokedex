const { getDefaultConfig } = require('expo/metro-config')
const { withTamagui } = require('@tamagui/metro-plugin')

const config = getDefaultConfig(__dirname, {
  isCSSEnabled: true,
})

config.resolver.useWatchman = false

module.exports = withTamagui(config, {
  components: ['tamagui'],
  config: './theme/tamagui.config.ts',
  outputCSS: './tamagui-web.css',
})