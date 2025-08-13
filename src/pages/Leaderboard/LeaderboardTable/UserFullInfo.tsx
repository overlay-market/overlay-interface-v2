import { DropdownMenu, Flex } from "@radix-ui/themes";
import { useState } from "react";
import theme from "../../../theme";
import { useMediaQuery } from "../../../hooks/useMediaQuery";
import { DisplayUserData } from "../types";
import { TextLabel, TextValue } from "./user-full-info-styles";

type UserFullInfoProps = {
  currentUser: DisplayUserData;
};

const UserFullInfo: React.FC<UserFullInfoProps> = ({ currentUser }) => {
  const isMobile = useMediaQuery("(max-width: 450px)");
  const [detailsOpen, setDetailsOpen] = useState<boolean>(false);

  return (
    <Flex>
      <DropdownMenu.Root open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DropdownMenu.Trigger>
          <button
            style={{
              background: "none",
              border: "none",
              outline: "none",
              padding: 0,
              fontSize: "14px",
              fontWeight: 500,
              color: theme.color.grey8,
              cursor: "pointer",
              textAlign: "right",
            }}
          >
            {detailsOpen
              ? isMobile
                ? "▲"
                : "Full Info ▲"
              : isMobile
              ? "▼"
              : "Full Info ▼"}
          </button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content
          style={{
            background: theme.color.background,
            marginTop: "8px",
            padding: "10px",
            boxShadow: `rgb(0 0 0) 0px 0px 12px 2px`,
            border: `1px solid` + theme.color.grey9,
          }}
        >
          <DropdownMenu.Item
            style={{
              background: "transparent",
            }}
          >
            <Flex width={"100%"} justify={"between"} gap={"20px"}>
              <TextValue>Profit OVL</TextValue>
              <TextLabel>{currentUser?.totalProfitOVL}</TextLabel>
            </Flex>
          </DropdownMenu.Item>
          <DropdownMenu.Item
            style={{
              background: "transparent",
            }}
          >
            <Flex width={"100%"} justify={"between"} gap={"20px"}>
              <TextValue>Profit USD</TextValue>
              <TextLabel>{currentUser?.totalProfitUSD}</TextLabel>
            </Flex>
          </DropdownMenu.Item>
          <DropdownMenu.Item
            style={{
              background: "transparent",
            }}
          >
            <Flex width={"100%"} justify={"between"} gap={"20px"}>
              <TextValue>Number of Positions</TextValue>
              <TextLabel>{currentUser?.totalPositions}</TextLabel>
            </Flex>
          </DropdownMenu.Item>

          <DropdownMenu.Item
            style={{
              background: "transparent",
            }}
          >
            <Flex width={"100%"} justify={"between"} gap={"20px"}>
              <TextValue>Win Rate</TextValue>
              <TextLabel>{currentUser?.winRate}</TextLabel>
            </Flex>
          </DropdownMenu.Item>
          <DropdownMenu.Item
            style={{
              background: "transparent",
            }}
          >
            <Flex width={"100%"} justify={"between"} gap={"20px"}>
              <TextValue>Volume OVL</TextValue>
              <TextLabel>{currentUser?.totalVolumeOVL}</TextLabel>
            </Flex>
          </DropdownMenu.Item>

          <DropdownMenu.Item
            style={{
              background: "transparent",
            }}
          >
            <Flex width={"100%"} justify={"between"} gap={"20px"}>
              <TextValue>Fees OVL</TextValue>
              <TextLabel>{currentUser?.totalFeesOVL}</TextLabel>
            </Flex>
          </DropdownMenu.Item>
          <DropdownMenu.Item
            style={{
              background: "transparent",
              overflow: "hidden",
            }}
          >
            <Flex width={"100%"} justify={"between"} gap={"20px"}>
              <TextValue>Most Traded Market</TextValue>
              <TextLabel>{currentUser?.marketName}</TextLabel>
            </Flex>
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </Flex>
  );
};

export default UserFullInfo;
