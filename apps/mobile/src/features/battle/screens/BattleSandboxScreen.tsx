import { BattleProvider } from '../provider/BattleProvider';
import { BattlePresenter } from '../presenter/BattlePresenter';

export function BattleSandboxScreen() {
  return (
    <BattleProvider initialBattleId="training">
      <BattlePresenter />
    </BattleProvider>
  );
}
