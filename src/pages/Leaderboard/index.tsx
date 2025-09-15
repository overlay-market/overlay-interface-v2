import { Flex, Text } from "@radix-ui/themes";
import theme from "../../theme";
import { LineSeparator } from "./leaderboard-styles";
import useAccount from "../../hooks/useAccount";
import { useEffect, useMemo, useRef, useState } from "react";
import { ExtendedUserData, UserData } from "./types";
import Loader from "../../components/Loader";
import { debounce } from "../../utils/debounce";
import { useLeaderboard } from "../../hooks/useLeaderboard";
import { useENSName } from "../../hooks/useENSProfile";
import LeaderboardUpdateSection from "./LeaderboardUpdateSection";
import TopSection from "./TopSection";
import LeaderboardTable from "./LeaderboardTable";
import { useNavigate, useParams } from "react-router-dom";
import * as Select from "@radix-ui/react-select";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import styled from "styled-components";

const INITIAL_NUMBER_OF_ROWS = 15;
const ROWS_PER_LOAD = 20;

const DEFAULT_SEASON_VALUE = "all-time";

const SEASON_OPTIONS = [
  {
    value: DEFAULT_SEASON_VALUE,
    label: "All-Time Leaderboard",
  },
  {
    value: "genesis",
    label: "Genesis Leaderboard",
  },
];

const formatSeasonLabel = (value: string) => {
  const spacedValue = value.replace(/[-_]/g, " ");
  const capitalized = spacedValue.replace(/\b\w/g, (char) => char.toUpperCase());
  return `${capitalized} Leaderboard`;
};

const SeasonSelectTrigger = styled(Select.Trigger)`
  width: 226px;
  height: 58px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  border-radius: 8px;
  border: 1px solid transparent;
  background: linear-gradient(${theme.color.background}, ${theme.color.background})
      padding-box,
    linear-gradient(90deg, #ffc955 0%, #ff7cd5 100%) border-box;
  color: ${theme.color.white};
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  outline: none;

  &:hover {
    box-shadow: 0px 0px 12px 3px #ffffff73;
  }
`;

const SeasonSelectContent = styled(Select.Content)`
  background-color: ${theme.color.grey4};
  border-radius: 12px;
  padding: 6px;
  border: 1px solid ${theme.color.darkBlue};
  box-shadow: 0px 10px 38px -10px rgba(22, 23, 24, 0.35),
    0px 10px 20px -15px rgba(22, 23, 24, 0.2);
`;

const SeasonSelectItem = styled(Select.Item)`
  font-size: 14px;
  line-height: 1;
  color: ${theme.color.white};
  border-radius: 8px;
  display: flex;
  align-items: center;
  height: 34px;
  padding: 0 32px 0 12px;
  position: relative;
  user-select: none;
  cursor: pointer;

  &[data-highlighted] {
    outline: none;
    background: rgba(255, 255, 255, 0.12);
  }

  &[data-state="checked"] {
    font-weight: 600;
  }
`;

const Leaderboard: React.FC = () => {
  const { address: account } = useAccount();
  const { data: ensName } = useENSName(account);
  const navigate = useNavigate();
  const { seasonId: seasonIdParam } = useParams<{ seasonId?: string }>();
  const [allRanks, setAllRanks] = useState<UserData[]>([]);
  const [loadedNumberOfRows, setLoadedNumberOfRows] = useState(
    INITIAL_NUMBER_OF_ROWS
  );
  const observerRef = useRef<HTMLDivElement>(null);
  const observer = useRef<IntersectionObserver>();
  const isFirstTrigger = useRef(true);
  const previousSeasonIdRef = useRef<string | undefined>(undefined);

  const seasonId = seasonIdParam || undefined;
  const normalizedSeasonValue = seasonId ?? DEFAULT_SEASON_VALUE;

  const seasonOptions = useMemo(() => {
    const options = [...SEASON_OPTIONS];
    if (
      seasonId &&
      !options.some((option) => option.value.toLowerCase() === seasonId.toLowerCase())
    ) {
      options.push({
        value: seasonId,
        label: formatSeasonLabel(seasonId),
      });
    }
    return options;
  }, [seasonId]);

  const { data, isLoading, isError, error } = useLeaderboard(
    loadedNumberOfRows,
    account,
    seasonId
  );

  useEffect(() => {
    setAllRanks([]);
    setLoadedNumberOfRows(INITIAL_NUMBER_OF_ROWS);
    isFirstTrigger.current = true;
  }, [seasonId]);

  useEffect(() => {
    if (!data?.leaderboard) return;

    setAllRanks((prev) => {
      const isNewSeason = previousSeasonIdRef.current !== seasonId;
      const shouldReplace =
        isNewSeason || prev.length === 0 || loadedNumberOfRows === INITIAL_NUMBER_OF_ROWS;

      if (shouldReplace) {
        previousSeasonIdRef.current = seasonId;
        return data.leaderboard;
      }

      const existingRanks = new Set(prev.map((p) => p._id));
      const newUsers = data.leaderboard.filter((u) => !existingRanks.has(u._id));

      previousSeasonIdRef.current = seasonId;
      return [...prev, ...newUsers];
    });
  }, [data?.leaderboard, seasonId, loadedNumberOfRows]);

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

  const handleSeasonChange = (value: string) => {
    if (value === normalizedSeasonValue) return;

    if (value === DEFAULT_SEASON_VALUE) {
      navigate("/leaderboard");
      return;
    }

    navigate(`/leaderboard/${value}`);
  };

  useEffect(() => {
    const loadMoreDataDebounced = debounce(() => {
      loadMoreData();
    }, 200);

    observer.current = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (
          isFirstTrigger.current &&
          loadedNumberOfRows === INITIAL_NUMBER_OF_ROWS
        ) {
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
  }, [hasMore, loadedNumberOfRows, isLoading]);

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
          <Flex
            direction={{ initial: "column", sm: "row" }}
            gap={"12px"}
            align={"center"}
          >
            <Select.Root
              value={normalizedSeasonValue}
              onValueChange={handleSeasonChange}
            >
              <SeasonSelectTrigger aria-label="Select leaderboard season">
                <Select.Value placeholder="Select season" />
                <Select.Icon>
                  <ChevronDownIcon />
                </Select.Icon>
              </SeasonSelectTrigger>
              <Select.Portal>
                <SeasonSelectContent
                  position="popper"
                  sideOffset={6}
                >
                  <Select.Viewport>
                    {seasonOptions.map((option) => (
                      <SeasonSelectItem key={option.value} value={option.value}>
                        <Select.ItemText>{option.label}</Select.ItemText>
                      </SeasonSelectItem>
                    ))}
                  </Select.Viewport>
                </SeasonSelectContent>
              </Select.Portal>
            </Select.Root>
            <LeaderboardUpdateSection
              leaderboardUpdatedAt={leaderboardLastUpdated}
            />
          </Flex>
        </Flex>

        <LeaderboardTable ranks={allRanks} currentUserData={currentUserData} />

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
