export function _throw(error: Error): never {
  throw error;
}

export function clone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj)) as T;
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export const groupBy = <T, K extends keyof any>(arr: T[], key: (i: T) => K) =>
  arr.reduce(
    (groups, item) => {
      (groups[key(item)] ||= []).push(item);
      return groups;
    },
    {} as Record<K, T[]>,
  );
