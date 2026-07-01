import type { ElementType } from '@dawn/types';
import { EDITOR_ELEMENTS } from './constants';

/** Skill metadata "None" maps to physical (non-elemental) damage at runtime. */
export function skillElementToDamageElement(element: ElementType | '' | undefined): ElementType {
  if (!element) return 'physical';
  return element;
}

export function damageElementToSkillElement(
  element: ElementType | undefined,
): ElementType | undefined {
  if (!element || element === 'physical') return undefined;
  return element;
}

export function formatElementLabel(value: unknown): string {
  if (value === undefined || value === '' || value === 'physical') return '—';
  const match = EDITOR_ELEMENTS.find((e) => e.value === value);
  return match?.label ?? String(value);
}

export function hasDisplayElement(value: unknown): boolean {
  return value !== undefined && value !== '' && value !== 'physical';
}
