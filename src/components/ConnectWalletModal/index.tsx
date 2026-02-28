import { ConnectKitButton } from "connectkit";
import { GradientSolidButton } from "../Button";
import TokenBalance from "../Wallet/TokenBalance";
import { Flex, Text } from "@radix-ui/themes";
import useAccount from "../../hooks/useAccount";

const truncateAddress = (address: string) =>
  `${address.slice(0, 6)}...${address.slice(-4)}`;

const ConnectWalletModal: React.FC = () => {
  const { address, isAvatarTradingActive } = useAccount();

  return (
    <ConnectKitButton.Custom>
      {({ isConnected, show, truncatedAddress, ensName }) => {
        const displayName = isAvatarTradingActive && address
          ? truncateAddress(address)
          : ensName ?? truncatedAddress;

        return (isConnected
        ? <Flex direction="column">
          <Text onClick={show} style={{cursor: "pointer"}} weight={"bold"}>{displayName}</Text>
          <TokenBalance/>
        </Flex>
        : <GradientSolidButton
          title="Connect Wallet"
          width={"136px"}
          height={"32px"}
          size="14px"
          handleClick={show}
        />)
      }}
    </ConnectKitButton.Custom>
  );
};

export default ConnectWalletModal;
