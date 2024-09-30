import { Flex, Text, Box } from "@radix-ui/themes";
import theme from "../../theme";
import ProgressBar from "../../components/ProgressBar";
import MarketsDropdownList from "./MarketsDropdownList";
import { StyledSeparator } from "./trade-header-styles";

const TradeHeader: React.FC = () => {
  return (
    <Box
      width={"100%"}
      height={`${theme.headerSize.height}`}
      position={"relative"}
      style={{
        borderBottom: `1px solid ${theme.color.darkBlue}`,
      }}
    >
      <Flex
        align={"center"}
        width={"100%"}
        height={"100%"}
        style={{ textAlign: "end" }}
      >
        <MarketsDropdownList />

        <StyledSeparator orientation="vertical" size="4" />

        <Flex width={"97px"} direction="column" p={"12px"}>
          <Text weight="light" style={{ fontSize: "10px" }}>
            Price
          </Text>
          <Text>$94.21</Text>
        </Flex>

        <StyledSeparator orientation="vertical" size="4" />

        <Flex width={"97px"} direction={"column"} p={"12px"}>
          <Text weight="light" style={{ fontSize: "10px" }}>
            Funding
          </Text>
          <Text
            style={{
              color: true ? theme.color.green2 : theme.color.red2,
            }}
          >
            +4.53%
          </Text>
        </Flex>

        <StyledSeparator orientation="vertical" size="4" />

        <Flex width={"195px"} direction={"column"} p={"12px"} align={"end"}>
          <Text weight="light" style={{ fontSize: "10px" }}>
            OI balance
          </Text>
          <Flex gap={"4px"} align={"center"}>
            <Text style={{ color: theme.color.red2 }}>30%</Text>
            <ProgressBar max={100} value={30} />
            <Text style={{ color: theme.color.green2 }}>70%</Text>
          </Flex>
        </Flex>

        <StyledSeparator orientation="vertical" size="4" />
      </Flex>
    </Box>
  );
};

export default TradeHeader;
