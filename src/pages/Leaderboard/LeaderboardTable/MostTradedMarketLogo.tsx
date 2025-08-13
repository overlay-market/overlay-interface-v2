import { getMarketLogo } from "../../../utils/getMarketLogo";
import { ExtendedUserData } from "../types";
import * as Tooltip from "@radix-ui/react-tooltip";
import { MarketLogo } from "./leaderboard-table-styles";
import theme from "../../../theme";
import useActiveMarkets from "../../../hooks/useActiveMarkets";
import useRedirectToTradePage from "../../../hooks/useRedirectToTradePage";

interface MostTradedMarketCellProps {
  rank: ExtendedUserData;
}

const MostTradedMarketLogo = ({ rank }: MostTradedMarketCellProps) => {
  const redirectToTradePage = useRedirectToTradePage();
  const { data: markets } = useActiveMarkets();
  const market = markets?.find((m) => m.id === rank.mostTradedMarket.marketId);
  if (!rank) return null;

  return (
    <Tooltip.Provider delayDuration={200}>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <MarketLogo
            src={getMarketLogo(market?.marketId || "")}
            alt="logo"
            onClick={() =>
              market?.marketId && redirectToTradePage(market.marketId)
            }
          />
        </Tooltip.Trigger>
        <Tooltip.Content
          style={{
            color: theme.color.green2,
            padding: "4px 8px",
            borderRadius: "4px",
            fontSize: "14px",
          }}
        >
          {market?.marketName}
        </Tooltip.Content>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
};

export default MostTradedMarketLogo;
