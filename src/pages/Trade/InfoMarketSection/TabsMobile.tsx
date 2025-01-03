import React from "react";
import { TabsContainer, TabsList, TabsTrigger } from "./tabs-mobile-styles";
import RiskParameters from "./RiskParameters";
import { useCurrentMarketState } from "../../../state/currentMarket/hooks";
import { Flex, Skeleton, Tabs } from "@radix-ui/themes";

const TabsMobile: React.FC = () => {
  const { currentMarket } = useCurrentMarketState();
  const snapshotUrl = `https://grafana.overlay.market/stats-snapshot/${
    currentMarket?.id.toLowerCase() ?? ""
  }?kiosk`;

  return (
    <TabsContainer defaultValue="tab1">
      <TabsList>
        <TabsTrigger value="tab1">Market Volume</TabsTrigger>
        <TabsTrigger value="tab2">Risk Parameters</TabsTrigger>
        <TabsTrigger value="tab3">Funding Rate</TabsTrigger>
      </TabsList>

      <Tabs.Content value="tab1">
        {currentMarket ? (
          <Flex height={"450px"} overflow={"hidden"}>
            <iframe
              src={snapshotUrl}
              width="100%"
              height="920"
              title="Grafana Snapshot Upper"
              style={{
                border: "none",
                transform: "translateY(0)",
              }}
            ></iframe>
          </Flex>
        ) : (
          <Skeleton height={"450px"} width="100%" />
        )}
      </Tabs.Content>
      <Tabs.Content value="tab2">
        <RiskParameters />
      </Tabs.Content>
      <Tabs.Content value="tab3">
        {currentMarket ? (
          <Flex height={"460px"} overflow={"hidden"}>
            <iframe
              src={snapshotUrl}
              width="100%"
              height="920"
              title="Grafana Snapshot Lower"
              style={{
                border: "none",
                transform: "translateY(-450px)",
              }}
            ></iframe>
          </Flex>
        ) : (
          <Skeleton height={"460px"} width="100%" />
        )}
      </Tabs.Content>
    </TabsContainer>
  );
};

export default TabsMobile;
