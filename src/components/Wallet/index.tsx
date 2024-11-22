import { Box, Flex } from "@radix-ui/themes";
// import { GradientOutlineButton } from "../Button";
import theme from "../../theme";
import Web3Status from "./Web3Status";
import ChainSwitch from "./ChainSwitch";
// import HeaderMenu from "../HeaderMenu";

const Wallet: React.FC = () => {
  return (
    <Box
      width="308px"
      height={{
        initial: theme.headerSize.mobileHeight,
        sm: theme.headerSize.height,
      }}
      position="absolute"
      top="0"
      right="0"
      style={{ zIndex: "10" }}
    >
      <Flex
        gap={"20px"}
        align={"center"}
        height={"100%"}
        justify={"end"}
        pr={{ initial: "15px", sm: "20px" }}
      >
        {/* <GradientOutlineButton
          title={"Buy OV"}
          width={"78px"}
          height={"29px"}
          size={"12px"}
          handleClick={() => {
            console.log("buy OV!");
          }}
        /> */}
        <ChainSwitch />
        {/* <HeaderMenu /> */}
        <Web3Status />
      </Flex>
    </Box>
  );
};

export default Wallet;
