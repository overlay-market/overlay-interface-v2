import { Box, Flex, Text } from "@radix-ui/themes";

const WalletChainBox = () => {
  return (
    <Box
      width="200px"
      height="65px"
      position="absolute"
      top="0"
      right="0"
      style={{
        backgroundColor: "lightGray",
      }}
    >
      <Flex gap={"20px"} align={"center"} height={"100%"}>
        <Text>Wallet info</Text>
        <Text>Chain Info</Text>
      </Flex>
    </Box>
  );
};

export default WalletChainBox;
