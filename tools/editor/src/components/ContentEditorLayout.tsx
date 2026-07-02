import { ContentList } from '../components/ContentList';
import { ReferencedByPanel } from '../components/ReferencedByPanel';
import { useContentEditor } from '../hooks/useContentEditor';
import { btnSecondary } from '../components/fields/styles';

const layout: React.CSSProperties = { display: 'flex', height: '100vh' };
const editor: React.CSSProperties = { flex: 1, overflow: 'auto', padding: 24 };
const toolbar: React.CSSProperties = {
  display: 'flex',
  gap: 8,
  marginBottom: 20,
  alignItems: 'center',
  flexWrap: 'wrap',
};

export function ContentEditorLayout({
  domain,
  title,
  renderForm,
  renderPreview,
  showReferences = false,
}: {
  domain: 'skills' | 'tags' | 'enemies';
  title: string;
  renderForm: (
    draft: Record<string, unknown>,
    onChange: (d: Record<string, unknown>) => void,
  ) => React.ReactNode;
  renderPreview?: (draft: Record<string, unknown>) => React.ReactNode;
  showReferences?: boolean;
}) {
  const editorState = useContentEditor(domain);

  return (
    <div style={layout}>
      <ContentList
        items={editorState.items}
        selectedId={editorState.selectedId}
        searchQuery={editorState.search}
        onSearchChange={editorState.setSearch}
        onSelect={editorState.loadItem}
        onNew={editorState.handleNew}
        showItemId={domain !== 'tags'}
        showNewButton={domain !== 'tags'}
      />
      <div style={editor}>
        <h1 style={{ marginTop: 0, fontSize: 22 }}>{title}</h1>
        {editorState.selectedId ? (
          <>
            <div style={toolbar}>
              <button
                type="button"
                style={btnSecondary}
                onClick={editorState.handleSave}
                disabled={editorState.saving}
              >
                Save
              </button>
              <button
                type="button"
                style={btnSecondary}
                onClick={editorState.undo}
                disabled={!editorState.canUndo}
              >
                Undo
              </button>
              <button
                type="button"
                style={btnSecondary}
                onClick={editorState.redo}
                disabled={!editorState.canRedo}
              >
                Redo
              </button>
              <button type="button" style={btnSecondary} onClick={editorState.handleDuplicate}>
                Duplicate
              </button>
              <button type="button" style={btnSecondary} onClick={editorState.handleDelete}>
                Delete
              </button>
              {editorState.message && <span style={{ color: '#8f8' }}>{editorState.message}</span>}
            </div>
            <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                {renderForm(editorState.draft, editorState.setDraft)}
              </div>
              {renderPreview && (
                <div style={{ width: 280, flexShrink: 0 }}>{renderPreview(editorState.draft)}</div>
              )}
            </div>
          </>
        ) : (
          <p style={{ color: '#666' }}>Select or create a {domain.slice(0, -1)}</p>
        )}
      </div>
      {showReferences && <ReferencedByPanel id={editorState.selectedId} />}
    </div>
  );
}
