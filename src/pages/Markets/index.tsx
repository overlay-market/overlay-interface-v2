import { Flex } from "@radix-ui/themes";
import MarketsHeader from "./MarketsHeader";
import { FirstSection } from "./MarketsWidget/MarketsFirstSection";

const Markets: React.FC = () => {
  return (
    <Flex direction="column" width={"100%"}>
      <MarketsHeader />
      <FirstSection />
      Markets
    </Flex>
  );
};

export default Markets;
