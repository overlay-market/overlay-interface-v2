import { Box, Flex, Text } from "@radix-ui/themes";
import LogoImg from "../../assets/images/overlay-logo-only-no-background.png";

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
        backgroundColor: "dimGray",
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
          <Flex>
            <Text>Social link</Text>
          </Flex>
        </Flex>

        <Box display={{ initial: "block", md: "none" }}>NavBar Hamburger</Box>
      </Flex>
    </Box>
  );
};

export default NavBar;
