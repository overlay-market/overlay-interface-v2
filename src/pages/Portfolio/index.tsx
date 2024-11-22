import { Flex } from "@radix-ui/themes";
import React from "react";
import { HeaderEmptyPlaceholder } from "./portfolio-styles";
import OpenPositionsTable from "./OpenPositionsTable";
import UnwindsTable from "./UnwindsTable";
import LiquidatesTable from "./LiquidatesTable";
import Overview from "./Overview";

const Portfolio: React.FC = () => {
  return (
    <Flex direction="column" width={"100%"} overflowX={"hidden"}>
      <HeaderEmptyPlaceholder></HeaderEmptyPlaceholder>
      <Flex
        direction="column"
        width={"100%"}
        px={{ initial: "15px", sm: "8px" }}
      >
        <Overview />
        <OpenPositionsTable />
        <UnwindsTable />
        <LiquidatesTable />
      </Flex>
    </Flex>
  );
};

export default Portfolio;
