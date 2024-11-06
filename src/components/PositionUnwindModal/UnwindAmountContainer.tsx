import { Flex, Text } from "@radix-ui/themes";
import { TransparentUnderlineButton } from "./unwind-amount-container-styles";

type UnwindAmountContainerProps = {
  handleQuickInput: (value: number) => void;
};

const UnwindAmountContainer: React.FC<UnwindAmountContainerProps> = ({
  handleQuickInput,
}) => {
  return (
    <Flex
      width={"100%"}
      mt={"24px"}
      mb={"4px"}
      justify={"between"}
      align={"center"}
    >
      <Text>Unwind Amount</Text>
      <Flex gap={"16px"}>
        <TransparentUnderlineButton onClick={() => handleQuickInput(25)}>
          25%
        </TransparentUnderlineButton>
        <TransparentUnderlineButton onClick={() => handleQuickInput(50)}>
          50%
        </TransparentUnderlineButton>
        <TransparentUnderlineButton onClick={() => handleQuickInput(75)}>
          75%
        </TransparentUnderlineButton>
        <TransparentUnderlineButton onClick={() => handleQuickInput(100)}>
          Max
        </TransparentUnderlineButton>
      </Flex>
    </Flex>
  );
};

export default UnwindAmountContainer;
