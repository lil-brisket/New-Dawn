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

export function useStatusOptions(): ContentRefOption[] {
  const [statuses, setStatuses] = useState<ContentRefOption[]>([]);
  useEffect(() => {
    listContent('statuses')
      .then((list) =>
        setStatuses(
          list
            .map((s) => ({
              id: s.id,
              name: s.name,
            }))
            .sort((a, b) => a.name.localeCompare(b.name)),
        ),
      )
      .catch(console.error);
  }, []);
  return statuses;
}

export function useEnemyOptions(): ContentRefOption[] {
  const [enemies, setEnemies] = useState<ContentRefOption[]>([]);
  useEffect(() => {
    listContent('enemies')
      .then((list) => setEnemies(list.map((e) => ({ id: e.id, name: e.name }))))
      .catch(console.error);
  }, []);
  return enemies;
}
