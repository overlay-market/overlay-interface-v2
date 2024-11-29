import React from "react";
import { Flex, Skeleton, Text } from "@radix-ui/themes";
import { useCurrentMarketState } from "../../../state/currentMarket/hooks";

const GrafanaPanel: React.FC = () => {
  const { currentMarket } = useCurrentMarketState();
  const snapshotUrl = `https://grafana.overlay.market/stats-snapshot/${
    currentMarket?.id.toLowerCase() ?? ""
  }?kiosk`; // whole dashboard

  return (
    <Flex width={"100%"} direction={{ initial: "column" }} gap="0px">
      <Text weight={"bold"} size={"5"}>
        Statistics
      </Text>
      {currentMarket ? (
        <iframe
          src={snapshotUrl}
          width="100%"
          height="920"
          frameBorder="0"
          title="Grafana Snapshot"
        ></iframe>
      ) : (
        <Skeleton height="920px" width="100%" />
      )}
    </Flex>
  );
};

export default GrafanaPanel;
