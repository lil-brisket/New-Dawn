import { useEffect, useState } from 'react';
import { Text } from 'react-native';
import { useTheme } from '@dawn/ui';
import { PlaceholderScreen } from '@/components/PlaceholderScreen';
import { playerRepository } from '@/services/api/player';

export function CharactersScreen() {
  const { theme } = useTheme();
  const { colors, spacing, typography } = theme;
  const [names, setNames] = useState<string[]>([]);

  useEffect(() => {
    playerRepository.getCharacters().then((chars) => setNames(chars.map((c) => c.name)));
  }, []);

  return (
    <PlaceholderScreen
      title="Heroes"
      icon="characters"
      description="Build your party, upgrade skills, and prepare for battle."
    >
      {names.map((name) => (
        <Text
          key={name}
          style={{
            color: colors.textMuted,
            fontSize: typography.fontSize.sm,
            marginTop: spacing.xs,
          }}
        >
          {name}
        </Text>
      ))}
    </PlaceholderScreen>
  );
}
