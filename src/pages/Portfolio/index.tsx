import { Flex } from "@radix-ui/themes";
import React from "react";
import {
  HeaderEmptyPlaceholder,
  LineSeparator,
  PortfolioContainer,
} from "./portfolio-styles";
import OpenPositionsTable from "./OpenPositionsTable";
import UnwindsTable from "./UnwindsTable";
import LiquidatesTable from "./LiquidatesTable";
import Overview from "./Overview";

const Portfolio: React.FC = () => {
  return (
    <PortfolioContainer direction="column">
      <HeaderEmptyPlaceholder></HeaderEmptyPlaceholder>
      <LineSeparator />

      <Flex direction="column" pl={{ sm: "8px" }} overflowX={"hidden"}>
        <Overview />
        <OpenPositionsTable />
        <UnwindsTable />
        <LiquidatesTable />
      </Flex>
    </PortfolioContainer>
  );
};

export default Portfolio;
