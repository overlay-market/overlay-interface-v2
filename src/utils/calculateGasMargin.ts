export function calculateGasMargin(value: bigint): bigint {
  return (value * 12000n) / 10000n
}