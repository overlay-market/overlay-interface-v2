import { Flex, Text } from "@radix-ui/themes";
import theme from "../../theme";
import { LineSeparator } from "./leaderboard-styles";
import LeaderboardOverview from "./LeaderboardOverview";
import LeaderboardTable from "./LeaderboardTable";

const Leaderboard: React.FC = () => {
  return (
    <Flex width={"100%"} height={"100%"} direction={"column"}>
      <Flex
        display={{ initial: "none", sm: "flex" }}
        align={"center"}
        height={theme.headerSize.height}
        px={"10px"}
      >
        <Text size={"2"} weight={"medium"}>
          Leaderboard
        </Text>
      </Flex>
      <LineSeparator />

      <LeaderboardOverview />
      <LeaderboardTable />
    </Flex>
  );
};

export default Leaderboard;
