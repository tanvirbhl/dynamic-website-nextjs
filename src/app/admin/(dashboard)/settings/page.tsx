import { getGlobalSettings } from '@/actions/admin/settings';
import { SettingsForm } from '@/components/admin/SettingsForm';

export const metadata = { title: 'Settings | Nova CMS' };

export default async function AdminSettingsRoute() {
  // Fetch settings serverside
  const settings = await getGlobalSettings();

  return <SettingsForm initialSettings={settings} />;
}