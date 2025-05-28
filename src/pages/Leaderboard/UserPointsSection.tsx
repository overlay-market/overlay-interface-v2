import { Flex, Text } from "@radix-ui/themes";
import useAccount from "../../hooks/useAccount";
import Loader from "../../components/Loader";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import theme from "../../theme";
import { GradientText, Link } from "./user-points-section-styles";
import { LEADERBOARD_LEARN_MORE_LINK } from "../../constants/links";
import { useModalHelper } from "../../components/ConnectWalletModal/utils";

type UserPointsSectionProps = {
  userPoints?: number;
  isLoading: boolean;
};

const UserPointsSection: React.FC<UserPointsSectionProps> = ({
  userPoints,
  isLoading,
}) => {
  const { address: account } = useAccount();
  const { openModal } = useModalHelper();
  const isMobile = useMediaQuery("(max-width: 767px)");

  return (
    <Flex
      direction={"column"}
      gap={"8px"}
      align={{ initial: "center", sm: "start" }}
    >
      {isLoading ? (
        <Loader />
      ) : account ? (
        <Flex>
          <Text
            size={{ initial: "5", sm: "6" }}
            style={{
              fontWeight: isMobile ? "700" : "600",
              color: isMobile ? theme.color.grey1 : theme.color.grey2,
            }}
          >
            You have {userPoints ?? 0} Points
          </Text>
        </Flex>
      ) : (
        <Flex
          gap={"8px"}
          direction={{ initial: "column", md: "row" }}
          align={{ initial: "center", sm: "start" }}
        >
          <GradientText
            size={{ initial: "5", sm: "6" }}
            style={{
              fontWeight: isMobile ? "700" : "600",
              cursor: "pointer",
            }}
            onClick={openModal}
          >
            Connect Wallet
          </GradientText>
          <Text
            size={{ initial: "5", sm: "6" }}
            align={{ initial: "center", sm: "left" }}
            style={{
              fontWeight: isMobile ? "700" : "600",
              color: isMobile ? theme.color.grey1 : theme.color.grey2,
            }}
          >
            to see your place on the leaderboard
          </Text>
        </Flex>
      )}

      <Flex gap={"8px"} align={"center"}>
        <Text size={"1"} style={{ color: theme.color.grey3 }}>
          Leaderboard is updated every day!
        </Text>
        {false && (
          <Link target="_blank" href={LEADERBOARD_LEARN_MORE_LINK}>
            <GradientText>Learn more</GradientText>
          </Link>
        )}
      </Flex>
    </Flex>
  );
};

export default UserPointsSection;
