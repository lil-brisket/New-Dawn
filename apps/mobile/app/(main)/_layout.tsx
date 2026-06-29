import { Tabs } from 'expo-router';
import { useTheme } from '@dawn/ui';

export default function MainLayout() {
  const { colors } = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.backgroundElevated,
          borderTopColor: colors.border,
        },
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.textMuted,
      }}
    >
      <Tabs.Screen name="home" options={{ title: 'Home' }} />
      <Tabs.Screen name="world" options={{ title: 'World' }} />
      <Tabs.Screen name="characters" options={{ title: 'Heroes' }} />
      <Tabs.Screen name="inventory" options={{ title: 'Bag' }} />
      <Tabs.Screen name="guild" options={{ title: 'Guild' }} />
      <Tabs.Screen name="shop" options={{ href: null }} />
      <Tabs.Screen name="summon" options={{ href: null }} />
      <Tabs.Screen name="quests" options={{ href: null }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
      <Tabs.Screen name="settings" options={{ href: null }} />
    </Tabs>
  );
}
