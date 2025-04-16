import theme from "../../../theme";
import { Flex, Text } from "@radix-ui/themes";
import { LineSeparator } from "./power-cards-header-styles";
import { ArrowLeftIcon } from "@radix-ui/react-icons";

type PowerCardsHeaderProps = {
  cardTitle: string | null;
  setSelectedCard: Function;
};

const PowerCardsHeader: React.FC<PowerCardsHeaderProps> = ({
  cardTitle,
  setSelectedCard,
}) => {
  return (
    <Flex width={"100%"} direction={"column"}>
      {cardTitle ? (
        <Flex
          align={"center"}
          gap={"12px"}
          height={{ initial: "47px", sm: theme.headerSize.height }}
          px={{ initial: "0px", sm: "16px" }}
        >
          <Flex
            gap={"4px"}
            align={"center"}
            px={"4px"}
            style={{ color: theme.color.blue3, cursor: "pointer" }}
            onClick={() => setSelectedCard(null)}
          >
            <ArrowLeftIcon />
            <Text size={"1"} weight={"medium"}>
              Back
            </Text>
          </Flex>

          <Text weight={"medium"}>{cardTitle} </Text>
        </Flex>
      ) : (
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
      )}

      <LineSeparator />
    </Flex>
  );
};

export default PowerCardsHeader;
