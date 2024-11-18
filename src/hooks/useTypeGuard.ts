import { useCallback } from 'react';

const useTypeGuard = <T extends object>(property: keyof T): ((value: unknown) => value is T) =>
  useCallback((value: unknown): value is T => {
    return value != null && typeof value === 'object' && property in (value as T);
  }, [property]);

  export default useTypeGuard;