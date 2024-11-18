import { Flex } from "@radix-ui/themes";
import React from "react";
import { HeaderEmptyPlaceholder } from "./portfolio-styles";
import OpenPositionsTable from "./OpenPositionsTable";
import UnwindsTable from "./UnwindsTable";
import LiquidatesTable from "./LiquidatesTable";
import Overview from "./Overview";

const Portfolio: React.FC = () => {
  return (
    <Flex direction="column" width={"100%"}>
      <HeaderEmptyPlaceholder></HeaderEmptyPlaceholder>

      <Overview />
      <OpenPositionsTable />
      <UnwindsTable />
      <LiquidatesTable />
    </Flex>
  );
};

export default Portfolio;
