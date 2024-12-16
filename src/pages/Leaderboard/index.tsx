import { Flex, Text } from "@radix-ui/themes";
import theme from "../../theme";
import { LineSeparator } from "./leaderboard-styles";
import UserPointsSection from "./UserPointsSection";
import LeaderboardTable from "./LeaderboardTable";
import PointsUpdateSection from "./PointsUpdateSection";
import useAccount from "../../hooks/useAccount";
import { useEffect, useMemo, useState } from "react";
import { LEADERBOARD_POINTS_API } from "../../constants/applications";
import { LeaderboardPointsData, PrevWeekDetails, UserData } from "./types";
import { Address } from "viem";

const Leaderboard: React.FC = () => {
  const { address: account } = useAccount();

  const [pointsData, setPointsData] = useState<
    LeaderboardPointsData | undefined
  >(undefined);
  const [currentUserData, setCurrentUserData] = useState<UserData | undefined>(
    undefined
  );
  const [fetchingPointsData, setFetchingPointsData] = useState(false);

  const INITIAL_NUMBER_OF_ROWS = 10;

  const getPointsData = async (numberOfRows: number, account?: Address) => {
    setFetchingPointsData(true);
    try {
      const response = await fetch(
        LEADERBOARD_POINTS_API +
          `/${numberOfRows}${account ? `/${account}` : ""}`
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch points data: ${response.statusText}`);
      }
      const data: LeaderboardPointsData = await response.json();
      return data;
    } catch (error) {
      console.error("Error in getting points data:", error);
      return undefined;
    } finally {
      setFetchingPointsData(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const data = await getPointsData(INITIAL_NUMBER_OF_ROWS, account);
      setPointsData(data);
    };

    fetchData();
  }, []);

  const prevWeekDetails = useMemo<PrevWeekDetails | undefined>(() => {
    if (pointsData) {
      return pointsData.previousWeekDetails;
    }
  }, [pointsData]);

  const initialUserData = useMemo<UserData | undefined>(() => {
    if (pointsData) {
      return pointsData.user;
    }
  }, [pointsData]);

  const ranks = useMemo<UserData[] | undefined>(() => {
    if (pointsData) {
      return pointsData.leaderboardTable;
    }
  }, [pointsData]);

  useEffect(() => {
    const fetchUserData = async () => {
      const data = await getPointsData(0, account);
      data && setCurrentUserData(data.user);
    };

    if (account && initialUserData !== undefined) {
      setCurrentUserData(initialUserData);
    }
    if (account && pointsData && initialUserData === undefined) {
      fetchUserData();
    }
    if (!account) {
      setCurrentUserData(undefined);
    }
  }, [account, pointsData, initialUserData]);

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
          <UserPointsSection
            userPoints={currentUserData?.totalPoints}
            isLoading={fetchingPointsData}
          />
          <PointsUpdateSection pointsUpdatedAt={prevWeekDetails?.sessionEnd} />
        </Flex>

        <LeaderboardTable ranks={ranks} currentUserData={currentUserData} />
      </Flex>
    </Flex>
  );
};

export default Leaderboard;
