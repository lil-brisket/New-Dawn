import { Redirect } from 'expo-router';
import { ROUTES } from '@/navigation/routes';

export default function BattleSandboxRedirect() {
  return <Redirect href={ROUTES.BATTLE_SANDBOX} />;
}
