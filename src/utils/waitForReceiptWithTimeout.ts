export const waitForReceiptWithTimeout = async (
  publicClient: any,
  txHash: string,
  timeoutMs = 60_000
): Promise<any> => {
  const timeoutPromise = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error("TRANSACTION_TIMEOUT")), timeoutMs)
  );

  return Promise.race([
    publicClient.waitForTransactionReceipt({ hash: txHash }),
    timeoutPromise,
  ]);
};