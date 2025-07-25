export const getFromLocalStorage = <T>(
  key: string,
  defaultValue: T,
  deserialize?: (stored: string) => T
): T => {
  try {
    const stored = localStorage.getItem(key);
    if (stored === null) return defaultValue;

    if (deserialize) {
      return deserialize(stored);
    }

    if (typeof defaultValue === 'number') {
      const parsed = parseInt(stored, 10);
      return isNaN(parsed) ? defaultValue : (parsed as T);
    }

    if (typeof defaultValue === 'boolean') {
      return (stored === 'true') as T;
    }

    return stored as T;
  } catch (error) {
    console.warn(`Failed to read ${key} from localStorage:`, error);
    return defaultValue;
  }
};