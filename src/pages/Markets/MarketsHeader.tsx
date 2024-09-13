import { Flex, Text, Box } from "@radix-ui/themes";
import { theme } from "../../theme/theme";

const MarketsHeader = () => {
  return (
    <Box width={"100%"} height={`${theme.headerSize.height}`}>
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
