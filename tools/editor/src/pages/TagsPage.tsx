import { ContentEditorLayout } from '../components/ContentEditorLayout';
import { TagForm } from '../components/forms/TagForm';

export function TagsPage() {
  return (
    <ContentEditorLayout
      domain="tags"
      title="Tags"
      renderForm={(draft, onChange) => <TagForm draft={draft} onChange={onChange} />}
    />
  );
}
