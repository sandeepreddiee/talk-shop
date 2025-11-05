import { PreferencesPanel } from '@/components/PreferencesPanel';

export default function Account() {
  return (
    <main id="main-content" className="container py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Accessibility Preferences</h1>
      <PreferencesPanel />
    </main>
  );
}
