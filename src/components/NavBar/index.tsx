import { Box, Flex } from "@radix-ui/themes";
import LogoImg from "../../assets/images/overlay-logo-only-no-background.png";
import theme from "../../theme";
import SocialLinksSection from "./SocialLinksSection";
import NavLinksSection from "./NavLinksSection";
import { LinksWrapper } from "./navbar-styles";

const NavBar: React.FC = () => {
  return (
    <Box
      width={{ initial: "100%", md: `${theme.headerSize.width}` }}
      height={{ initial: `${theme.headerSize.height}`, md: "100vh" }}
      py={{ initial: "0", md: "20px" }}
      px={{ initial: "15px", md: "6px" }}
      position={{ initial: "static", md: "sticky" }}
      top={"0"}
      style={{
        borderRight: `1px solid ${theme.color.darkBlue}`,
        borderBottom: `1px solid ${theme.color.darkBlue}`,
      }}
    >
      <Flex
        direction={{ initial: "row", md: "column" }}
        gap={{ initial: "20px", md: "8px" }}
        height={{ initial: "65px", md: "90vh" }}
        align={"center"}
      >
        <img src={LogoImg} alt="Logo" width={"40px"} height={"40px"} />

        <LinksWrapper direction="column" justify={"between"} flexGrow={"1"}>
          <NavLinksSection />
          <SocialLinksSection />
        </LinksWrapper>
      </Flex>
    </Box>
  );
};

export default NavBar;
