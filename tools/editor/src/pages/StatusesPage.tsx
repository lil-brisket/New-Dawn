import { ContentEditorLayout } from '../components/ContentEditorLayout';
import { StatusForm } from '../components/forms/StatusForm';

export function StatusesPage() {
  return (
    <ContentEditorLayout
      domain="statuses"
      title="Statuses"
      renderForm={(draft, onChange) => <StatusForm draft={draft} onChange={onChange} />}
    />
  );
}
