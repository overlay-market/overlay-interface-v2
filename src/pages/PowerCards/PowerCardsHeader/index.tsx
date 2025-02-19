import theme from "../../../theme";
import { Flex, Text } from "@radix-ui/themes";
import { LineSeparator } from "./power-cards-header-styles";

const PowerCardsHeader = () => {
  return (
    <Flex width={"100%"} height={"100%"} direction={"column"}>
      <Flex
        display={{ initial: "none", sm: "flex" }}
        align={"center"}
        height={theme.headerSize.height}
        px={"10px"}
      >
        <Text size={"2"} weight={"medium"}>
          Power Cards
        </Text>
      </Flex>
      <LineSeparator />
    </Flex>
  );
};

export default PowerCardsHeader;
