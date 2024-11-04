import { Box, Flex, Text } from "@radix-ui/themes";
import theme from "../../../theme";
import Loader from "../../../components/Loader";

type OverviewCardProps = {
  title: string;
  value?: string | number;
  unit?: string;
  isOver1000OpenPositions?: boolean;
};

const OverviewCard: React.FC<OverviewCardProps> = ({
  title,
  value,
  unit,
  isOver1000OpenPositions,
}) => (
  <Flex
    direction={"column"}
    justify={"between"}
    py={"20px"}
    px={"24px"}
    style={{
      backgroundColor: theme.color.grey4,
      borderRadius: "8px",
    }}
  >
    <Text size="2" style={{ color: theme.color.grey3 }}>
      {title}
    </Text>

    {isOver1000OpenPositions && (
      <Flex direction={"column"}>
        <Text style={{ fontSize: "10px", color: theme.color.red1 }}>
          Open Positions {">"} 1000
        </Text>
        <Text style={{ fontSize: "10px", color: theme.color.red1 }}>
          May output wrong value
        </Text>
      </Flex>
    )}

    <Box py={"12px"}>
      {value ? (
        <Text size="3" weight={"bold"}>
          {value}
        </Text>
      ) : (
        <Loader />
      )}
    </Box>

    {unit && value ? <Text>{unit}</Text> : <Box m={"10px"}></Box>}
  </Flex>
);

export default OverviewCard;
