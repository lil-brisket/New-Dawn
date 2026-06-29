import { Redirect } from 'expo-router';
import { ROUTES } from '@/navigation/routes';

export function UIShowcaseScreen() {
  return <Redirect href={ROUTES.DEVELOPER_COMPONENT_PLAYGROUND as never} />;
}
