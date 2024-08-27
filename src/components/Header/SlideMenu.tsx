import styled from "@emotion/styled";
import { Typography } from "@mui/material";
import { NavLink, useLocation } from "react-router-dom";
import { useWindowDimensions } from "../../hooks/useWindowDimensions";

const StyledMenu = styled.nav<{ open: boolean; height: number; width: number }>`
  display: flex;
  flex-direction: column;
  background: transparent;
  height: 100vh;
  text-align: left;
  backdrop-filter: blur(10px);
  width: 100%;
  height: ${({ height }) => `${height}`}px;
  position: fixed;
  top: 0;
  right: 0;
  transition: 0.3s ease-in-out;
  overflow: hidden;
  opacity: ${({ open }) => (open ? 1 : 0)};
  z-index: ${({ open }) => (open ? 1 : -1)};
  visibility: ${({ open }) => (open ? "default" : "hidden")};
`;

const StyledLink = styled(NavLink)`
  color: #ffffff;
  font-size: 14px;
  text-align: left;
  text-decoration: none;
  font-weight: 700;
  margin: 12px 0;
  border: none !important;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  padding: 2rem;
  width: 80%;

  position: absolute;
  background: #1d1e21;
  padding: 24px 24px 24px 32px;
  width: 70%;
  height: 100vh;
  right: 0;
`;

interface StyledMenuLinkProps {
  displayText: string;
  linkDestination: string;
  currentLocation: string;
}

const StyledMenuLink = ({
  displayText,
  linkDestination,
  currentLocation,
}: StyledMenuLinkProps) => {
  const active = currentLocation === linkDestination;
  const color = active ? "#12B4FF" : "#FFF";
  return <Typography sx={{ color: color }}>{displayText}</Typography>;
};

const SlideMenu = ({
  open,
  setOpen,
  ...props
}: {
  open: boolean;
  setOpen: Function;
  props?: any;
}) => {
  const isHidden = open ? true : false;
  const tabIndex = isHidden ? 0 : -1;
  const { height, width } = useWindowDimensions();
  let location = useLocation().pathname;

  return (
    <StyledMenu
      onClick={() => setOpen(!open)}
      open={open}
      aria-hidden={!isHidden}
      height={height}
      width={width}
      {...props}
    >
      {
        <Content onClick={(e) => e.stopPropagation()}>
          <>
            <StyledLink tabIndex={tabIndex} to={"/"}>
              <StyledMenuLink
                displayText={"Home"}
                linkDestination={"/"}
                currentLocation={location}
              />
            </StyledLink>
          </>
        </Content>
      }
    </StyledMenu>
  );
};

export default SlideMenu;
