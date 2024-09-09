import { Flex, Text, Box, Separator } from "@radix-ui/themes";

const TradeHeader = () => {
  return (
    <Box
      width={"100%"}
      height={"65px"}
      style={{
        backgroundColor: "pink",
      }}
    >
      <Flex
        direction="row"
        gap="10px"
        align={"center"}
        width={"100%"}
        height={"100%"}
      >
        <Box width={"150px"}>
          <Text>Market name</Text>
        </Box>
        <Separator orientation="vertical" size="2" />
        <Box width={"150px"}>
          <Text>Price</Text>
        </Box>

        <Separator orientation="vertical" size="2" />
        <Box width={"150px"}>
          <Text>OI balance</Text>
        </Box>

        <Separator orientation="vertical" size="2" />
        <Box width={"150px"}>
          <Text>Funding</Text>
        </Box>
      </Flex>
    </Box>
  );
};

export default TradeHeader;
