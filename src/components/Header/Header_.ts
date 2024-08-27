import styled from "@emotion/styled";
import { NavLink } from "react-router-dom";
import { theme } from "../../theme/theme";

export const HeaderContainer = styled.div`
  color: "#FFFFFF";
  display: flex;
  flex-direction: row;
  width: auto;
  max-width: 1440px;
  box-sizing: border-box;
  margin: auto;
  padding: 24px;
  position: sticky;
`;

export const LogoContainer = styled.div`
  height: 30px;
  width: 30px;
  margin: auto 16px auto 0px;
`;

export const StyledLink = styled(NavLink)({
  color: "#ffffff",
  fontSize: "14px",
  fontWeight: "700",
  textDecoration: "none",
  margin: "auto 16px",
  display: "flex",
  "&.active": {
    color: "#71CEFF",
  },
  [theme.breakpoints.down("md")]: {
    display: "none",
  },
});
