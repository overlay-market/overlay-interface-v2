import { useState } from "react";
import { Cross2Icon } from "@radix-ui/react-icons";
import { AirdropType } from "../../../constants/airdrops";
import * as Tooltip from "@radix-ui/react-tooltip";
import { Flex, Text } from "@radix-ui/themes";
import { InfoCircleIcon } from "../../../assets/icons/svg-icons";
import { useMediaQuery } from "../../../hooks/useMediaQuery";
import {
  TableHeaderContent,
  TooltipBox,
} from "./airdropId-with-tooltip-styles";
import { UNIT } from "../../../constants/applications";

interface Props {
  airdrop: AirdropType;
}

const AirdropIdWithTooltip: React.FC<Props> = ({ airdrop }) => {
  const [open, setOpen] = useState(false);

  const handleOpenChange = () => {
    setOpen((prevOpen) => !prevOpen);
  };
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  return (
    <Tooltip.Root open={open} onOpenChange={handleOpenChange}>
      <Tooltip.Trigger asChild>
        <TableHeaderContent>
          {airdrop.title} ({UNIT})
          <InfoCircleIcon />
        </TableHeaderContent>
      </Tooltip.Trigger>
      <Tooltip.Portal>
        <Tooltip.Content side="bottom" align="end">
          <TooltipBox>
            <Flex direction={"column"}>
              {airdrop.expectedDate && (
                <Text style={{ fontWeight: "bold" }}>
                  Expected airdrop date: {airdrop.expectedDate}
                </Text>
              )}
              <Text>{airdrop.summary}</Text>
              {airdrop.boldSummary && (
                <Text style={{ fontWeight: "bold" }}>
                  {airdrop.boldSummary}
                </Text>
              )}
            </Flex>

            <Flex style={{ cursor: "pointer" }}>
              {!isDesktop && <Cross2Icon onClick={handleOpenChange} />}
            </Flex>
          </TooltipBox>
          <Tooltip.Arrow style={{ fill: "none" }} />
        </Tooltip.Content>
      </Tooltip.Portal>
    </Tooltip.Root>
  );
};

export default AirdropIdWithTooltip;
