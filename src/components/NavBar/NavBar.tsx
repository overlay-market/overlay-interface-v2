import { Box, Flex, Text } from "@radix-ui/themes";
import LogoImg from "../../assets/images/overlay-logo-only-no-background.png";
import { GradientOutlineButton } from "../Button/GradientButton";
import { theme } from "../../theme/theme";

const NavBar = () => {
  return (
    <Box
      width={{ initial: "100%", md: "88px" }}
      height={{ initial: "65px", md: "100vh" }}
      py={{ initial: "0", md: "25px" }}
      px={{ initial: "15px", md: "6px" }}
      position={{ initial: "static", md: "sticky" }}
      top={"0"}
      style={{
        backgroundColor: `${theme.background}`,
      }}
    >
      <Flex
        direction={{ initial: "row", md: "column" }}
        gap={{ initial: "20px", md: "100px" }}
        height={{ initial: "65px", md: "90vh" }}
        align={"center"}
      >
        <img src={LogoImg} alt="Logo" width={"40px"} height={"40px"} />

        <Flex
          direction="column"
          justify={"between"}
          flexGrow={"1"}
          display={{ initial: "none", md: "flex" }}
        >
          <Flex direction={"column"} gap={"10px"}>
            <Text>Home</Text>
            <Text>Trade</Text>
          </Flex>
          <Flex direction={"column"} gap={"20px"}>
            <GradientOutlineButton
              title={"Buy OV"}
              width={"78px"}
              height={"29px"}
              onClick={() => {
                console.log("buy OV!");
              }}
            />

            <Text>Social link</Text>
          </Flex>
        </Flex>

        <Box display={{ initial: "block", md: "none" }}>NavBar Hamburger</Box>
      </Flex>
    </Box>
  );
};

export default NavBar;
