import { useSetActiveWallet } from "@privy-io/wagmi";
import { GradientSolidButton } from "../Button";
import {usePrivy, useWallets} from '@privy-io/react-auth';

const ConnectWalletModal: React.FC = () => {
  const {login} = usePrivy()
  const {setActiveWallet} = useSetActiveWallet();
  const {wallets, ready: walletsReady} = useWallets();

  const handleConnect = async () => {
    try {
      walletsReady && wallets[0] ? setActiveWallet(wallets[0])
      : await login();
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
