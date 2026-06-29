import type { ReactNode } from 'react';
import { ScrollView } from 'react-native';
import { useTheme } from '@dawn/ui';
import { MainLayout } from '@/layouts/MainLayout';
import { ComingSoonPanel } from './ComingSoonPanel';
import type { AppIconName } from './AppIcon';

export interface PlaceholderScreenProps {
  title: string;
  icon: AppIconName;
  description: string;
  children?: ReactNode;
}

export function PlaceholderScreen({ title, icon, description, children }: PlaceholderScreenProps) {
  const { theme } = useTheme();
  const { spacing } = theme;

  return (
    <MainLayout title={title}>
      <ScrollView contentContainerStyle={{ gap: spacing.md }}>
        <ComingSoonPanel title={title} description={description} icon={icon} />
        {children}
      </ScrollView>
    </MainLayout>
  );
}
