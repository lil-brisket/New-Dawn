import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@dawn/ui';

export type AppIconName =
  | 'home'
  | 'world'
  | 'characters'
  | 'inventory'
  | 'guild'
  | 'shop'
  | 'summon'
  | 'quests'
  | 'profile'
  | 'settings'
  | 'battle'
  | 'bell'
  | 'gold'
  | 'gem'
  | 'developer'
  | 'back'
  | 'close';

const ICON_MAP: Record<AppIconName, keyof typeof Ionicons.glyphMap> = {
  home: 'home-outline',
  world: 'map-outline',
  characters: 'people-outline',
  inventory: 'bag-outline',
  guild: 'shield-outline',
  shop: 'cart-outline',
  summon: 'sparkles-outline',
  quests: 'flag-outline',
  profile: 'person-outline',
  settings: 'settings-outline',
  battle: 'flash-outline',
  bell: 'notifications-outline',
  gold: 'logo-bitcoin',
  gem: 'diamond-outline',
  developer: 'code-slash-outline',
  back: 'chevron-back',
  close: 'close',
};

type IconSize = 'sm' | 'md' | 'lg' | 'xl';

export interface AppIconProps {
  name: AppIconName;
  size?: IconSize;
  color?: string;
  accessibilityLabel?: string;
}

export function AppIcon({ name, size = 'md', color, accessibilityLabel }: AppIconProps) {
  const { theme } = useTheme();
  const { icons, colors } = theme;
  const iconSize = icons[size];
  const iconColor = color ?? colors.text;

  return (
    <Ionicons
      name={ICON_MAP[name]}
      size={iconSize}
      color={iconColor}
      accessibilityRole="image"
      accessibilityLabel={accessibilityLabel ?? name}
    />
  );
}
