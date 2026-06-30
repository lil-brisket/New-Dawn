export function updateMap<K, V>(map: ReadonlyMap<K, V>, key: K, value: V): ReadonlyMap<K, V> {
  const next = new Map(map);
  next.set(key, value);
  return next;
}

export function mapToRecord<K extends string, V>(map: ReadonlyMap<K, V>): Record<K, V> {
  return Object.fromEntries(map) as Record<K, V>;
}

export function recordToMap<K extends string, V>(record: Record<K, V>): ReadonlyMap<K, V> {
  return new Map(Object.entries(record) as [K, V][]);
}
