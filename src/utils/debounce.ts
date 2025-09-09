export const debounce = <T extends (...args: any[]) => void>(func: T, delay: number) => {
  let timer: ReturnType<typeof setTimeout>;

  return (...args: Parameters<T>): void => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func(...args);
    }, delay);
  };
};