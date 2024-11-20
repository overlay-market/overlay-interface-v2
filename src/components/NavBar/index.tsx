import { Box, Flex } from "@radix-ui/themes";
import LogoImg from "../../assets/images/overlay-logo-only-no-background.png";
import theme from "../../theme";
import SocialLinksSection from "./SocialLinksSection";
import NavLinksSection from "./NavLinksSection";
import { LinksWrapper, MobileNavBar } from "./navbar-styles";

const NavBar: React.FC = () => {
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
        px={{ initial: "15px", sm: "6px" }}
        position={{ initial: "static", sm: "sticky" }}
        top={"0"}
        style={{
          borderRight: `1px solid ${theme.color.darkBlue}`,
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
