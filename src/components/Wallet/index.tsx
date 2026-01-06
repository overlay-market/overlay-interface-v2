import { useNavigate } from "react-router-dom";
import theme from "../../theme";
import { Box, Flex } from "@radix-ui/themes";
import { GradientOutlineButton } from "../Button";
import ChainSwitch from "./ChainSwitch";
import ConnectWalletModal from "../ConnectWalletModal";
import SettingsDropdown from "./SettingsDropdown";
import { DEFAULT_CHAINID } from "../../constants/chains";
import { OVL_ADDRESS } from "overlay-sdk";

const Wallet: React.FC = () => {
  const navigate = useNavigate();

  const toggleWidget = () => {
    // Navigate to exchange with OVL pre-selected as target token
    const searchParams = new URLSearchParams({
      toChain: DEFAULT_CHAINID.toString(),
      toToken: OVL_ADDRESS[DEFAULT_CHAINID as number],
    });
    navigate(`/exchange?${searchParams.toString()}`);
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
        <GradientOutlineButton
          title="Buy OVL"
          width="84px"
          height="29px"
          size="12px"
          handleClick={toggleWidget}
        />

        <ChainSwitch />
        <SettingsDropdown />
        <ConnectWalletModal />
      </Flex>
    </Box>
  );
};

export default Wallet;
