import { DropdownMenu, Flex } from "@radix-ui/themes";
import { useState } from "react";
import { useMediaQuery } from "../../../hooks/useMediaQuery";
import { DisplayUserData } from "../types";
import {
  DropdownButton,
  DropdownContent,
  DropdownItem,
  Row,
  TextLabel,
  TextValue,
} from "./user-details-styles";
import { leaderboardColumns } from "./leaderboardConfig";

type UserDetailsProps = {
  currentUser: DisplayUserData;
};

const UserDetails: React.FC<UserDetailsProps> = ({ currentUser }) => {
  const isMobile = useMediaQuery("(max-width: 450px)");
  const [detailsOpen, setDetailsOpen] = useState<boolean>(false);

  const filteredColumns = leaderboardColumns.filter(
    (col) => col.value !== "mostTradedMarket"
  );

  const isMostTradedMarketColumn = leaderboardColumns.some(
    (col) => col.value === "mostTradedMarket"
  );

  return (
    <Flex>
      <DropdownMenu.Root open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DropdownMenu.Trigger>
          <DropdownButton>
            {detailsOpen
              ? isMobile
                ? "▲"
                : "Details ▲"
              : isMobile
              ? "▼"
              : "Details ▼"}
          </DropdownButton>
        </DropdownMenu.Trigger>
        <DropdownContent>
          {filteredColumns.map((column) => (
            <DropdownItem key={column.value}>
              <Row>
                <TextValue>{column.label}</TextValue>
                <TextLabel>{column.render(currentUser)}</TextLabel>
              </Row>
            </DropdownItem>
          ))}
          {isMostTradedMarketColumn && (
            <DropdownItem overflowHidden>
              <Row>
                <TextValue>Most Traded Market</TextValue>
                <TextLabel>{currentUser?.marketName}</TextLabel>
              </Row>
            </DropdownItem>
          )}
        </DropdownContent>
      </DropdownMenu.Root>
    </Flex>
  );
};

export default UserDetails;
