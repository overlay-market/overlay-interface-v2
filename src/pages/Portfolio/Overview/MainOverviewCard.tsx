import { Box, Text } from "@radix-ui/themes";
import theme from "../../../theme";
import Loader from "../../../components/Loader";
import { MainOverviewCardContainer } from "./main-overview-card-styles";

type MainOverviewCardProps = {
  title: string;
  value?: string | number;
  unit?: string;
};

const MainOverviewCard: React.FC<MainOverviewCardProps> = ({
  title,
  value,
  unit,
}) => (
  <MainOverviewCardContainer>
    <Box py={"12px"}>
      {value && unit ? (
        <Text size="7" weight={"bold"}>
          {value} {unit}
        </Text>
      ) : (
        <Loader />
      )}
    </Box>

    <Text size="2" style={{ color: theme.color.grey3 }}>
      {title}
    </Text>
  </MainOverviewCardContainer>
);

export default MainOverviewCard;
