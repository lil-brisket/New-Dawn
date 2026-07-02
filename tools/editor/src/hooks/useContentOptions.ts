import { useEffect, useState } from 'react';
import { listContent } from '../api/contentApi';
import type { ContentRefOption } from '../components/fields/ContentRefSelect';

export function useSkillOptions(): ContentRefOption[] {
  const [skills, setSkills] = useState<ContentRefOption[]>([]);
  useEffect(() => {
    listContent('skills')
      .then((list) => setSkills(list.map((s) => ({ id: s.id, name: s.name }))))
      .catch(console.error);
  }, []);
  return skills;
}

export function useTagOptions(): ContentRefOption[] {
  const [tags, setTags] = useState<ContentRefOption[]>([]);
  useEffect(() => {
    listContent('tags')
      .then((list) => setTags(list.map((s) => ({ id: s.id, name: s.name }))))
      .catch(console.error);
  }, []);
  return tags;
}

/** @deprecated Use useTagOptions */
export const useStatusOptions = useTagOptions;

export function useEnemyOptions(): ContentRefOption[] {
  const [enemies, setEnemies] = useState<ContentRefOption[]>([]);
  useEffect(() => {
    listContent('enemies')
      .then((list) => setEnemies(list.map((e) => ({ id: e.id, name: e.name }))))
      .catch(console.error);
  }, []);
  return enemies;
}
