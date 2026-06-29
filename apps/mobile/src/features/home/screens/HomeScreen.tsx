import { Text, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { Card, Button, useTheme } from '@dawn/ui';
import { MainLayout } from '@/layouts/MainLayout';

const FEATURES = [
  { title: 'World', desc: 'Explore the realm', route: '/(main)/world' },
  { title: 'Battle', desc: 'Tactical combat', route: '/battle/demo' },
  { title: 'Summon', desc: 'Gacha heroes', route: '/(main)/summon' },
  { title: 'Shop', desc: 'Equipment & items', route: '/(main)/shop' },
];

export function HomeScreen() {
  const { colors, spacing } = useTheme();

  return (
    <MainLayout title="Dawn">
      <ScrollView contentContainerStyle={{ gap: spacing.md }}>
        <Text style={{ color: colors.textSecondary, marginBottom: spacing.sm }}>
          Welcome, Adventurer
        </Text>
        {FEATURES.map((f) => (
          <Card key={f.title} title={f.title} subtitle={f.desc}>
            <Button
              title="Go"
              size="sm"
              variant="secondary"
              onPress={() => router.push(f.route as never)}
              style={{ marginTop: spacing.sm, alignSelf: 'flex-start' }}
            />
          </Card>
        ))}
      </ScrollView>
    </MainLayout>
  );
}
