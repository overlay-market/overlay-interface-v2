import { Flex, Text } from "@radix-ui/themes";
import theme from "../../theme";
import { LineSeparator } from "./leaderboard-styles";
import UserPointsSection from "./UserPointsSection";
import LeaderboardTable from "./LeaderboardTable";
import PointsUpdateSection from "./PointsUpdateSection";
import useAccount from "../../hooks/useAccount";
import { useEffect, useMemo, useRef, useState } from "react";
import { LEADERBOARD_POINTS_API } from "../../constants/applications";
import {
  ExtendedUserData,
  LeaderboardPointsData,
  PrevWeekDetails,
  SessionDetails,
  UserData,
} from "./types";
import { Address } from "viem";
import Loader from "../../components/Loader";
import { debounce } from "../../utils/debounce";
import { useGetEnsName } from "../../utils/viemEnsUtils";
import { GradientText } from "./user-points-section-styles";

const INITIAL_NUMBER_OF_ROWS = 10;
const ROWS_PER_LOAD = 20;
const comingSoon = true;

const Leaderboard: React.FC = () => {
  const { address: account } = useAccount();

  const getEnsName = useGetEnsName();

  const [pointsData, setPointsData] = useState<
    LeaderboardPointsData | undefined
  >(undefined);
  const [currentUserData, setCurrentUserData] = useState<
    ExtendedUserData | undefined
  >(undefined);
  const [fetchingPointsData, setFetchingPointsData] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [loadedNumberOfRows, setLoadedNumberOfRows] = useState(
    INITIAL_NUMBER_OF_ROWS
  );
  const observerRef = useRef<HTMLDivElement>(null);

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

  const sessionDetails = useMemo<SessionDetails | undefined>(() => {
    if (pointsData) {
      return pointsData.sessionDetails;
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
    const resolveUsername = async (user: ExtendedUserData) => {
      const username = await getEnsName(user._id as Address);
      const resolvedUser = {
        ...user,
        username: username ?? undefined,
      };

      setCurrentUserData(resolvedUser);
    };

    const fetchUserData = async () => {
      const data = await getPointsData(0, account);
      if (data && data.user) {
        const user = {
          ...data.user,
          username: undefined,
        };
        resolveUsername(user);
      }
    };

    if (account && initialUserData !== undefined) {
      const user = {
        ...initialUserData,
        username: undefined,
      };
      resolveUsername(user);
    }
    if (account && pointsData && initialUserData === undefined) {
      fetchUserData();
    }
    if (!account) {
      setCurrentUserData(undefined);
    }
  }, [account, pointsData, initialUserData]);

  const loadMoreData = async () => {
    if (loading || !hasMore) return;
    setLoading(true);

    const data = await getPointsData(loadedNumberOfRows + ROWS_PER_LOAD);

    if (data) {
      setPointsData(data);
      setLoadedNumberOfRows((prev) => prev + ROWS_PER_LOAD);
    }

    if (data && data.leaderboardTable.length >= data.totalUsers) {
      setHasMore(false);
    }

    setLoading(false);
  };

  const observer = useRef<IntersectionObserver>();
  const isFirstTrigger = useRef(true);

  useEffect(() => {
    const loadMoreDataDebounced = debounce(() => {
      loadMoreData();
    }, 200);

    observer.current = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (isFirstTrigger.current) {
          isFirstTrigger.current = false;
          return;
        }

        if (entry.isIntersecting && hasMore) {
          loadMoreDataDebounced();
        }
      },
      {
        threshold: 0.1,
      }
    );

    const currentRef = observerRef.current;
    if (currentRef) observer.current.observe(currentRef);

    return () => {
      if (currentRef) observer.current?.unobserve(currentRef);
    };
  }, [hasMore, loadedNumberOfRows]);

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

      {comingSoon && (
        <Flex
          position="fixed"
          top="55px"
          bottom="20"
          left="20"
          width="95%"
          height={{ initial: "85%", sm: "100%" }}
          style={{
            zIndex: "1000",
          }}
          justify="center"
          align="center"
        >
          <Flex
            style={{
              background: "black",
              padding: "24px",
              borderRadius: "8px",
              boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
            }}
            maxWidth="80%"
            direction="column"
            align="center"
            gap="16px"
          >
            <GradientText
              size={{ initial: "5", sm: "6" }}
              style={{
                fontWeight: "700",
                cursor: "pointer",
              }}
            >
              T🔥O🔥R🔥C🔥H
            </GradientText>
            <Text size="2" style={{ textAlign: "center" }}>
              Campaign has begun! Points will update on May 27.
            </Text>

            <a
              href="https://overlayprotocol.medium.com/t-o-r-c-h-b0213aa3ae85"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: theme.color.grey3,
                fontWeight: "600",
                textDecoration: "underline",
              }}
            >
              Learn more
            </a>
          </Flex>
        </Flex>
      )}

      <Flex
        direction={"column"}
        gap={{ initial: "24px", sm: "28px", md: "32px" }}
        pt={"16px"}
        pl={{ initial: "4px", sm: "16px", md: "12px" }}
        pr={{ initial: "4px", sm: "0px" }}
        style={comingSoon ? { filter: "blur(5px)" } : {}}
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
          <PointsUpdateSection
            pointsUpdatedAt={
              sessionDetails?.sessionLastUpdated || prevWeekDetails?.sessionEnd
            }
          />
        </Flex>

        <LeaderboardTable ranks={ranks} currentUserData={currentUserData} />

        {loading && (
          <Flex
            justify={"center"}
            width={"100%"}
            height={"30px"}
            align={"center"}
          >
            <Loader />
          </Flex>
        )}
        <Flex ref={observerRef} width={"10px"} height={"10px"} />
      </Flex>
    </Flex>
  );
};

export default Leaderboard;
