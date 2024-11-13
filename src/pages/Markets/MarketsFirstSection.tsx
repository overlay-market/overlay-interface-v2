import { Box, Flex } from "@radix-ui/themes";
import { OptionalLinkBanner } from "../../components/Banner/OptionalLinkBanner";
import { PromotedBanner } from "../../components/Banner/PromotedBanner";

export const FirstSection = () => {
  return (
    <Flex gap="3" ml="50px">
      <Box flexGrow="7" flexShrink="1" flexBasis="0%">
        <PromotedBanner
          Title="CGMI"
          Name="Chess Grand Masters Index"
          Value="194.21"
        />
      </Box>
      <Box flexGrow="3" flexShrink="1" flexBasis="0%">
        <OptionalLinkBanner Title="Governance" Name="OIP-78" Link="Vote Now" />
      </Box>
    </Flex>
  );
};
