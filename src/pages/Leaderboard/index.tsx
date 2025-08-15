import { Flex, Text } from "@radix-ui/themes";
import theme from "../../theme";
import { LineSeparator } from "./leaderboard-styles";
import useAccount from "../../hooks/useAccount";
import { useEffect, useMemo, useRef, useState } from "react";
import { ExtendedUserData, UserData } from "./types";
import Loader from "../../components/Loader";
import { debounce } from "../../utils/debounce";
import { usePermanentLeaderboard } from "../../hooks/usePermanentLeaderboard";
import { useENSName } from "../../hooks/useENSProfile";
import LeaderboardUpdateSection from "./LeaderboardUpdateSection";
import TopSection from "./TopSection";
import LeaderboardTable from "./LeaderboardTable";

const INITIAL_NUMBER_OF_ROWS = 15;
const ROWS_PER_LOAD = 20;

const Leaderboard: React.FC = () => {
  const { address: account } = useAccount();
  const { data: ensName } = useENSName(account);

  const [loadedNumberOfRows, setLoadedNumberOfRows] = useState(
    INITIAL_NUMBER_OF_ROWS
  );
  const observerRef = useRef<HTMLDivElement>(null);

  const { data, isLoading, isError, error } = usePermanentLeaderboard(
    loadedNumberOfRows,
    account
  );

  const ranks = useMemo<UserData[] | undefined>(() => {
    return data?.leaderboard;
  }, [data]);

  const leaderboardLastUpdated = useMemo<string | undefined>(() => {
    return data?.lastUpdated;
  }, [data]);

  const currentUserData = useMemo<ExtendedUserData | undefined>(() => {
    if (!data?.userRank || !account) return undefined;

    return {
      ...data.userRank,
      username: ensName || undefined,
    };
  }, [data, account, ensName]);

  // Infinite scroll logic
  const hasMore = useMemo(() => {
    if (!data) return true;
    return data.leaderboard.length < data.totalUsers;
  }, [data]);

  const loadMoreData = () => {
    if (isLoading || !hasMore) return;
    setLoadedNumberOfRows((prev) => prev + ROWS_PER_LOAD);
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

  useEffect(() => {
    if (isError) {
      console.error("Error loading leaderboard data:", error);
    }
  }, [isError, error]);

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
          <TopSection />
          <LeaderboardUpdateSection
            leaderboardUpdatedAt={leaderboardLastUpdated}
          />
        </Flex>

        <LeaderboardTable ranks={ranks} currentUserData={currentUserData} />

        {isLoading && (
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
