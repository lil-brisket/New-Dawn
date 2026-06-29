import { View } from 'react-native';
import { TopBar, useTheme } from '@dawn/ui';
import { ScreenLayout } from '@/layouts/ScreenLayout';
import { BattleLayout } from '@/layouts/BattleLayout';
import { BattleHeader } from '../presentation/BattleHeader';
import { BattleViewport } from '../presentation/BattleViewport';
import { BattleBottomBar } from '../presentation/BattleBottomBar';
import { BattleCommandBar } from '../presentation/BattleCommandBar';
import { BattleLog } from '../presentation/BattleLog';

export function BattleScreen() {
  const { theme } = useTheme();
  const { spacing } = theme;

  return (
    <ScreenLayout>
      <TopBar title="Battle" />
      <BattleLayout
        header={<BattleHeader />}
        viewport={<BattleViewport />}
        bottomBar={
          <View style={{ gap: spacing.md }}>
            <BattleBottomBar />
            <BattleCommandBar />
            <BattleLog />
          </View>
        }
      />
    </ScreenLayout>
  );
}
