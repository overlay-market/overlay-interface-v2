import { Flex } from "@radix-ui/themes";
import { NavLinkAsset } from "./NavLinksSection";
import {
  ActiveLabel,
  StyledBox,
  StyledBoxBurgerMode,
  StyledLink,
  StyledLinkBurgerMode,
} from "./styled-nav-link-styles";
import React from "react";
import { NAVBAR_MODE } from "../../constants/applications";

type StyledNavLinkProps = {
  link: NavLinkAsset;
  mode?: NAVBAR_MODE;
};

const StyledNavLink: React.FC<StyledNavLinkProps> = ({ link, mode }) => {
  return (
    <>
      {mode === NAVBAR_MODE.DEFAULT && (
        <StyledLink to={link.to}>
          {({ isActive }) => (
            <StyledBox>
              <Flex
                direction="column"
                justify="center"
                align="center"
                gap="4px"
                height={"100%"}
              >
                {isActive ? link.activeIcon : link.icon}
                {isActive ? (
                  <ActiveLabel>{link.label}</ActiveLabel>
                ) : (
                  <>{link.label}</>
                )}
              </Flex>
            </StyledBox>
          )}
        </StyledLink>
      )}
      {mode === NAVBAR_MODE.BURGER && (
        <StyledLinkBurgerMode to={link.to}>
          {({ isActive }) => (
            <StyledBoxBurgerMode>
              <Flex justify="start" align="center" gap="10px">
                {isActive ? link.activeIcon : link.icon}
                {isActive ? (
                  <ActiveLabel>{link.label}</ActiveLabel>
                ) : (
                  <>{link.label}</>
                )}
              </Flex>
            </StyledBoxBurgerMode>
          )}
        </StyledLinkBurgerMode>
      )}
    </>
  );
};

export default StyledNavLink;
