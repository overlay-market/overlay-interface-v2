import { Flex } from "@radix-ui/themes";
import { NavLinkAsset } from "./NavLinksSection";
import { ActiveLabel, StyledBox, StyledLink } from "./styled-nav-link-styles";
import React from "react";

const StyledNavLink: React.FC<NavLinkAsset> = ({
  to,
  label,
  icon,
  activeIcon,
}) => {
  return (
    <StyledLink to={to}>
      {({ isActive }) => (
        <StyledBox>
          <Flex
            direction={{ initial: "row", md: "column" }}
            justify={{ initial: "start", md: "center" }}
            align="center"
            gap={{ initial: "10px", md: "4px" }}
          >
            {isActive ? activeIcon : icon}
            {isActive ? <ActiveLabel>{label}</ActiveLabel> : <>{label}</>}
          </Flex>
        </StyledBox>
      )}
    </StyledLink>
  );
};

export default StyledNavLink;
