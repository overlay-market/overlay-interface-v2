import { Flex } from "@radix-ui/themes";
import MarketsHeader from "./MarketsHeader";
import { FirstSection } from "./MarketsFirstSection";
import Carousel from "./MarketsCarousel";
import MarketsTable from "./MarketsTable";

const Markets: React.FC = () => {
  return (
    <Flex direction="column" width={"100%"} overflowX={"hidden"}>
      <MarketsHeader />
      <FirstSection />
      <Carousel />
      <MarketsTable />
    </Flex>
  );
};

export default Markets;
