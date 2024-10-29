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
import {
  RocketIcon,
  RocketActiveIcon,
} from "../../assets/icons/navBar-icons/rocket";
import {
  PowercardIcon,
  PowercardActiveIcon,
} from "../../assets/icons/navBar-icons/powercard";
import {
  StakeIcon,
  StakeActiveIcon,
} from "../../assets/icons/navBar-icons/stake";
import { DEFAULT_MARKET_ID } from "../../constants/applications";

export interface NavLinkAsset {
  to: string;
  label: string;
  icon: ReactNode;
  activeIcon: ReactNode;
}

const NAV_LINKS: Array<NavLinkAsset> = [
  {
    to: "/markets",
    label: "Markets",
    icon: <BackpackIcon />,
    activeIcon: <BackpackActiveIcon />,
  },
  {
    to: `/trade/${DEFAULT_MARKET_ID}`,
    label: "Trade",
    icon: <TradeIcon />,
    activeIcon: <TradeActiveIcon />,
  },
  {
    to: "/portfolio",
    label: "Portfolio",
    icon: <BackpackIcon />,
    activeIcon: <BackpackActiveIcon />,
  },
  {
    to: "/powercards",
    label: "PowerCards",
    icon: <PowercardIcon />,
    activeIcon: <PowercardActiveIcon />,
  },
  {
    to: "/leaderboard",
    label: "Leaderboard",
    icon: <RocketIcon />,
    activeIcon: <RocketActiveIcon />,
  },
  {
    to: "/stake",
    label: "Stake",
    icon: <StakeIcon />,
    activeIcon: <StakeActiveIcon />,
  },
];

const NavLinksSection: React.FC = () => {
  return (
    <Flex direction={"column"} gap={"8px"}>
      {NAV_LINKS.map((link) => (
        <StyledNavLink
          key={link.label}
          to={link.to}
          label={link.label}
          icon={link.icon}
          activeIcon={link.activeIcon}
        />
      ))}
    </Flex>
  );
};

export default NavLinksSection;
