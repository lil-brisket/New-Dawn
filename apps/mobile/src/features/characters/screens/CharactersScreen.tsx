import { View } from 'react-native';
import { CharacterCard, useTheme } from '@dawn/ui';
import { defaultRegistry } from '@dawn/game-data';
import { MainLayout } from '@/layouts/MainLayout';

export function CharactersScreen() {
  const { spacing } = useTheme();
  const astra = defaultRegistry.getCharacter('char_astra');

  return (
    <MainLayout title="Heroes">
      <View style={{ gap: spacing.md }}>
        {astra ? (
          <CharacterCard
            name={astra.name}
            level={1}
            hp={astra.baseStats.hp}
            maxHp={astra.baseStats.maxHp}
            rarity={astra.rarity}
          />
        ) : null}
      </View>
    </MainLayout>
  );
}
