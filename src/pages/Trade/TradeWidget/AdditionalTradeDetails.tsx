import { Flex, Text } from "@radix-ui/themes";
import theme from "../../../theme";
import { InfoIcon } from "../../../assets/icons/svg-icons";

const AdditionalTradeDetails: React.FC = () => {
  return (
    <Flex direction={"column"} gap="8px">
      <Flex justify={"between"} height={"17px"}>
        <Text style={{ color: theme.color.grey3 }}>Fee</Text>
        <Text style={{ color: theme.color.blue1 }}>0.075%</Text>
      </Flex>

      <Flex justify={"between"} height={"17px"}>
        <Flex gap={"8px"} align={"center"}>
          <Text style={{ color: theme.color.grey3 }}>Slippage</Text>
        </Flex>
        <Text style={{ color: theme.color.blue1 }}>1%</Text>
      </Flex>

      <Flex justify={"between"} height={"17px"}>
        <Text style={{ color: theme.color.grey3 }}>Est. Liquidation</Text>
        <Text style={{ color: theme.color.blue1 }}>1.77732B</Text>
      </Flex>

      <Flex justify={"between"} height={"17px"}>
        <Flex gap={"4px"} align={"center"}>
          <Text style={{ color: theme.color.grey3 }}>Expected OI</Text>
          <InfoIcon />
        </Flex>
        <Text style={{ color: theme.color.blue1 }}>-</Text>
      </Flex>
    </Flex>
  );
};

export default AdditionalTradeDetails;
