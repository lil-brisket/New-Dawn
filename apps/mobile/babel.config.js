module.exports = function (api) {
  api.cache(true);

  const sharedPlugins = [
    [
      'module-resolver',
      {
        root: ['./'],
        alias: {
          '@': './src',
          '@dawn/ui': '../../packages/ui/src',
          '@dawn/game-core': '../../packages/game-core/src',
          '@dawn/game-data': '../../packages/game-data/src',
          '@dawn/types': '../../packages/types/src',
          '@dawn/utils': '../../packages/utils/src',
        },
      },
    ],
    'react-native-reanimated/plugin',
  ];

  return {
    presets: ['babel-preset-expo'],
    plugins: sharedPlugins,
    overrides: [
      {
        exclude: /node_modules/,
        presets: [['babel-preset-expo', { jsxImportSource: 'nativewind' }], 'nativewind/babel'],
      },
    ],
  };
};
