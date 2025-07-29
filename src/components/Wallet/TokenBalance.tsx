import { Text } from "@radix-ui/themes";
import Loader from "../Loader";
import NumberSpring from "../NumberSpring";
import theme from "../../theme";
import { useOvlTokenBalance } from "../../hooks/useOvlTokenBalance";

const TokenBalance: React.FC = () => {
  const { ovlBalance, isLoading, isError } = useOvlTokenBalance();

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
      {ovlBalance === undefined || isLoading || isError ? (
        <Loader size="12px" stroke="white" />
      ) : (
        <NumberSpring inputValue={ovlBalance} text="OVL" />
      )}
    </Text>
  );
};

export default TokenBalance;
