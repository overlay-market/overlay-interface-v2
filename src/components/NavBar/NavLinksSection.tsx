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
// import {
//   RocketIcon,
//   RocketActiveIcon,
// } from "../../assets/icons/navBar-icons/rocket";
// import {
//   PowercardIcon,
//   PowercardActiveIcon,
// } from "../../assets/icons/navBar-icons/powercard";
import {
  StakeIcon,
  StakeActiveIcon,
} from "../../assets/icons/navBar-icons/stake";
import { DEFAULT_MARKET, NAVBAR_MODE } from "../../constants/applications";
import { useCurrentMarketState } from "../../state/currentMarket/hooks";
// import { useMediaQuery } from "../../hooks/useMediaQuery";
// import {
//   TrophyActiveIcon,
//   TrophyIcon,
// } from "../../assets/icons/navBar-icons/trophy";
import {
  MarketsActiveIcon,
  MarketsIcon,
} from "../../assets/icons/navBar-icons/markets";

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

  const activeMarket = currentMarket?.marketName ?? DEFAULT_MARKET;
  const encodedMarket = encodeURIComponent(activeMarket);
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
      to: `/trade?market=${encodedMarket}`,
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
    // {
    //   to: "/powercards",
    //   label: "PowerCards",
    //   icon: PowercardIcon,
    //   activeIcon: PowercardActiveIcon,
    //   showOnMobile: !isMobile,
    // },
    // {
    //   to: "/leaderboard",
    //   label:
    //     isMobile && mode === NAVBAR_MODE.DEFAULT ? "Leaders" : "Leaderboard",
    //   icon: TrophyIcon,
    //   activeIcon: TrophyActiveIcon,
    //   showOnMobile: true,
    // },
    {
      to: "/earn",
      label: "Earn",
      icon: StakeIcon,
      activeIcon: StakeActiveIcon,
      showOnMobile: true,
    },
    // {
    //   to: "/airdrops",
    //   label: "Airdrops",
    //   icon: AirdropsIcon,
    //   activeIcon: AirdropsActiveIcon,
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
