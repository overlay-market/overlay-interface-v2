import { Flex, Text } from "@radix-ui/themes";
import useAccount from "../../hooks/useAccount";
import Loader from "../../components/Loader";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import theme from "../../theme";
import { GradientText, Link } from "./user-points-section-styles";
import { LEADERBOARD_LEARN_MORE_LINK } from "../../constants/links";
import { useModalHelper } from "../../components/ConnectWalletModal/utils";

const UserPointsSection: React.FC = () => {
  const { address: account } = useAccount();
  const { openModal } = useModalHelper();
  const isMobile = useMediaQuery("(max-width: 767px)");

  const userPoints = 10;
  const isLoading = false;
  return (
    <Flex
      direction={"column"}
      gap={"8px"}
      align={{ initial: "center", sm: "start" }}
    >
      {account ? (
        <Flex>
          <Text
            size={{ initial: "5", sm: "6" }}
            style={{
              fontWeight: isMobile ? "700" : "600",
              color: isMobile ? theme.color.grey1 : theme.color.grey2,
            }}
          >
            You have {isLoading ? <Loader /> : `${userPoints ?? "0"} points`}
          </Text>
        </Flex>
      ) : (
        <Flex gap={"8px"}>
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
            style={{
              fontWeight: isMobile ? "700" : "600",
              color: isMobile ? theme.color.grey1 : theme.color.grey2,
            }}
          >
            to see points
          </Text>
        </Flex>
      )}

      <Flex gap={"8px"} align={"center"}>
        <Text size={"1"} style={{ color: theme.color.grey3 }}>
          Points are calculated on Thursdays
        </Text>
        <Link target="_blank" href={LEADERBOARD_LEARN_MORE_LINK}>
          <GradientText>Learn more</GradientText>
        </Link>
      </Flex>
    </Flex>
  );
};

export default UserPointsSection;
