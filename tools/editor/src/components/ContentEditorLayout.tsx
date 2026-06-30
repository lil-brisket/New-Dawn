import { ContentList } from '../components/ContentList';
import { ReferencedByPanel } from '../components/ReferencedByPanel';
import { useContentEditor } from '../hooks/useContentEditor';

const layout: React.CSSProperties = { display: 'flex', height: '100vh' };
const editor: React.CSSProperties = { flex: 1, overflow: 'auto', padding: 24 };
const toolbar: React.CSSProperties = {
  display: 'flex',
  gap: 8,
  marginBottom: 16,
  alignItems: 'center',
  flexWrap: 'wrap',
};
const btn: React.CSSProperties = {
  padding: '6px 12px',
  borderRadius: 6,
  border: '1px solid #444',
  background: '#353545',
  color: '#eee',
};

export function ContentEditorLayout({
  domain,
  title,
  renderForm,
  renderPreview,
}: {
  domain: 'skills' | 'statuses' | 'enemies';
  title: string;
  renderForm: (
    draft: Record<string, unknown>,
    onChange: (d: Record<string, unknown>) => void,
  ) => React.ReactNode;
  renderPreview?: (draft: Record<string, unknown>) => React.ReactNode;
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
      />
      <div style={editor}>
        <h1 style={{ marginTop: 0 }}>{title}</h1>
        {editorState.selectedId ? (
          <>
            <div style={toolbar}>
              <button
                type="button"
                style={btn}
                onClick={editorState.handleSave}
                disabled={editorState.saving}
              >
                Save
              </button>
              <button
                type="button"
                style={btn}
                onClick={editorState.undo}
                disabled={!editorState.canUndo}
              >
                Undo
              </button>
              <button
                type="button"
                style={btn}
                onClick={editorState.redo}
                disabled={!editorState.canRedo}
              >
                Redo
              </button>
              <button type="button" style={btn} onClick={editorState.handleDuplicate}>
                Duplicate
              </button>
              <button type="button" style={btn} onClick={editorState.handleDelete}>
                Delete
              </button>
              {editorState.message && <span style={{ color: '#8f8' }}>{editorState.message}</span>}
            </div>
            <div style={{ display: 'flex', gap: 24 }}>
              <div style={{ flex: 1 }}>{renderForm(editorState.draft, editorState.setDraft)}</div>
              {renderPreview && (
                <div style={{ width: 260 }}>{renderPreview(editorState.draft)}</div>
              )}
            </div>
          </>
        ) : (
          <p style={{ color: '#666' }}>Select or create a {domain.slice(0, -1)}</p>
        )}
      </div>
      <ReferencedByPanel id={editorState.selectedId} />
    </div>
  );
}
