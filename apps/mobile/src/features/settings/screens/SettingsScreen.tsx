import { View, Text } from 'react-native';
import { Card, Button, useTheme } from '@dawn/ui';
import { router } from 'expo-router';
import { useSettingsStore } from '@/stores/settingsStore';
import { useAuthStore } from '@/stores/authStore';
import { MainLayout } from '@/layouts/MainLayout';

export function SettingsScreen() {
  const { colors, spacing } = useTheme();
  const musicVolume = useSettingsStore((s) => s.musicVolume);
  const logout = useAuthStore((s) => s.logout);

  const handleLogout = () => {
    logout();
    router.replace('/(auth)/login');
  };

  return (
    <MainLayout title="Settings">
      <Card title="Audio">
        <Text style={{ color: colors.textSecondary }}>Music: {Math.round(musicVolume * 100)}%</Text>
      </Card>
      <View style={{ marginTop: spacing.xl }}>
        <Button title="Log Out" variant="danger" onPress={handleLogout} />
      </View>
    </MainLayout>
  );
}
