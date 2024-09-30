import { Flex } from "@radix-ui/themes";
import MarketsHeader from "./MarketsHeader";
import { FirstSection } from "./MarketsFirstSection";

const Markets = () => {
  return (
    <Flex direction="column" width={"100%"}>
      <MarketsHeader />
      <FirstSection />
      Markets
    </Flex>
  );
};

export default Markets;
