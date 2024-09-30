import { Flex } from "@radix-ui/themes";
import { NavLinkAsset } from "./NavLinksSection";
import { ActiveLabel, StyledBox, StyledLink } from "./styled-nav-link-styles";

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
            direction={"column"}
            justify="center"
            align="center"
            gap={"4px"}
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
