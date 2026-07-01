import type { ContentDomain } from '@dawn/content-pipeline/domains';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  createContent,
  deleteContent,
  getContent,
  listContent,
  saveContent,
  stripDefaults,
  type ContentListItem,
} from '../api/contentApi';
import { useUndoRedo } from '../history/useUndoRedo';
import { upgradeDraft } from '../utils/upgradeDraft';

export function useContentEditor(domain: ContentDomain) {
  const [items, setItems] = useState<ContentListItem[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const {
    state: draft,
    set: setDraft,
    reset,
    clearHistory,
    undo,
    redo,
    canUndo,
    canRedo,
  } = useUndoRedo<Record<string, unknown>>({});

  const loadList = useCallback(async () => {
    const list = await listContent(domain);
    setItems(list);
  }, [domain]);

  useEffect(() => {
    loadList().catch(console.error);
  }, [loadList]);

  const loadItem = useCallback(
    async (id: string) => {
      const data = await getContent(domain, id);
      reset(upgradeDraft(domain, data));
      setSelectedId(id);
      clearHistory();
    },
    [domain, reset, clearHistory],
  );

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return items;
    return items.filter(
      (i) =>
        i.id.toLowerCase().includes(q) ||
        i.name.toLowerCase().includes(q) ||
        (i.category?.toLowerCase().includes(q) ?? false) ||
        q.split(' ').every((term) => i.id.includes(term) || i.name.toLowerCase().includes(term)),
    );
  }, [items, search]);

  const handleSave = async () => {
    if (!selectedId || !draft.id) return;
    setSaving(true);
    setMessage('');
    try {
      const upgraded = upgradeDraft(domain, draft);
      const stripped = await stripDefaults(domain, upgraded);
      await saveContent(domain, selectedId, stripped);
      await loadList();
      clearHistory();
      setMessage('Saved & synced');
    } catch (e) {
      setMessage(e instanceof Error ? e.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const handleNew = async () => {
    const id = prompt(`New ${domain} id (e.g. skill_my_skill):`);
    if (!id) return;
    const name = prompt('Display name:') ?? id;
    const category = prompt('Category folder (e.g. magic, physical):') ?? 'misc';
    const base = upgradeDraft(domain, { id, name, category });
    await createContent(domain, base);
    await loadList();
    await loadItem(id);
  };

  const handleDuplicate = async () => {
    if (!draft.id) return;
    const newId = prompt('Duplicate as id:', `${String(draft.id)}_copy`);
    if (!newId) return;
    const copy = upgradeDraft(domain, {
      ...draft,
      id: newId,
      name: `${draft.name} (Copy)`,
    });
    await createContent(domain, copy);
    await loadList();
    await loadItem(newId);
  };

  const handleDelete = async () => {
    if (!selectedId || !confirm(`Delete ${selectedId}?`)) return;
    await deleteContent(domain, selectedId);
    setSelectedId(null);
    reset({});
    await loadList();
  };

  return {
    items: filtered,
    selectedId,
    draft,
    setDraft,
    search,
    setSearch,
    loadItem,
    handleSave,
    handleNew,
    handleDuplicate,
    handleDelete,
    saving,
    message,
    undo,
    redo,
    canUndo,
    canRedo,
  };
}
