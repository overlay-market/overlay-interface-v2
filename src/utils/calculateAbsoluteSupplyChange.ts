import { OverlaySDK } from "overlay-sdk";

export const calculateAbsoluteSupplyChange = async (
  sdk: OverlaySDK
): Promise<number | undefined> => {
  try {
    // Access the internal method to get total supply history
    const chainId = sdk["core"].chainId;

    // Import the getTotalSupplyDayHistory function from the SDK
    const { getTotalSupplyDayHistory } = await import("overlay-sdk/dist/subgraph.js");

    const totalSupplyHistory = await getTotalSupplyDayHistory(chainId);

    if (!totalSupplyHistory || totalSupplyHistory.length < 1) {
      return undefined;
    }

    // Get current supply (most recent close) and 24h ago supply (oldest open)
    // Values from subgraph are in wei (18 decimals), so we need to convert to regular tokens
    const currentTotalSupplyWei = parseFloat(totalSupplyHistory[0].close);
    const dayAgoTotalSupplyWei = parseFloat(
      totalSupplyHistory[totalSupplyHistory.length - 1].open
    );

    // Convert from wei to tokens (divide by 10^18)
    const WEI_TO_TOKEN = 1e18;
    const currentTotalSupply = currentTotalSupplyWei / WEI_TO_TOKEN;
    const dayAgoTotalSupply = dayAgoTotalSupplyWei / WEI_TO_TOKEN;

    // Return absolute change (current - 24h ago)
    return currentTotalSupply - dayAgoTotalSupply;
  } catch (error) {
    console.error("Error calculating absolute supply change:", error);
    return undefined;
  }
};