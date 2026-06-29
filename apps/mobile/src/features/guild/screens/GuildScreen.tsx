import { useEffect, useState } from 'react';
import { Text } from 'react-native';
import { useTheme } from '@dawn/ui';
import { PlaceholderScreen } from '@/components/PlaceholderScreen';
import { guildRepository } from '@/services/api/guild';

export function GuildScreen() {
  const { colors, spacing, typography } = useTheme();
  const [summary, setSummary] = useState<string | null>(null);

  useEffect(() => {
    guildRepository.getGuild().then((guild) => {
      if (guild) {
        setSummary(`${guild.name} — Level ${guild.level} — ${guild.members} members`);
      }
    });
  }, []);

  return (
    <PlaceholderScreen
      title="Guild"
      icon="guild"
      description="Join a fellowship, participate in guild wars, and earn rewards."
    >
      {summary ? (
        <Text
          style={{
            color: colors.textMuted,
            fontSize: typography.fontSize.sm,
            marginTop: spacing.xs,
          }}
        >
          {summary}
        </Text>
      ) : null}
    </PlaceholderScreen>
  );
}
