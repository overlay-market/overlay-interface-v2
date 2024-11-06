import { Flex, Text } from "@radix-ui/themes";
import NumericalInput from "../../NumericalInput";
import theme from "../../../theme";

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
          isFocused={true}
        />
      </Flex>
      <Flex justify={"end"}>
        <Text style={{ fontSize: "12px" }}>minimum: 0.01%</Text>
      </Flex>
    </Flex>
  );
};

export default NumericalInputContainer;
