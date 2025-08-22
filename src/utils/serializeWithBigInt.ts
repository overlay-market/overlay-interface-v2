export const serializeWithBigInt = (obj: any): string => {
  return JSON.stringify(obj, (_, value) =>
    typeof value === 'bigint' ? value.toString() + 'n' : value
  );
}

export const deserializeWithBigInt = <T = any>(json: string): T => {
  return JSON.parse(json, (_, value) => {
    if (typeof value === 'string' && /^\d+n$/.test(value)) {
      return BigInt(value.slice(0, -1));
    }
    return value;
  });
}