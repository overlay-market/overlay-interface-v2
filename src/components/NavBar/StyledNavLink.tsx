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
import { useMediaQuery } from "../../hooks/useMediaQuery";

type StyledNavLinkProps = {
  link: NavLinkAsset;
  mode?: NAVBAR_MODE;
};

const StyledNavLink: React.FC<StyledNavLinkProps> = ({ link, mode }) => {
  const isMobile = useMediaQuery("(max-width: 767px)");
  const size = isMobile ? 20 : 16;

  return (
    <>
      {mode === NAVBAR_MODE.DEFAULT && (
        <StyledLink to={link.to}>
          {({ isActive }) => {
            const ActiveIcon = isActive ? link.activeIcon : link.icon;
            return (
              <StyledBox>
                <Flex
                  direction="column"
                  justify="center"
                  align="center"
                  gap="4px"
                  height={"100%"}
                >
                  <ActiveIcon size={size} />
                  {isActive ? (
                    <ActiveLabel>{link.label}</ActiveLabel>
                  ) : (
                    <>{link.label}</>
                  )}
                </Flex>
              </StyledBox>
            );
          }}
        </StyledLink>
      )}
      {mode === NAVBAR_MODE.BURGER && (
        <StyledLinkBurgerMode to={link.to}>
          {({ isActive }) => {
            const ActiveIcon = isActive ? link.activeIcon : link.icon;
            return (
              <StyledBoxBurgerMode>
                <Flex justify="start" align="center" gap="10px">
                  <ActiveIcon />
                  {isActive ? (
                    <ActiveLabel>{link.label}</ActiveLabel>
                  ) : (
                    <>{link.label}</>
                  )}
                </Flex>
              </StyledBoxBurgerMode>
            );
          }}
        </StyledLinkBurgerMode>
      )}
    </>
  );
};

export default StyledNavLink;
