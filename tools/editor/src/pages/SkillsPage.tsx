import { ContentEditorLayout } from '../components/ContentEditorLayout';
import { SkillForm, SkillPreview } from '../components/forms/SkillForm';

export function SkillsPage() {
  return (
    <ContentEditorLayout
      domain="skills"
      title="Skills"
      renderForm={(draft, onChange) => <SkillForm draft={draft} onChange={onChange} />}
      renderPreview={(draft) => <SkillPreview draft={draft} />}
    />
  );
}
