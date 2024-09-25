import { Flex, Text } from "@radix-ui/themes";
import { theme } from "../../../theme/theme";
import SetSlippageModal from "../../../components/SetSlippageModal/SetSlippageModal";

export const MainTradeDetails = () => {
  return (
    <Flex direction={"column"} gap="16px">
      <Flex justify={"between"}>
        <Text style={{ color: theme.color.grey3 }}>Est. Price</Text>
        <Text style={{ color: theme.color.blue1 }}>1.77673 B</Text>
      </Flex>

      <Flex justify={"between"}>
        <Flex gap={"8px"} align={"center"}>
          <Text style={{ color: theme.color.grey3 }}>Worst Price</Text>
          <SetSlippageModal />
        </Flex>
        <Text style={{ color: theme.color.blue1 }}>1.77673 B</Text>
      </Flex>

      <Flex justify={"between"}>
        <Text style={{ color: theme.color.grey3 }}>Price Impact</Text>
        <Text style={{ color: theme.color.blue1 }}>0%</Text>
      </Flex>
    </Flex>
  );
};
