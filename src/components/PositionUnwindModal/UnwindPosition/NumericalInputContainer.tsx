import { Flex, Text } from "@radix-ui/themes";
import NumericalInput from "../../NumericalInput";
import theme from "../../../theme";
import SetSlippageModal from "../../SetSlippageModal";

type NumericalInputContainerProps = {
  inputValue: string;
  handleUserInput: (value: string) => void;
};

const NumericalInputContainer: React.FC<NumericalInputContainerProps> = ({
  inputValue,
  handleUserInput,
}) => {
  return (
    <Flex direction={"column"} gap={"4px"}>
      <Flex
        p={"8px"}
        gap={"10px"}
        style={{
          border: `1px solid ${theme.color.grey1}`,
          borderRadius: "4px",
        }}
      >
        <Text> OVL </Text>
        <NumericalInput
          value={inputValue}
          handleUserInput={(input) => handleUserInput(input)}
          align={"right"}
        />
      </Flex>
      <Flex justify={"between"}>
        <Flex pt={"10px"}>
          <SetSlippageModal />
        </Flex>

        <Text style={{ fontSize: "12px" }}>minimum: 0.01%</Text>
      </Flex>
    </Flex>
  );
};

export default NumericalInputContainer;
