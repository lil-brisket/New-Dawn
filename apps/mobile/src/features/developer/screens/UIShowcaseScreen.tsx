import { useState } from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import {
  Avatar,
  Button,
  Card,
  CharacterCard,
  Dialog,
  HealthBar,
  ItemCard,
  ManaBar,
  Panel,
  ProgressBar,
  SkillCard,
  Tabs,
  useTheme,
} from '@dawn/ui';
import { MainLayout } from '@/layouts/MainLayout';
import { FeatureFlags } from '@/constants/FeatureFlags';
import { ROUTES } from '@/navigation/routes';
import { Redirect } from 'expo-router';

export function UIShowcaseScreen() {
  const { colors, spacing, typography } = useTheme();
  const [dialogVisible, setDialogVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('a');

  if (!FeatureFlags.developerTools) {
    return <Redirect href={ROUTES.HOME} />;
  }

  return (
    <MainLayout title="UI Showcase">
      <ScrollView contentContainerStyle={{ gap: spacing.md, paddingBottom: spacing['3xl'] }}>
        <Card title="Buttons">
          <View style={[styles.row, { gap: spacing.sm }]}>
            <Button title="Primary" onPress={() => {}} accessibilityLabel="Primary button" />
            <Button
              title="Secondary"
              variant="secondary"
              onPress={() => {}}
              accessibilityLabel="Secondary button"
            />
          </View>
        </Card>

        <Panel variant="elevated">
          <Text style={{ color: colors.text }}>Panel elevated</Text>
        </Panel>

        <HealthBar value={650} max={1000} />
        <ManaBar value={40} max={100} />
        <ProgressBar value={3} max={5} />

        <Avatar label="AV" size="lg" />
        <CharacterCard name="Astra" level={12} hp={800} maxHp={1000} rarity="epic" />
        <ItemCard name="Iron Sword" rarity="common" quantity={1} />
        <SkillCard name="Arcane Bolt" mpCost={12} cooldown={2} />

        <Tabs
          tabs={[
            { key: 'a', label: 'Tab A' },
            { key: 'b', label: 'Tab B' },
          ]}
          activeKey={activeTab}
          onTabPress={setActiveTab}
        />

        <Button
          title="Open Dialog"
          onPress={() => setDialogVisible(true)}
          accessibilityLabel="Open dialog"
        />
        <Dialog
          visible={dialogVisible}
          title="Dialog"
          message="Example dialog from @dawn/ui"
          onConfirm={() => setDialogVisible(false)}
          onCancel={() => setDialogVisible(false)}
        />

        <Text style={{ color: colors.textSecondary, fontSize: typography.fontSize.xs }}>
          Typography xs / sm / md samples above
        </Text>
      </ScrollView>
    </MainLayout>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', flexWrap: 'wrap' },
});
