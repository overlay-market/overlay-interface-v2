import { Flex, Skeleton, Text } from "@radix-ui/themes";
import theme from "../../theme";
import { LineSeparator } from "./leaderboard-styles";
import UserPointsSection from "./UserPointsSection";
import LeaderboardTable from "./LeaderboardTable";
import PointsUpdateSection from "./PointsUpdateSection";
import useAccount from "../../hooks/useAccount";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ExtendedUserData,
  LeaderboardPointsData,
  PrevWeekDetails,
  SessionDetails,
  UserData,
  UserReferralData,
} from "./types";
import { Address } from "viem";
import Loader from "../../components/Loader";
import { debounce } from "../../utils/debounce";
import { useGetEnsName } from "../../utils/viemEnsUtils";
import { GradientText } from "./user-points-section-styles";
import ReferralSection from "./ReferralSection";
import ReferralModal from "./ReferralSection/ReferralModal";
import { useSearchParams } from "react-router-dom";
import { fetchPointsData } from "./utils/fetchPointsData";
import { fetchUserReferralData } from "./utils/fetchUserReferralData";

const INITIAL_NUMBER_OF_ROWS = 15;
const ROWS_PER_LOAD = 20;
const comingSoon = false;

const Leaderboard: React.FC = () => {
  const { address: account } = useAccount();
  const [searchParams] = useSearchParams();
  const referralCodeFromURL = searchParams.get("referrer");

  const getEnsName = useGetEnsName();

  const [pointsData, setPointsData] = useState<
    LeaderboardPointsData | undefined
  >(undefined);
  const [currentUserData, setCurrentUserData] = useState<
    ExtendedUserData | undefined
  >(undefined);
  const [userReferralData, setUserReferralData] = useState<
    UserReferralData | undefined
  >(undefined);
  const [fetchingPointsData, setFetchingPointsData] = useState(false);
  const [fetchingReferralsData, setFetchingReferralsData] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [loadedNumberOfRows, setLoadedNumberOfRows] = useState(
    INITIAL_NUMBER_OF_ROWS
  );
  const [openReferralModal, setOpenReferralModal] = useState(false);
  const [triggerRefetchReferralData, setTriggerRefetchReferralData] =
    useState(false);

  const observerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchReferralData = async () => {
      if (!account) return;

      const data = await fetchUserReferralData(
        account,
        setFetchingReferralsData
      );
      setUserReferralData(data);
    };

    fetchReferralData();
  }, [account]);

  useEffect(() => {
    const fetchReferralData = async () => {
      if (!account || !triggerRefetchReferralData) return;

      const data = await fetchUserReferralData(
        account,
        setFetchingReferralsData
      );
      setUserReferralData(data);
      setTriggerRefetchReferralData(false);
    };

    fetchReferralData();
  }, [triggerRefetchReferralData, account]);

  const userBonusInfo = useMemo(() => {
    if (!userReferralData) return;

    return {
      affiliateBonus: userReferralData.previousRunAffiliateBonus,
      referralBonus: userReferralData.previousRunReferralBonus,
      walletBoostBonus: userReferralData.previousRunWalletBoostBonus,
    };
  }, [account, triggerRefetchReferralData, userReferralData]);

  const hasJoinedReferralCampaign = useMemo(() => {
    if (!account || !userReferralData) {
      return false;
    }

    return (
      userReferralData.referredByAffiliate !== null ||
      userReferralData.myReferralCode !== null
    );
  }, [account, userReferralData]);

  useEffect(() => {
    if (referralCodeFromURL && !hasJoinedReferralCampaign) {
      setOpenReferralModal(true);
    }
  }, [account, referralCodeFromURL, hasJoinedReferralCampaign]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchPointsData(
        INITIAL_NUMBER_OF_ROWS,
        account,
        setFetchingPointsData
      );
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
      const data = await fetchPointsData(0, account, setFetchingPointsData);
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

    const data = await fetchPointsData(
      loadedNumberOfRows + ROWS_PER_LOAD,
      undefined,
      setFetchingPointsData
    );

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
          top="0"
          left="0"
          width="100%"
          height="100%"
          style={{
            zIndex: "1000",
            pointerEvents: "none",
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
              Coming Soon
            </GradientText>
            <Text size="2" style={{ textAlign: "center" }}>
              BSC testnet points campaign. Stay tuned!
            </Text>
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

        {fetchingReferralsData ? (
          <Skeleton width="100%" height="50px" />
        ) : (
          <ReferralSection
            hasJoinedReferralCampaign={hasJoinedReferralCampaign}
            userData={userReferralData}
            setOpenReferralModal={setOpenReferralModal}
            triggerRefetch={setTriggerRefetchReferralData}
          />
        )}

        <LeaderboardTable
          ranks={ranks}
          currentUserData={currentUserData}
          userBonusInfo={userBonusInfo}
        />

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

      {openReferralModal && (
        <ReferralModal
          referralCodeFromURL={referralCodeFromURL}
          open={openReferralModal}
          triggerRefetch={setTriggerRefetchReferralData}
          handleDismiss={() => setOpenReferralModal(false)}
        />
      )}
    </Flex>
  );
};

export default Leaderboard;
