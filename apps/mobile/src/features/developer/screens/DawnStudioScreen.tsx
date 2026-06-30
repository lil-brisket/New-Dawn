import { useState, createElement } from 'react';
import { Platform, View, Text, StyleSheet, Linking } from 'react-native';
import { WebView } from 'react-native-webview';
import { Redirect } from 'expo-router';
import { TopBar, Button, useTheme } from '@dawn/ui';
import { ScreenLayout } from '@/layouts/ScreenLayout';
import { FeatureFlags } from '@/constants/FeatureFlags';
import { EDITOR_START_HINT, getEditorUrl } from '@/constants/editorUrl';
import { ROUTES } from '@/navigation/routes';
import { NavigationService } from '@/navigation/NavigationService';

function EditorWebFrame({ uri }: { uri: string }) {
  const { theme } = useTheme();
  const { colors } = theme;
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <View style={styles.fallback}>
        <Text style={{ color: colors.text, marginBottom: 8 }}>Could not load Dawn Studio</Text>
        <Text style={{ color: colors.textMuted, fontSize: 13, marginBottom: 16 }}>
          {EDITOR_START_HINT}
        </Text>
        <Text style={{ color: colors.textMuted, fontSize: 12, marginBottom: 16 }}>{uri}</Text>
        {Platform.OS === 'web' ? (
          <Button title="Open in browser" onPress={() => Linking.openURL(uri)} />
        ) : null}
      </View>
    );
  }

  if (Platform.OS === 'web') {
    return (
      <View style={styles.frame}>
        {createElement('iframe', {
          title: 'Dawn Studio',
          src: uri,
          style: { flex: 1, width: '100%', height: '100%', border: 'none', background: '#1a1a1f' },
        })}
      </View>
    );
  }

  return (
    <WebView
      source={{ uri }}
      style={styles.webview}
      onError={() => setFailed(true)}
      onHttpError={() => setFailed(true)}
      startInLoadingState
      allowsBackForwardNavigationGestures
    />
  );
}

export function DawnStudioScreen() {
  const editorUrl = getEditorUrl();

  if (!FeatureFlags.developerTools) {
    return <Redirect href={ROUTES.HOME} />;
  }

  return (
    <ScreenLayout>
      <TopBar title="Dawn Studio" onBack={() => NavigationService.navigate(ROUTES.DEVELOPER)} />
      <View style={styles.frame}>
        <EditorWebFrame uri={editorUrl} />
      </View>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  frame: { flex: 1 },
  webview: { flex: 1, backgroundColor: '#1a1a1f' },
  fallback: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
});
