import { Routes, Route } from 'react-router-dom';
import { AppShell } from './shell/AppShell';
import { DashboardPage } from './pages/DashboardPage';
import { SkillsPage } from './pages/SkillsPage';
import { TagsPage } from './pages/TagsPage';
import { EnemiesPage } from './pages/EnemiesPage';
import { PlaceholderPage } from './pages/PlaceholderPage';
import { TestingPage } from './pages/TestingPage';
import { CombatStatsPage } from './pages/CombatStatsPage';
import { SettingsPage } from './pages/SettingsPage';

export function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<DashboardPage />} />
        <Route path="skills" element={<SkillsPage />} />
        <Route path="tags" element={<TagsPage />} />
        <Route path="enemies" element={<EnemiesPage />} />
        <Route path="combat-stats" element={<CombatStatsPage />} />
        <Route path="characters" element={<PlaceholderPage title="Characters" />} />
        <Route path="items" element={<PlaceholderPage title="Items" />} />
        <Route path="equipment" element={<PlaceholderPage title="Equipment" />} />
        <Route path="ai" element={<PlaceholderPage title="AI Profiles" />} />
        <Route path="maps" element={<PlaceholderPage title="Maps" />} />
        <Route path="quests" element={<PlaceholderPage title="Quests" />} />
        <Route path="dialogue" element={<PlaceholderPage title="Dialogue" />} />
        <Route path="guilds" element={<PlaceholderPage title="Guilds" />} />
        <Route
          path="balance"
          element={
            <PlaceholderPage
              title="Balance Mode"
              description="Run batch simulations — coming soon."
            />
          }
        />
        <Route path="analytics" element={<PlaceholderPage title="Analytics" />} />
        <Route path="testing" element={<TestingPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>
    </Routes>
  );
}
