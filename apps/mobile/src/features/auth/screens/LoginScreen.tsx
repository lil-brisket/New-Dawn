import { View, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { Button, Panel, useTheme } from '@dawn/ui';
import { ScreenLayout } from '@/layouts/ScreenLayout';
import { useAuthStore } from '@/stores/authStore';
import { authRepository } from '@/services/api/auth';

export function LoginScreen() {
  const { spacing } = useTheme();
  const login = useAuthStore((s) => s.login);

  const handleLogin = async () => {
    const { token } = await authRepository.login('player@dawn.game', 'password');
    login(token);
    router.replace('/(main)/home');
  };

  return (
    <ScreenLayout>
      <View style={[styles.container, { padding: spacing.xl }]}>
        <Panel variant="elevated">
          <Button title="Enter Dawn" onPress={handleLogin} />
        </Panel>
      </View>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center' },
});
