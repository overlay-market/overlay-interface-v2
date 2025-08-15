import { Flex, Text } from "@radix-ui/themes";
import useAccount from "../../hooks/useAccount";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import theme from "../../theme";
import { GradientText } from "./top-section-styles";
import { useModalHelper } from "../../components/ConnectWalletModal/utils";

const TopSection: React.FC = () => {
  const { address: account } = useAccount();
  const { openModal } = useModalHelper();
  const isMobile = useMediaQuery("(max-width: 767px)");

  return (
    <Flex
      direction={"column"}
      gap={"8px"}
      align={{ initial: "center", sm: "start" }}
    >
      {!account && (
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
    </Flex>
  );
};

export default TopSection;
