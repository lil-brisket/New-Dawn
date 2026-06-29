const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');
const path = require('path');

const projectRoot = __dirname;
const monorepoRoot = path.resolve(projectRoot, '../..');

const config = getDefaultConfig(projectRoot);

config.watchFolders = [monorepoRoot];
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(monorepoRoot, 'node_modules'),
];

// Pin core RN packages to the app install so workspace packages (@dawn/ui, etc.)
// don't resolve a second copy from packages/*/node_modules.
const singletonPackages = [
  'react',
  'react-dom',
  'react-native',
  'expo',
  'expo-router',
  'expo-modules-core',
  'expo-constants',
  '@expo/metro-runtime',
  'react-native-reanimated',
  'react-native-gesture-handler',
  'react-native-screens',
  'react-native-safe-area-context',
  'react-native-worklets',
  '@babel/runtime',
];

config.resolver.extraNodeModules = singletonPackages.reduce((acc, packageName) => {
  try {
    acc[packageName] = path.dirname(
      require.resolve(`${packageName}/package.json`, { paths: [projectRoot] }),
    );
  } catch {
    // Optional transitive dependency — skip when not installed in the app.
  }
  return acc;
}, {});

const zustandMiddlewarePath = require.resolve('zustand/middleware');
const defaultResolveRequest = config.resolver.resolveRequest;

config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === 'zustand/middleware') {
    return { filePath: zustandMiddlewarePath, type: 'sourceFile' };
  }

  if (singletonPackages.includes(moduleName)) {
    try {
      return {
        filePath: require.resolve(moduleName, { paths: [projectRoot] }),
        type: 'sourceFile',
      };
    } catch {
      // Fall through to default resolution.
    }
  }

  if (defaultResolveRequest) {
    return defaultResolveRequest(context, moduleName, platform);
  }

  return context.resolveRequest(context, moduleName, platform);
};

module.exports = withNativeWind(config, { input: './global.css' });
