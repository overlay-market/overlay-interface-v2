import React from "react";
import { Flex, Text } from "@radix-ui/themes";

const GrafanaPanel: React.FC = () => {
  const snapshotUrl = "https://grafana.overlay.market/dashboard/snapshot/MCcLUywiFzubMYf2mojNoWlalARD4zGA?kiosk"; // whole dashboard

  function onloadFn() {
    console.log('iframe content loaded');
  }

  return (
    <Flex
        width={"100%"}
        direction={{ initial: "column"}}
        gap="0px"
    >
        <Text weight={"bold"} size={"5"}>
            Statistics
        </Text>
        <iframe
        onLoad={onloadFn}
        src={snapshotUrl}
        width="100%"
        height="860"
        frameBorder="0"
        title="Grafana Snapshot"
        ></iframe>
    </Flex>
  );
};

export default GrafanaPanel;
