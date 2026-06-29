let counter = 0;

export function createId(prefix = 'id'): string {
  counter += 1;
  return `${prefix}_${counter}_${Date.now().toString(36)}`;
}

export function resetIdCounter(): void {
  counter = 0;
}
