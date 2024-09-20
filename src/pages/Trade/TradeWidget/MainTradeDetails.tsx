// import { useSetSlippageModalToggle } from "../../state/application/hooks";
// import { useBuildState } from "../../state/build/hooks";
import { Flex, Text } from "@radix-ui/themes";
import { theme } from "../../../theme/theme";

export const MainTradeDetails = () => {
  // const toggleSetSlippageModal = useSetSlippageModalToggle();
  // const { setSlippageValue } = useBuildState();

  return (
    <Flex direction={"column"} gap="16px">
      <Flex justify={"between"}>
        <Text style={{ color: theme.color.grey3 }}>Est. Price</Text>
        <Text style={{ color: theme.color.blue1 }}>1.77673 B</Text>
      </Flex>

      <Flex justify={"between"}>
        <Flex style={{ gap: "8px" }}>
          <Text style={{ color: theme.color.grey3 }}>Worst Price</Text>
          <Text
            // onClick={toggleSetSlippageModal}
            size={"1"}
            style={{
              textDecoration: "underline",
              cursor: "pointer",
              color: theme.color.blue2,
            }}
          >
            {/* {`${setSlippageValue}% slippage`} */}
            1% slippage
          </Text>
        </Flex>
        <Text style={{ color: theme.color.blue1 }}>1.77673 B</Text>
      </Flex>

      {/* <SetSlippageModal /> */}

      <Flex justify={"between"}>
        <Text style={{ color: theme.color.grey3 }}>Price Impact</Text>
        <Text style={{ color: theme.color.blue1 }}>0%</Text>
      </Flex>
    </Flex>
  );
};
