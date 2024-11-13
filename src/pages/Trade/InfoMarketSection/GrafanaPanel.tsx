import React from "react";
import { Flex, Text } from "@radix-ui/themes";
import { useCurrentMarketState } from "../../../state/currentMarket/hooks";

const GrafanaPanel: React.FC = () => {
  const { currentMarket } = useCurrentMarketState();
  const snapshotUrl = `https://grafana.overlay.market/stats-snapshot/${currentMarket?.id ?? ""}?kiosk`; // whole dashboard

  return (
    <Flex
        width={"100%"}
        direction={{ initial: "column"}}
        gap="0px"
    >
        <Text weight={"bold"} size={"5"}>
            Statistics
        </Text>
        {currentMarket 
          ? <iframe
          src={snapshotUrl}
          width="100%"
          height="860"
          frameBorder="0"
          title="Grafana Snapshot"
          ></iframe>
          : <></>
        }
    </Flex>
  );
};

export default GrafanaPanel;
