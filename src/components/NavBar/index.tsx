import { Box, Flex } from "@radix-ui/themes";
import LogoImg from "../../assets/images/overlay-logo-only-no-background.webp";
import theme from "../../theme";
import SocialLinksSection from "./SocialLinksSection";
import NavLinksSection from "./NavLinksSection";
import { LinksWrapper, MobileNavBar } from "./navbar-styles";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import { useNavigate } from "react-router-dom";

const NavBar: React.FC = () => {
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width: 767px)");
  return (
    <>
      <Box
        width={{
          initial: "100%",
          sm: `${theme.headerSize.tabletWidth}`,
          md: `${theme.headerSize.width}`,
        }}
        minWidth={{
          initial: "100%",
          sm: `${theme.headerSize.tabletWidth}`,
          md: `${theme.headerSize.width}`,
        }}
        height={{ initial: `${theme.headerSize.mobileHeight}`, sm: "100vh" }}
        py={{ sm: "10px" }}
        px={{ sm: "6px" }}
        position={{ initial: "static", sm: "sticky" }}
        top={"0"}
        style={{
          borderRight: isMobile
            ? "0px solid transparent"
            : `1px solid ${theme.color.darkBlue}`,
        }}
      >
        <Flex
          direction={{ initial: "row", sm: "column" }}
          gap={{ initial: "20px", sm: "8px" }}
          height={{ initial: `${theme.headerSize.mobileHeight}`, sm: "97vh" }}
          align={"center"}
        >
          <img
            src={LogoImg}
            alt="Logo"
            width={"32px"}
            height={"32px"}
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/markets")}
          />

          <LinksWrapper direction="column" justify={"between"} flexGrow={"1"}>
            <NavLinksSection />
            <SocialLinksSection />
          </LinksWrapper>
        </Flex>
      </Box>

      <MobileNavBar>
        <NavLinksSection />
      </MobileNavBar>
    </>
  );
};

export default NavBar;
