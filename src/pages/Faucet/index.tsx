import { Flex, Text } from "@radix-ui/themes";
// import theme from "../../theme";
import { useState } from "react";
import useAxios from "axios-hooks";
import axios from "axios";
import useAccount from "../../hooks/useAccount";
import { FAUCET_API } from "../../constants/applications";
import { GradientSolidButton, GradientOutlineButton } from "../../components/Button";
import { useModalHelper } from "../../components/ConnectWalletModal/utils";
// import { useWalletModalToggle } from "../../state/application/hooks";

// type Chain = "sepolia" | "imola" | "bnb-testnet";

const SEPOLIA_FAUCET_API = FAUCET_API

const Faucet: React.FC = () => {
  const { address } = useAccount();
  // const toggleWalletModal = useWalletModalToggle();

  // const [selectedChain, setSelectedChain] = useState<Chain>("sepolia");
  const [responseMessage, setResponseMessage] = useState<string | null>(null);
  const { openModal } = useModalHelper();

  const [{ loading }, refetch] = useAxios(
    {
      url: SEPOLIA_FAUCET_API,
      method: "POST",
    },
    { manual: true }
  );

  const handleRequest = async () => {
    if (!address) {
      // toggleWalletModal();
      return;
    }
    try {
      const { data } = await refetch({
        data: {
          tokens: ["ovl"],
          chains: ["bnb-testnet"],            
          recipient: address
        },
      });
      setResponseMessage(data.message || "Request submitted successfully.");
    } catch (error) {
      // error is unknown by default; narrow to AxiosError
      const defaultMsg = "Error requesting faucet tokens.";
      if (axios.isAxiosError(error)) {
        const errMsg = error.response?.data?.message;
        setResponseMessage(errMsg ?? defaultMsg);
      } else {
        setResponseMessage(defaultMsg);
      }
    }
  };

  return (
    <Flex 
      width="100vw"
      height="80vh"
      justify="center"
      align="center"
      direction="column"
      px="16px"
    >
      <Text size="5" weight="medium">
        Get Test OVL for BSC Testnet
      </Text>
      <Text size="2" style={{ margin: 12 }}>
        ✓ 0.002 BNB for 3 days on BSC Mainnet is needed for test funding.
      </Text>
      {address && (
        <GradientSolidButton
          title="Request Faucet"
          handleClick={handleRequest}
          isDisabled={loading}
        />
      )}
      {!address && (
        <GradientOutlineButton
          title={"Connect Wallet"}
          handleClick={openModal}
        />
      )}
      {responseMessage && (
        <Text size="2" weight="medium" style={{ margin: 12 }}>
          {responseMessage}
        </Text>
      )}
    </Flex>
  );
};

export default Faucet;
