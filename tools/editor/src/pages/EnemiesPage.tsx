import { ContentEditorLayout } from '../components/ContentEditorLayout';
import { EnemyForm } from '../components/forms/EnemyForm';

export function EnemiesPage() {
  return (
    <ContentEditorLayout
      domain="enemies"
      title="Enemies"
      renderForm={(draft, onChange) => <EnemyForm draft={draft} onChange={onChange} />}
    />
  );
}
