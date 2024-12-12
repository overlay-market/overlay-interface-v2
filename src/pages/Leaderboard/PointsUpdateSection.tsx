import { Box, Flex, Text } from "@radix-ui/themes";
import { ClockIcon } from "../../assets/icons/svg-icons";
import theme from "../../theme";
import Loader from "../../components/Loader";
import moment from "moment";

type PointsUpdateSectionProps = {
  pointsUpdatedAt: string;
};

const PointsUpdateSection: React.FC<PointsUpdateSectionProps> = ({
  pointsUpdatedAt,
}) => {
  return (
    <Flex
      p={"8px"}
      gap={"8px"}
      width={"226px"}
      height={"58px"}
      style={{
        border: `1px solid ${theme.color.darkBlue}`,
        borderRadius: "16px",
      }}
    >
      <Box
        width={"40px"}
        height={"40px"}
        p={"12px"}
        style={{ background: theme.color.darkBlue, borderRadius: "12px" }}
      >
        <ClockIcon />
      </Box>

      <Flex direction={"column"} gap={"4px"}>
        <Text size={"1"} style={{ color: theme.color.grey1 }}>
          Points Updated At
        </Text>
        <Text size={"3"} style={{ fontWeight: "600" }}>
          {pointsUpdatedAt ? (
            `${moment.utc(pointsUpdatedAt).format("DD MMM HH:mm")} UTC`
          ) : (
            <Loader />
          )}
        </Text>
      </Flex>
    </Flex>
  );
};

export default PointsUpdateSection;
