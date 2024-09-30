import { Flex } from "@radix-ui/themes";
import MarketsHeader from "./MarketsHeader";

const Markets: React.FC = () => {
  return (
    <Flex direction="column" width={"100%"}>
      <MarketsHeader />
      Markets
    </Flex>
  );
};

export default Markets;
