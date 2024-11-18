import { Flex, Text } from "@radix-ui/themes";
import theme from "../../theme";

const PositionNotFound: React.FC = () => {
  return (
    <Flex
      mt={"24px"}
      direction={"column"}
      width={"100%"}
      align={"center"}
      gap={"20px"}
    >
      <Text
        style={{
          color: theme.color.red2,
          fontWeight: "700",
          fontSize: "16px",
        }}
      >
        Position not found
      </Text>
      <Text
        style={{
          fontWeight: "500",
          textAlign: "center",
        }}
      >
        Please try again later
      </Text>
    </Flex>
  );
};

export default PositionNotFound;
