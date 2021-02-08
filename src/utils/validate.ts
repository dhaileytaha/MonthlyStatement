import { isDefined } from './isDefined';

export const validate = <T>(value: T | null | undefined, message: string): T => {
  if (isDefined(value)) {
    return value;
  }
  throw new Error(message);
};
