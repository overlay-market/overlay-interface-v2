import { GradientSolidButton } from "../Button";
import { useOpenWalletModal } from "./utils";

const ConnectWalletModal: React.FC = () => {
  return (
    <GradientSolidButton
      title={"Connect Wallet"}
      width={"136px"}
      height={"32px"}
      size="14px"
      handleClick={useOpenWalletModal}
    />
  );
};

export default ConnectWalletModal;
