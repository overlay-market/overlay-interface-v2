import React, { ReactNode } from "react";
import { Flex } from "@radix-ui/themes";
import StyledNavLink from "./StyledNavLink";
import {
  BackpackIcon,
  BackpackActiveIcon,
} from "../../assets/icons/navBar-icons/backpack";
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
// import {
//   StakeIcon,
//   StakeActiveIcon,
// } from "../../assets/icons/navBar-icons/stake";
import { DEFAULT_MARKET, NAVBAR_MODE } from "../../constants/applications";
import { useCurrentMarketState } from "../../state/currentMarket/hooks";
// import {
//   TrophyActiveIcon,
//   TrophyIcon,
// } from "../../assets/icons/navBar-icons/trophy";
// import { useMediaQuery } from "../../hooks/useMediaQuery";
import {
  AirdropsActiveIcon,
  AirdropsIcon,
} from "../../assets/icons/navBar-icons/airdrops";

export interface NavLinkAsset {
  to: string;
  label: string;
  icon: ReactNode;
  activeIcon: ReactNode;
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
      icon: <BackpackIcon />,
      activeIcon: <BackpackActiveIcon />,
      showOnMobile: true,
    },
    {
      to: `/trade?market=${encodedMarket}`,
      label: "Trade",
      icon: <TradeIcon />,
      activeIcon: <TradeActiveIcon />,
      showOnMobile: true,
    },
    {
      to: "/portfolio",
      label: "Portfolio",
      icon: <BackpackIcon />,
      activeIcon: <BackpackActiveIcon />,
      showOnMobile: true,
    },
    // {
    //   to: "/powercards",
    //   label: "PowerCards",
    //   icon: <PowercardIcon />,
    //   activeIcon: <PowercardActiveIcon />,
    //   showOnMobile: !isMobile,
    // },
    // {
    //   to: "/leaderboard",
    //   label:
    //     isMobile && mode === NAVBAR_MODE.DEFAULT ? "Leaders" : "Leaderboard",
    //   icon: <TrophyIcon />,
    //   activeIcon: <TrophyActiveIcon />,
    //   showOnMobile: true,
    // },
    {
      to: "/airdrops",
      label: "Airdrops",
      icon: <AirdropsIcon />,
      activeIcon: <AirdropsActiveIcon />,
      showOnMobile: true,
    },
    // {
    //   to: "/faucet",
    //   label: "Faucet",
    //   icon: <StakeIcon />,
    //   activeIcon: <StakeActiveIcon />,
    //   showOnMobile: true,
    // },
    // {
    //   to: "/bridge",
    //   label: "Bridge",
    //   icon: <StakeIcon />,
    //   activeIcon: <StakeActiveIcon />,
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
