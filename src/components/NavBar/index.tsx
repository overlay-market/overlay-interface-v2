import { Box, Flex } from "@radix-ui/themes";
import LogoImg from "../../assets/images/overlay-logo-only-no-background.png";
import theme from "../../theme";
import SocialLinksSection from "./SocialLinksSection";
import NavLinksSection from "./NavLinksSection";
import { LinksWrapper, MobileNavBar } from "./navbar-styles";
import { useMediaQuery } from "../../hooks/useMediaQuery";

const NavBar: React.FC = () => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  return (
    <>
      <Box
        width={{
          initial: "100%",
          sm: `${theme.headerSize.tabletWidth}`,
          md: `${theme.headerSize.width}`,
        }}
        height={{ initial: `${theme.headerSize.mobileHeight}`, sm: "100vh" }}
        py={{ initial: "0", sm: "10px" }}
        px={{ initial: "3px", sm: "6px" }}
        position={{ initial: "static", sm: "sticky" }}
        top={"0"}
        style={{
          borderRight: isMobile
            ? "0px solid transparent" // Remove the border
            : `1px solid ${theme.color.darkBlue}`,
        }}
      >
        <Flex
          direction={{ initial: "row", sm: "column" }}
          gap={{ initial: "20px", sm: "8px" }}
          height={{ initial: `${theme.headerSize.mobileHeight}`, sm: "90vh" }}
          align={"center"}
        >
          <img src={LogoImg} alt="Logo" width={"32px"} height={"32px"} />

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
