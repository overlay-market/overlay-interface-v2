import { Box, Flex } from "@radix-ui/themes";
import { GradientOutlineButton } from "../Button";
import theme from "../../theme";
import Web3Status from "./Web3Status";

const Wallet: React.FC = () => {
  return (
    <Box
      width="308px"
      height={`${theme.headerSize.height}`}
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
        pr={"20px"}
      >
        <GradientOutlineButton
          title={"Buy OV"}
          width={"78px"}
          height={"29px"}
          handleClick={() => {
            console.log("buy OV!");
          }}
        />
        <Web3Status />
      </Flex>
    </Box>
  );
};

export default Wallet;
