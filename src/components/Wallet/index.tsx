import { useNavigate } from "react-router-dom";
import theme from "../../theme";
import { Box, Flex } from "@radix-ui/themes";
import { GradientOutlineButton } from "../Button";
import ChainSwitch from "./ChainSwitch";
import ConnectWalletModal from "../ConnectWalletModal";
import useAccount from "../../hooks/useAccount";

const Wallet: React.FC = () => {
  const { address } = useAccount();

  const navigate = useNavigate();

  const toggleWidget = () => {
    navigate("/exchange");
  };

  return (
    <Box
      width="308px"
      height={{
        initial: theme.headerSize.mobileHeight,
        sm: theme.headerSize.height,
      }}
      position="absolute"
      top="0"
      right="0"
      style={{ zIndex: "10" }}
    >
      <Flex
        gap="20px"
        align="center"
        height="100%"
        justify="end"
        pr={{ initial: "15px", sm: "20px" }}
      >
        {address && (
          <GradientOutlineButton
            title="Buy OVL"
            width="84px"
            height="29px"
            size="12px"
            handleClick={toggleWidget}
          />
        )}

        <ChainSwitch />
        <ConnectWalletModal />
      </Flex>
    </Box>
  );
};

export default Wallet;
