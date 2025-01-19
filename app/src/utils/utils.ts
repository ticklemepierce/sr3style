export function typedValues<T extends Record<string, unknown>>(
  obj: T,
): T[keyof T][] {
  return Object.values(obj) as T[keyof T][];
}

export function typedKeys<T extends Record<string, unknown>>(
  obj: T,
): (keyof T)[] {
  return Object.keys(obj) as (keyof T)[];
}

export function typedEnumKeys<E extends Record<string, string | number>>(
  enumObj: E,
): (keyof E & E[keyof E])[] {
  return Object.keys(enumObj).filter((key) => isNaN(Number(key))) as (keyof E &
    E[keyof E])[];
}

export function typedEntries<T extends Record<string, unknown>>(
  obj: T,
): [keyof T, T[keyof T]][] {
  return Object.entries(obj) as [keyof T, T[keyof T]][];
}
