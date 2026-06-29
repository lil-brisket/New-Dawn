import { Tabs } from 'expo-router';
import { useTheme } from '@dawn/ui';
import { AppIcon } from '@/components/AppIcon';
import { NavigationConstants } from '@/constants/NavigationConstants';

function TabBarIcon(name: Parameters<typeof AppIcon>[0]['name']) {
  function Icon({ color }: { color: string }) {
    return <AppIcon name={name} size="md" color={color} />;
  }
  Icon.displayName = `TabBarIcon(${name})`;
  return Icon;
}

export default function MainTabLayout() {
  const { theme } = useTheme();
  const { colors } = theme;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.surfaceElevated,
          borderTopColor: colors.border,
        },
        tabBarActiveTintColor: colors.gold,
        tabBarInactiveTintColor: colors.textMuted,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{ title: NavigationConstants.TAB_LABELS.home, tabBarIcon: TabBarIcon('home') }}
      />
      <Tabs.Screen
        name="world"
        options={{ title: NavigationConstants.TAB_LABELS.world, tabBarIcon: TabBarIcon('world') }}
      />
      <Tabs.Screen
        name="characters"
        options={{
          title: NavigationConstants.TAB_LABELS.characters,
          tabBarIcon: TabBarIcon('characters'),
        }}
      />
      <Tabs.Screen
        name="inventory"
        options={{
          title: NavigationConstants.TAB_LABELS.inventory,
          tabBarIcon: TabBarIcon('inventory'),
        }}
      />
      <Tabs.Screen
        name="guild"
        options={{ title: NavigationConstants.TAB_LABELS.guild, tabBarIcon: TabBarIcon('guild') }}
      />
      <Tabs.Screen name="shop" options={{ href: null }} />
      <Tabs.Screen name="summon" options={{ href: null }} />
      <Tabs.Screen name="quests" options={{ href: null }} />
      <Tabs.Screen
        name="profile"
        options={{
          title: NavigationConstants.TAB_LABELS.profile,
          tabBarIcon: TabBarIcon('profile'),
        }}
      />
      <Tabs.Screen name="settings" options={{ href: null }} />
      <Tabs.Screen name="developer" options={{ href: null }} />
    </Tabs>
  );
}
