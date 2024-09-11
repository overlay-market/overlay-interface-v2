import { Box, Flex } from "@radix-ui/themes";
import {
  GradientOutlineButton,
  GradientSolidButton,
} from "../Button/GradientButton";

const WalletChainBox = () => {
  return (
    <Box width="308px" height="65px" position="absolute" top="0" right="0">
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
          onClick={() => {
            console.log("buy OV!");
          }}
        />
        <GradientSolidButton
          title={"Connect Wallet"}
          width={"136px"}
          height={"32px"}
          onClick={() => {
            console.log("Connect wallet");
          }}
        />
      </Flex>
    </Box>
  );
};

export default WalletChainBox;
