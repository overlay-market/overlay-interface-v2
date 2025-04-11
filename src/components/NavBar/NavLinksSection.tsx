import React from "react";
import { Flex } from "@radix-ui/themes";
import StyledNavLink from "./StyledNavLink";
import {
  PortfolioIcon,
  PortfolioActiveIcon,
} from "../../assets/icons/navBar-icons/portfolio";
import {
  TradeIcon,
  TradeActiveIcon,
} from "../../assets/icons/navBar-icons/trade";
import {
  PowercardIcon,
  PowercardActiveIcon,
} from "../../assets/icons/navBar-icons/powercard";
// import {
// TrophyActiveIcon,
// TrophyIcon,
// } from "../../assets/icons/navBar-icons/trophy";
import { DEFAULT_MARKET_ID, NAVBAR_MODE } from "../../constants/applications";
import { useCurrentMarketState } from "../../state/currentMarket/hooks";
import {
  MarketsActiveIcon,
  MarketsIcon,
} from "../../assets/icons/navBar-icons/markets";
// import {
//   RocketIcon,
//   RocketActiveIcon,
// } from "../../assets/icons/navBar-icons/rocket";
// import {
//   StakeIcon,
//   StakeActiveIcon,
// } from "../../assets/icons/navBar-icons/stake";
// import { useMediaQuery } from "../../hooks/useMediaQuery";

export interface NavLinkAsset {
  to: string;
  label: string;
  icon: React.ComponentType<{ size?: number }>;
  activeIcon: React.ComponentType<{ size?: number }>;
  showOnMobile: boolean;
}

type NavLinksSectionProps = {
  mode?: NAVBAR_MODE;
};

const NavLinksSection: React.FC<NavLinksSectionProps> = ({
  mode = NAVBAR_MODE.DEFAULT,
}) => {
  const { currentMarket } = useCurrentMarketState();

  const activeMarketId = currentMarket?.marketId ?? DEFAULT_MARKET_ID;
  // const isMobile = useMediaQuery("(max-width: 767px)");

  const NAV_LINKS: Array<NavLinkAsset> = [
    {
      to: "/markets",
      label: "Markets",
      icon: MarketsIcon,
      activeIcon: MarketsActiveIcon,
      showOnMobile: true,
    },
    {
      to: `/trade/${activeMarketId}`,
      label: "Trade",
      icon: TradeIcon,
      activeIcon: TradeActiveIcon,
      showOnMobile: true,
    },
    {
      to: "/portfolio",
      label: "Portfolio",
      icon: PortfolioIcon,
      activeIcon: PortfolioActiveIcon,
      showOnMobile: true,
    },
    {
      to: "/power-cards",
      label: "PowerCards",
      icon: PowercardIcon,
      activeIcon: PowercardActiveIcon,
      showOnMobile: true,
    },
    // {
    //   to: "/test-erc20",
    //   label: "Test ERC20",
    //   icon: PowercardIcon,
    //   activeIcon: PowercardActiveIcon,
    //   showOnMobile: true,
    // },
    // {
    //   to: "/leaderboard",
    //   label:
    //     isMobile && mode === NAVBAR_MODE.DEFAULT ? "Leaders" : "Leaderboard",
    //   icon: <TrophyIcon />,
    //   activeIcon: <TrophyActiveIcon />,
    //   showOnMobile: true,
    // },
    // {
    //   to: "/stake",
    //   label: "Stake",
    //   icon: <StakeIcon />,
    //   activeIcon: <StakeActiveIcon />,
    //   showOnMobile: true,
    // },
  ];

  return (
    <>
      {mode === NAVBAR_MODE.DEFAULT && (
        <Flex
          direction={{ initial: "row", sm: "column" }}
          gap={{ initial: "4px", sm: "8px" }}
        >
          {NAV_LINKS.filter((link) => link.showOnMobile).map((link) => (
            <StyledNavLink key={link.label} link={link} mode={mode} />
          ))}
        </Flex>
      )}
      {mode === NAVBAR_MODE.BURGER && (
        <Flex direction={"column"} gap="0">
          {NAV_LINKS.map((link) => (
            <StyledNavLink key={link.label} link={link} mode={mode} />
          ))}
        </Flex>
      )}
    </>
  );
};

export default NavLinksSection;
