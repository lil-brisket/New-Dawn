import { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { Button, useTheme } from '@dawn/ui';
import { AuthLayout } from '@/layouts/AuthLayout';
import { GradientPanel } from '@/components/GradientPanel';
import { NavigationService } from '@/navigation/NavigationService';
import { ROUTES } from '@/navigation/routes';
import { useAuthStore } from '@/stores/authStore';
import { useNotificationStore } from '@/stores/notificationStore';
import { authRepository } from '@/services/api/auth';
import { AppConstants } from '@/constants/AppConstants';

export function LoginScreen() {
  const { colors, spacing, typography } = useTheme();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const login = useAuthStore((s) => s.login);
  const showToast = useNotificationStore((s) => s.showToast);

  const handleLogin = async () => {
    const { token } = await authRepository.login(
      username || 'player@dawn.game',
      password || 'password',
    );
    login(token);
    NavigationService.replace(ROUTES.HOME);
  };

  const handleCreateAccount = () => {
    showToast('Account creation coming soon.');
  };

  return (
    <AuthLayout>
      <View style={{ gap: spacing.xl }}>
        <View style={styles.logoBlock}>
          <Text
            style={{
              color: colors.accent,
              fontSize: typography.fontSize['3xl'],
              fontWeight: typography.fontWeight.bold,
              letterSpacing: 6,
              textAlign: 'center',
            }}
            accessibilityRole="header"
          >
            {AppConstants.APP_NAME.toUpperCase()}
          </Text>
          <Text
            style={{ color: colors.textSecondary, textAlign: 'center', marginTop: spacing.sm }}
            maxFontSizeMultiplier={1.5}
          >
            Enter the realm
          </Text>
        </View>

        <GradientPanel>
          <View style={{ gap: spacing.md }}>
            <TextInput
              placeholder="Username"
              placeholderTextColor={colors.textMuted}
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              accessibilityLabel="Username"
              style={[
                styles.input,
                {
                  color: colors.text,
                  borderColor: colors.border,
                  backgroundColor: colors.backgroundElevated,
                  padding: spacing.md,
                  borderRadius: 8,
                },
              ]}
            />
            <TextInput
              placeholder="Password"
              placeholderTextColor={colors.textMuted}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              accessibilityLabel="Password"
              style={[
                styles.input,
                {
                  color: colors.text,
                  borderColor: colors.border,
                  backgroundColor: colors.backgroundElevated,
                  padding: spacing.md,
                  borderRadius: 8,
                },
              ]}
            />
            <Button title="Login" onPress={handleLogin} accessibilityLabel="Login" />
            <Button
              title="Create Account"
              variant="secondary"
              onPress={handleCreateAccount}
              accessibilityLabel="Create account"
            />
          </View>
        </GradientPanel>
      </View>
    </AuthLayout>
  );
}

const styles = StyleSheet.create({
  logoBlock: { alignItems: 'center' },
  input: { borderWidth: 1 },
});
