import { Flex } from "@radix-ui/themes";
import React from "react";
import {
  HeaderEmptyPlaceholder,
  LineSeparator,
  PortfolioContainer,
} from "./portfolio-styles";
import OpenPositionsTable from "./OpenPositionsTable";
import PositionHistory from "./PositionHistory";
import Overview from "./Overview";

const Portfolio: React.FC = () => {
  return (
    <PortfolioContainer direction="column" width={"100%"} overflowX={"hidden"}>
      <HeaderEmptyPlaceholder></HeaderEmptyPlaceholder>
      <LineSeparator />

      <Flex
        direction="column"
        width={"100%"}
        px={{ initial: "0px", sm: "8px" }}
      >
        <Overview />
        <OpenPositionsTable />
        <PositionHistory />
      </Flex>
    </PortfolioContainer>
  );
};

export default Portfolio;
