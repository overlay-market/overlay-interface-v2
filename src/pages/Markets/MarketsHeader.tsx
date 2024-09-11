import { Flex, Text, Box } from "@radix-ui/themes";

const MarketsHeader = () => {
  return (
    <Box width={"100%"} height={"65px"}>
      <Flex direction="row" align={"center"} width={"100%"} height={"100%"}>
        <Box width={"150px"}>
          <Text>OV PRICE</Text>
        </Box>

        <Box width={"150px"}>
          <Text>OV SUPPLY</Text>
        </Box>

        <Box width={"150px"}>
          <Text>GOV</Text>
        </Box>
      </Flex>
    </Box>
  );
};

export default MarketsHeader;
