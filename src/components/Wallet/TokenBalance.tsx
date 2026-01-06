import { Text } from "@radix-ui/themes";
import Loader from "../Loader";
import NumberSpring from "../NumberSpring";
import theme from "../../theme";
import { useStableTokenBalance } from "../../hooks/useStableTokenBalance";

const TokenBalance: React.FC = () => {
  const { stableBalance, isLoading, isError } = useStableTokenBalance();

  return (
    <Text
      size={"1"}
      style={{
        color: theme.color.grey2,
        fontFamily: "Roboto Mono, monospace",
        fontWeight: "500",
        opacity: 0.8,
      }}
    >
      {stableBalance === undefined || isLoading || isError ? (
        <Loader size="12px" stroke="white" />
      ) : (
        <NumberSpring inputValue={stableBalance} text="USDT" />
      )}
    </Text>
  );
};

export default TokenBalance;
