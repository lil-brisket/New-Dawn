import { useState } from 'react';
import { ScrollView, View, Text, Switch, Pressable, StyleSheet } from 'react-native';
import {
  Avatar,
  Button,
  Card,
  Dialog,
  Icon,
  Modal,
  Panel,
  ProgressBar,
  TopBar,
  BottomNav,
  Window,
  useTheme,
  useToast,
  type ButtonVariant,
  type ButtonSize,
  type CardVariant,
} from '@dawn/ui';
import { MainLayout } from '@/layouts/MainLayout';
import { FeatureFlags } from '@/constants/FeatureFlags';
import { ROUTES } from '@/navigation/routes';
import { Redirect } from 'expo-router';

const BUTTON_VARIANTS: ButtonVariant[] = [
  'primary',
  'secondary',
  'danger',
  'success',
  'ghost',
  'outline',
];
const BUTTON_SIZES: ButtonSize[] = ['xs', 'sm', 'md', 'lg'];
const CARD_VARIANTS: CardVariant[] = ['default', 'elevated', 'outlined'];

function RadioGroup<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: T[];
  value: T;
  onChange: (v: T) => void;
}) {
  const { colors, spacing, typography } = useTheme();
  return (
    <View style={{ gap: spacing.sm }}>
      <Text style={{ color: colors.textSecondary, fontSize: typography.fontSize.sm }}>{label}</Text>
      <View style={styles.radioRow}>
        {options.map((opt) => (
          <Pressable key={opt} onPress={() => onChange(opt)} style={styles.radioItem}>
            <Text
              style={{
                color: value === opt ? colors.accent : colors.textMuted,
                fontSize: typography.fontSize.xs,
              }}
            >
              {value === opt ? '●' : '○'} {opt}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

function ToggleRow({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  const { colors, typography } = useTheme();
  return (
    <View style={styles.toggleRow}>
      <Text style={{ color: colors.textPrimary, fontSize: typography.fontSize.sm }}>{label}</Text>
      <Switch value={value} onValueChange={onChange} />
    </View>
  );
}

export function ComponentPlaygroundScreen() {
  const { colors, spacing, typography } = useTheme();
  const toast = useToast();

  const [buttonVariant, setButtonVariant] = useState<ButtonVariant>('primary');
  const [buttonSize, setButtonSize] = useState<ButtonSize>('md');
  const [buttonLoading, setButtonLoading] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(false);

  const [cardVariant, setCardVariant] = useState<CardVariant>('default');
  const [modalOpen, setModalOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [progressValue, setProgressValue] = useState(65);
  const [progressAnimated, setProgressAnimated] = useState(true);
  const [avatarSize, setAvatarSize] = useState<'xs' | 'sm' | 'md' | 'lg' | 'xl'>('md');
  const [avatarRarity, setAvatarRarity] = useState<'common' | 'rare' | 'epic' | 'legendary'>(
    'rare',
  );
  const [avatarOnline, setAvatarOnline] = useState(true);
  const [navActive, setNavActive] = useState(0);

  if (!FeatureFlags.developerTools) {
    return <Redirect href={ROUTES.HOME} />;
  }

  const sectionTitle = {
    color: colors.textPrimary,
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    marginBottom: spacing.sm,
  };

  return (
    <MainLayout title="Component Playground">
      <ScrollView contentContainerStyle={{ gap: spacing.xl, paddingBottom: spacing['4xl'] }}>
        {/* Button */}
        <View>
          <Text style={sectionTitle}>Button</Text>
          <View style={{ gap: spacing.md, marginBottom: spacing.md }}>
            <RadioGroup
              label="Variant"
              options={BUTTON_VARIANTS}
              value={buttonVariant}
              onChange={setButtonVariant}
            />
            <RadioGroup
              label="Size"
              options={BUTTON_SIZES}
              value={buttonSize}
              onChange={setButtonSize}
            />
            <ToggleRow label="Loading" value={buttonLoading} onChange={setButtonLoading} />
            <ToggleRow label="Disabled" value={buttonDisabled} onChange={setButtonDisabled} />
          </View>
          <Button
            title="Preview Button"
            variant={buttonVariant}
            size={buttonSize}
            loading={buttonLoading}
            disabled={buttonDisabled}
            leftIcon={<Icon name="★" size="sm" />}
            onPress={() => toast.info('Button pressed')}
            accessibilityLabel="Preview button"
          />
        </View>

        {/* Card */}
        <View>
          <Text style={sectionTitle}>Card</Text>
          <RadioGroup
            label="Variant"
            options={CARD_VARIANTS}
            value={cardVariant}
            onChange={setCardVariant}
          />
          <Card variant={cardVariant} style={{ marginTop: spacing.md }}>
            <Card.Header icon={<Icon name="C" size="sm" />}>Card Title</Card.Header>
            <Card.Body>Card body content with compound components.</Card.Body>
            <Card.Footer>
              <Button title="Action" size="sm" onPress={() => {}} />
            </Card.Footer>
          </Card>
        </View>

        {/* Panel */}
        <View>
          <Text style={sectionTitle}>Panel</Text>
          <Panel variant="elevated" borderStyle="default">
            <Panel.Header
              title="Panel Title"
              subtitle="Fantasy RPG container"
              icon={<Icon name="P" />}
            />
            <Panel.Body>
              <Text style={{ color: colors.textSecondary }}>
                Panel body via GlassSurface composition.
              </Text>
            </Panel.Body>
          </Panel>
        </View>

        {/* Window */}
        <View>
          <Text style={sectionTitle}>Window</Text>
          <Window>
            <Window.Header title="Quest Log" icon={<Icon name="W" />} />
            <Window.Body scrollable>
              <Text style={{ color: colors.textSecondary }}>
                Scrollable window body. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                do eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </Text>
            </Window.Body>
            <Window.Footer>
              <Button title="Close" variant="secondary" size="sm" onPress={() => {}} />
            </Window.Footer>
          </Window>
        </View>

        {/* Modal & Dialog */}
        <View>
          <Text style={sectionTitle}>Modal & Dialog</Text>
          <View style={[styles.row, { gap: spacing.sm }]}>
            <Button title="Open Modal" size="sm" onPress={() => setModalOpen(true)} />
            <Button
              title="Open Dialog"
              size="sm"
              variant="secondary"
              onPress={() => setDialogOpen(true)}
            />
          </View>
          <Modal visible={modalOpen} onOpenChange={setModalOpen} dismissible>
            <Modal.Content>
              <Modal.Header title="Modal Title" />
              <Modal.Body>Reanimated modal with controlled API.</Modal.Body>
              <Modal.Footer>
                <Button title="Close" onPress={() => setModalOpen(false)} />
              </Modal.Footer>
            </Modal.Content>
          </Modal>
          <Dialog
            visible={dialogOpen}
            title="Dialog"
            message="Built on Modal compound components."
            onConfirm={() => setDialogOpen(false)}
            onCancel={() => setDialogOpen(false)}
          />
        </View>

        {/* TopBar preview */}
        <View>
          <Text style={sectionTitle}>TopBar</Text>
          <TopBar
            title="Screen Title"
            subtitle="Subtitle text"
            icon={<Icon name="T" size="sm" />}
            onBack={() => toast.info('Back pressed')}
            rightActions={[<Icon key="1" name="⚙" size="sm" />]}
          />
        </View>

        {/* BottomNav */}
        <View>
          <Text style={sectionTitle}>BottomNav</Text>
          <BottomNav
            items={['Home', 'World', 'Profile'].map((label, i) => ({
              label,
              active: navActive === i,
              icon: <Icon name={label[0]} size="sm" />,
              onPress: () => setNavActive(i),
            }))}
          />
        </View>

        {/* Avatar */}
        <View>
          <Text style={sectionTitle}>Avatar</Text>
          <RadioGroup
            label="Size"
            options={['xs', 'sm', 'md', 'lg', 'xl']}
            value={avatarSize}
            onChange={setAvatarSize}
          />
          <RadioGroup
            label="Rarity"
            options={['common', 'rare', 'epic', 'legendary']}
            value={avatarRarity}
            onChange={setAvatarRarity}
          />
          <ToggleRow label="Online" value={avatarOnline} onChange={setAvatarOnline} />
          <View style={{ marginTop: spacing.md }}>
            <Avatar initials="AV" size={avatarSize} rarity={avatarRarity} online={avatarOnline} />
          </View>
        </View>

        {/* ProgressBar */}
        <View>
          <Text style={sectionTitle}>ProgressBar</Text>
          <ToggleRow label="Animated" value={progressAnimated} onChange={setProgressAnimated} />
          <View style={[styles.row, { gap: spacing.sm, marginVertical: spacing.sm }]}>
            {[25, 50, 75, 100].map((v) => (
              <Button
                key={v}
                title={`${v}%`}
                size="xs"
                variant="ghost"
                onPress={() => setProgressValue(v)}
              />
            ))}
          </View>
          <ProgressBar
            value={progressValue}
            max={100}
            animated={progressAnimated}
            label={`Progress: ${progressValue}%`}
          />
        </View>

        {/* Toast */}
        <View>
          <Text style={sectionTitle}>Toast (useToast)</Text>
          <View style={[styles.row, { gap: spacing.sm, flexWrap: 'wrap' }]}>
            <Button
              title="Success"
              size="sm"
              variant="success"
              onPress={() => toast.success('Action completed')}
            />
            <Button
              title="Warning"
              size="sm"
              variant="secondary"
              onPress={() => toast.warning('Check settings')}
            />
            <Button
              title="Error"
              size="sm"
              variant="danger"
              onPress={() => toast.error('Connection lost')}
            />
            <Button
              title="Info"
              size="sm"
              variant="ghost"
              onPress={() => toast.info('New update available')}
            />
          </View>
        </View>
      </ScrollView>
    </MainLayout>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' },
  radioRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  radioItem: { paddingVertical: 4, paddingHorizontal: 2 },
  toggleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
});
