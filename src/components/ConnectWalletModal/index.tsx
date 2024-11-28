import { ConnectKitButton } from "connectkit";
import { GradientSolidButton } from "../Button";
import TokenBalance from "../Wallet/TokenBalance";
import { Flex, Text } from "@radix-ui/themes";

const ConnectWalletModal: React.FC = () => {
  return (
    <ConnectKitButton.Custom>
      {({ isConnected, show, truncatedAddress, ensName }) => {
        return (isConnected
        ? <Flex direction="column">
          <Text onClick={show} style={{cursor: "pointer"}} weight={"bold"}>{ensName ?? truncatedAddress}</Text>
          <TokenBalance/>
        </Flex>
        : <GradientSolidButton
          title={isConnected ? ensName ?? (truncatedAddress ?? '') : "Connect Wallet"}
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
