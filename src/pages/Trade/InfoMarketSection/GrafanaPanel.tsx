import React from "react";
import { Flex, Skeleton, Text } from "@radix-ui/themes";
import { useCurrentMarketState } from "../../../state/currentMarket/hooks";
import { useMediaQuery } from "../../../hooks/useMediaQuery";

const GrafanaPanel: React.FC = () => {
  const { currentMarket } = useCurrentMarketState();
  const snapshotUrl = `https://grafana.overlay.market/stats-snapshot/${
    currentMarket?.id.toLowerCase() ?? ""
  }?kiosk`; // whole dashboard

  const isDesktop = useMediaQuery("(min-width: 1280px)");

  return (
    <Flex width={"100%"} direction={{ initial: "column" }} gap="0px">
      <Text weight={"bold"} size={"5"}>
        Statistics
      </Text>
      {currentMarket ? (
        <iframe
          src={snapshotUrl}
          width="100%"
          height={isDesktop ? "860" : "920"}
          title="Grafana Snapshot"
          style={{
            border: "none",
          }}
        ></iframe>
      ) : (
        <Skeleton height={isDesktop ? "860px" : "920px"} width="100%" />
      )}
    </Flex>
  );
};

export default GrafanaPanel;
