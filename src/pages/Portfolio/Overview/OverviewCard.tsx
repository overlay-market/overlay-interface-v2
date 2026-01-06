import { Box, Flex, Text } from "@radix-ui/themes";
import theme from "../../../theme";
import Loader from "../../../components/Loader";

type OverviewCardProps = {
  title: string;
  value?: string | number | React.ReactNode;
  unit?: string;
  isOver1000OpenPositions?: boolean;
  isMultiValue?: boolean;
};

const OverviewCard: React.FC<OverviewCardProps> = ({
  title,
  value,
  unit,
  isOver1000OpenPositions,
  isMultiValue = false,
}) => (
  <Flex
    direction={"column"}
    justify={isMultiValue ? "start" : "between"}
    py={"20px"}
    px={"24px"}
    gap={isMultiValue ? "12px" : undefined}
    style={{
      backgroundColor: theme.color.grey4,
      borderRadius: "8px",
      minHeight: "140px",
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

    <Box py={isMultiValue ? "0" : "12px"}>
      {value !== undefined ? (
        typeof value === 'string' || typeof value === 'number' ? (
          <Flex direction={"column"} gap="4px">
            <Text size="3" weight={"bold"}>
              {value}
            </Text>
            {unit && <Text size="1">{unit}</Text>}
          </Flex>
        ) : (
          value
        )
      ) : (
        <Loader />
      )}
    </Box>

    {!isMultiValue && value !== undefined && <Box m={"10px"}></Box>}
  </Flex>
);

export default OverviewCard;
