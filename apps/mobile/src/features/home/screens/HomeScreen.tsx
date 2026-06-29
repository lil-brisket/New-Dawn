import { View, Text, ScrollView, StyleSheet, Platform, Pressable } from 'react-native';
import { useTheme } from '@dawn/ui';
import { MainLayout } from '@/layouts/MainLayout';
import { FeatureHubCard } from '@/components/FeatureHubCard';
import { CurrencyDisplay } from '@/components/CurrencyDisplay';
import { NotificationBell } from '@/components/NotificationBell';
import { NavigationService } from '@/navigation/NavigationService';
import { ROUTES } from '@/navigation/routes';
import { FeatureFlags } from '@/constants/FeatureFlags';
import { AppConstants } from '@/constants/AppConstants';

const HUB_FEATURES = [
  {
    title: 'World',
    subtitle: 'Explore the realm',
    icon: 'world' as const,
    route: ROUTES.WORLD,
    flag: null,
  },
  {
    title: 'Characters',
    subtitle: 'Manage your heroes',
    icon: 'characters' as const,
    route: ROUTES.CHARACTERS,
    flag: null,
  },
  {
    title: 'Inventory',
    subtitle: 'Items and equipment',
    icon: 'inventory' as const,
    route: ROUTES.INVENTORY,
    flag: null,
  },
  {
    title: 'Guild',
    subtitle: 'Join your fellowship',
    icon: 'guild' as const,
    route: ROUTES.GUILD,
    flag: 'guild' as const,
  },
  {
    title: 'Quests',
    subtitle: 'Story missions',
    icon: 'quests' as const,
    route: ROUTES.QUESTS,
    flag: null,
  },
  {
    title: 'Shop',
    subtitle: 'Equipment and items',
    icon: 'shop' as const,
    route: ROUTES.SHOP,
    flag: 'shop' as const,
  },
  {
    title: 'Summon',
    subtitle: 'Recruit new heroes',
    icon: 'summon' as const,
    route: ROUTES.SUMMON,
    flag: 'summoning' as const,
  },
];

export function HomeScreen() {
  const { colors, spacing } = useTheme();

  const openDeveloper = () => {
    if (FeatureFlags.developerTools) {
      NavigationService.navigate(ROUTES.DEVELOPER);
    }
  };

  return (
    <MainLayout title={AppConstants.APP_NAME}>
      <ScrollView contentContainerStyle={{ gap: spacing.md }}>
        <View style={[styles.headerRow, { marginBottom: spacing.sm }]}>
          <Pressable
            style={{ flex: 1 }}
            onLongPress={Platform.OS === 'web' ? undefined : openDeveloper}
            onPress={
              Platform.OS === 'web' && FeatureFlags.developerTools ? openDeveloper : undefined
            }
            accessibilityRole="button"
            accessibilityLabel="Welcome message"
            accessibilityHint={
              Platform.OS === 'web'
                ? 'Opens developer menu in development builds'
                : 'Long press to open developer menu'
            }
          >
            <Text style={{ color: colors.textSecondary }} maxFontSizeMultiplier={1.5}>
              Welcome, Adventurer
            </Text>
          </Pressable>
          <View style={[styles.headerActions, { gap: spacing.sm }]}>
            <CurrencyDisplay />
            <NotificationBell />
          </View>
        </View>
        {HUB_FEATURES.map((feature) => {
          const disabled = feature.flag ? !FeatureFlags[feature.flag] : false;
          return (
            <FeatureHubCard
              key={feature.title}
              title={feature.title}
              subtitle={feature.subtitle}
              icon={feature.icon}
              disabled={disabled}
              onPress={() => NavigationService.navigate(feature.route)}
            />
          );
        })}
      </ScrollView>
    </MainLayout>
  );
}

const styles = StyleSheet.create({
  headerRow: { flexDirection: 'row', alignItems: 'center' },
  headerActions: { flexDirection: 'row', alignItems: 'center' },
});
