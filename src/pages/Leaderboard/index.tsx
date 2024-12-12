import { Flex, Text } from "@radix-ui/themes";
import theme from "../../theme";
import { LineSeparator } from "./leaderboard-styles";
import UserPointsSection from "./UserPointsSection";
import LeaderboardTable from "./LeaderboardTable";
import PointsUpdateSection from "./PointsUpdateSection";
import useAccount from "../../hooks/useAccount";
import { useEffect, useMemo, useState } from "react";
import { LEADERBOARD_POINTS_API } from "../../constants/applications";

const Leaderboard: React.FC = () => {
  const { address: account } = useAccount();

  const [pointsData, setPointsData] = useState<any>({});
  const [fetchingPointsData, setFetchingPointsData] = useState(false);

  const INITIAL_NUMBER_OF_ROWS = 10;

  const getPointsData = async () => {
    setFetchingPointsData(true);
    try {
      const response = await fetch(
        LEADERBOARD_POINTS_API +
          `/${INITIAL_NUMBER_OF_ROWS}${account ? `/${account}` : ""}`
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch points data: ${response.statusText}`);
      }
      const data = await response.json();
      setPointsData(data);
    } catch (error) {
      console.error("Error in getting points data:", error);
    } finally {
      setFetchingPointsData(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await getPointsData();
    };

    fetchData();
  }, [account]);

  const prevWeekDetails = useMemo<any>(() => {
    if (pointsData) {
      return pointsData.previousWeekDetails;
    }
  }, [pointsData]);

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
          <PointsUpdateSection pointsUpdatedAt={prevWeekDetails?.sessionEnd} />
        </Flex>

        <LeaderboardTable />
      </Flex>
    </Flex>
  );
};

export default Leaderboard;
