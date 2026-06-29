import { LoadingOverlay } from '@dawn/ui';
import { useUIStore } from '@/stores/uiStore';

export function LoadingOverlayHost() {
  const isLoading = useUIStore((s) => s.isLoading);
  return <LoadingOverlay visible={isLoading} />;
}
