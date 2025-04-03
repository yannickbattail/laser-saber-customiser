export function _throw(error: Error): never {
  throw error;
}

export function clone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj)) as T;
}
