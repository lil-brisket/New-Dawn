import { ContentEditorLayout, useSkillOptions } from '../components/ContentEditorLayout';
import { EnemyForm } from '../components/forms/EnemyForm';

export function EnemiesPage() {
  const skillOptions = useSkillOptions();
  return (
    <ContentEditorLayout
      domain="enemies"
      title="Enemies"
      renderForm={(draft, onChange) => (
        <EnemyForm draft={draft} onChange={onChange} skillOptions={skillOptions} />
      )}
    />
  );
}
