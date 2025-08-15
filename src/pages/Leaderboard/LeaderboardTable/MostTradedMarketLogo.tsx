import { getMarketLogo } from "../../../utils/getMarketLogo";
import * as Tooltip from "@radix-ui/react-tooltip";
import { MarketLogo } from "./leaderboard-table-styles";
import theme from "../../../theme";
import useRedirectToTradePage from "../../../hooks/useRedirectToTradePage";

interface MostTradedMarketLogoProps {
  marketId?: string;
  marketName?: string;
}

const MostTradedMarketLogo: React.FC<MostTradedMarketLogoProps> = ({
  marketId,
  marketName,
}) => {
  const redirectToTradePage = useRedirectToTradePage();

  if (!marketId || !marketName) return null;

  return (
    <Tooltip.Provider delayDuration={200}>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <MarketLogo
            src={getMarketLogo(marketId)}
            alt="logo"
            onClick={() => redirectToTradePage(marketId)}
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
          {marketName}
        </Tooltip.Content>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
};

export default MostTradedMarketLogo;
