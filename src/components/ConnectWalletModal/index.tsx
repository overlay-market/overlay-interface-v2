import { GradientSolidButton } from "../Button";
import { useWeb3Modal } from "@web3modal/wagmi/react";

const ConnectWalletModal: React.FC = () => {
  const { open } = useWeb3Modal();

  const handleConnect = async () => {
    try {
      await open();
    } catch (error) {
      console.error("Failed to connect:", error);
    }
  };

  return (
    <GradientSolidButton
      title={"Connect Wallet"}
      width={"136px"}
      height={"32px"}
      handleClick={handleConnect}
    />
  );
};

export default ConnectWalletModal;
