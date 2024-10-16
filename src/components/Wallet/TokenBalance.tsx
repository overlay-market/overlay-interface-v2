import { Text } from "@radix-ui/themes";
import { SUPPORTED_CHAINID } from "../../constants/chains";
import Loader from "../Loader";
import NumberSpring from "../NumberSpring";
import theme from "../../theme";
import { useEffect, useState } from "react";
import useSDK from "../../hooks/useSDK";
import useMultichainContext from "../../providers/MultichainContextProvider/useMultichainContext";
import useAccount from "../../hooks/useAccount";

const TokenBalance: React.FC = () => {
  const sdk = useSDK();
  const { chainId } = useMultichainContext();
  const { address: account } = useAccount();
  const [ovlBalance, setOvlBalance] = useState<number | undefined>(undefined);

  useEffect(() => {
    const fetchData = async () => {
      if (account) {
        try {
          const ovlBalance = await sdk.ov.balance(account, 8);
          ovlBalance && setOvlBalance(Number(ovlBalance));
        } catch (error) {
          console.error("Error fetching ovlBalance:", error);
        }
      }
    };

    fetchData();
  }, [chainId, account]);

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
      {ovlBalance === undefined ? (
        <Loader size="12px" stroke="white" />
      ) : SUPPORTED_CHAINID.MAINNET === chainId ? (
        <NumberSpring inputValue={ovlBalance} text="OV" />
      ) : (
        <NumberSpring inputValue={ovlBalance} text="OVL" />
      )}
    </Text>
  );
};

export default TokenBalance;
