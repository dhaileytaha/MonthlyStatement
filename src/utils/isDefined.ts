export const isDefined = <T>(value: T | undefined | null): value is T =>
  typeof value !== 'undefined' && value !== null;
