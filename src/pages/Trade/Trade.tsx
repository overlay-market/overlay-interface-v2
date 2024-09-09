import { Flex, Text, Button, Box } from "@radix-ui/themes";
import TradeHeader from "./TradeHeader";

const Trade = () => {
  return (
    <Flex direction="column" gap="180px" width={"100%"}>
      <TradeHeader />
      <Box
        style={{
          // backgroundColor: "var(--accent1)",
          background: "linear-gradient(90deg, #FFC955 0%, #FF7CD5 100%)",
          color: "blue",
          padding: "10px 20px",
          border: "none",
        }}
      >
        <Text>Trade page!</Text>
      </Box>
      <Text color="red">Trade page!</Text>
      <Button
        style={{
          backgroundColor: "var(--accent11)",
          color: "var(--accent1)",
          padding: "20px",
          border: "2px solid transparent",
          borderRadius: "8px",
          cursor: "pointer",
        }}
      >
        Custom button, - hover effect, + click effect
      </Button>
      <Button>Standard button, + hover, + click effect</Button>
      <Button
        style={{
          padding: "20px",
          fontSize: "16px",
          color: "green",
          backgroundColor: "transparent",
          border: "2px solid",
          borderImage: "linear-gradient(90deg, #FFC955 0%, #FF7CD5 100%) 1",
          borderRadius: "10px",
        }}
      >
        gradient button
      </Button>
    </Flex>
  );
};

export default Trade;
