import { Flex, Text } from "@radix-ui/themes";
import theme from "../../../theme";
import SetSlippageModal from "../../../components/SetSlippageModal";

const MainTradeDetails: React.FC = () => {
  return (
    <Flex direction={"column"} gap="16px">
      <Flex justify={"between"} height={"17px"}>
        <Text style={{ color: theme.color.grey3 }}>Est. Price</Text>
        <Text style={{ color: theme.color.blue1 }}>1.77673 B</Text>
      </Flex>

      <Flex justify={"between"} height={"17px"}>
        <Flex gap={"8px"} align={"center"}>
          <Text style={{ color: theme.color.grey3 }}>Worst Price</Text>
          <SetSlippageModal />
        </Flex>
        <Text style={{ color: theme.color.blue1 }}>1.77673 B</Text>
      </Flex>

      <Flex justify={"between"} height={"17px"}>
        <Text style={{ color: theme.color.grey3 }}>Price Impact</Text>
        <Text style={{ color: theme.color.blue1 }}>0%</Text>
      </Flex>
    </Flex>
  );
};

export default MainTradeDetails;
