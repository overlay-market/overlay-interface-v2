import { Box, Flex } from "@radix-ui/themes";
import { OptionalLinkBanner } from "../../../components/Banner/OptionalLinkBanner/OptionalLinkBanner";
import { PromotedBanner } from "../../../components/Banner/PromotedBanner/PromotedBanner";

export const FirstSection = () => {
  return (
    <Flex gap="3" style={{ width: "100%", marginLeft: "50px" }}>
      <Box flexGrow="7" flexShrink="1" flexBasis="0%">
        <PromotedBanner Title="Title" Name="Name" Value="Value" />
      </Box>
      <Box flexGrow="3" flexShrink="1" flexBasis="0%">
        <OptionalLinkBanner Title="Title" Name="Name" Link="Link" />
      </Box>
    </Flex>
  );
};
