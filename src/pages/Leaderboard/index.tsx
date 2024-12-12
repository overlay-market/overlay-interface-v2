import { Flex, Text } from "@radix-ui/themes";
import theme from "../../theme";
import { LineSeparator } from "./leaderboard-styles";
import UserPointsSection from "./UserPointsSection";
import LeaderboardTable from "./LeaderboardTable";
import PointsUpdateSection from "./PointsUpdateSection";

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

      <Flex
        direction={"column"}
        gap={{ initial: "24px", sm: "28px", md: "32px" }}
        pt={"16px"}
        pl={{ initial: "4px", sm: "16px", md: "12px" }}
        pr={{ initial: "4px", sm: "0px" }}
      >
        <Flex
          direction={{ initial: "column", sm: "row" }}
          justify={"between"}
          align={"center"}
          gap={"12px"}
        >
          <UserPointsSection />
          <PointsUpdateSection />
        </Flex>

        <LeaderboardTable />
      </Flex>
    </Flex>
  );
};

export default Leaderboard;
