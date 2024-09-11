import { Flex, Text, Box, Separator } from "@radix-ui/themes";
import { theme } from "../../theme/theme";
import styled from "styled-components";

const StyledSeparator = styled(Separator)`
  background-color: ${theme.darkBlue};
`;

const TradeHeader = () => {
  return (
    <Box
      width={"100%"}
      height={"65px"}
      style={{
        borderBottom: `1px solid ${theme.darkBlue}`,
      }}
    >
      <Flex
        direction="row"
        gap="10px"
        align={"center"}
        width={"100%"}
        height={"100%"}
        style={{ textAlign: "end" }}
      >
        <Box width={"150px"}>
          <Text>Market name</Text>
        </Box>
        <StyledSeparator orientation="vertical" size="4" />
        <Box width={"150px"}>
          <Text>Price</Text>
        </Box>

        <StyledSeparator orientation="vertical" size="4" />
        <Box width={"150px"}>
          <Text>OI balance</Text>
        </Box>

        <StyledSeparator orientation="vertical" size="4" />
        <Box width={"150px"}>
          <Text>Funding</Text>
        </Box>
        <StyledSeparator orientation="vertical" size="4" />
      </Flex>
    </Box>
  );
};

export default TradeHeader;
