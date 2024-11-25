import { useEnsName } from "wagmi";
import useConnect from "../../providers/ConnectionProvider/useConnect";
import { shortenAddress } from "../../utils/web3";
import { Flex, Text } from "@radix-ui/themes";
import { AlertTriangle } from "react-feather";
import TokenBalance from "./TokenBalance";
import ConnectWalletModal from "../ConnectWalletModal";
import useAccount from "../../hooks/useAccount";
import { useOpenWalletModal } from "../ConnectWalletModal/utils";

const Web3Status: React.FC = () => {
  const { address: account } = useAccount();
  const { error } = useConnect();
  const { data: ensName } = useEnsName({
    address: account,
  });

  return error ? (
    <Flex direction="column">
      <Flex align={"center"} gap={"8px"}>
        <AlertTriangle color={"white"} size={15} />
        <Text size={"1"}>ERROR -</Text>
      </Flex>
      <Text size={"1"}>Refresh browser</Text>
    </Flex>
  ) : account ? (
    <Flex direction="column">
      <Text onClick={useOpenWalletModal} style={{cursor: "pointer"}} weight={"bold"}>{ensName ?? shortenAddress(String(account))}</Text>
      <TokenBalance />
    </Flex>
  ) : (
    <ConnectWalletModal />
  );
};

export default Web3Status;
