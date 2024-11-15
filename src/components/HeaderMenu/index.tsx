import { useState } from "react";
import MenuHamburger from "./MenuHamburger";
import { Box, DropdownMenu, Flex, Text } from "@radix-ui/themes";
import useAccount from "../../hooks/useAccount";
import useDisconnect from "../../hooks/useDisconnect";
import {
  CHAIN_LIST,
  NETWORK_ICONS,
  SUPPORTED_CHAINID,
} from "../../constants/chains";
import {usePrivy, useWallets} from '@privy-io/react-auth';
import theme from "../../theme";
import {
  ChainLogo,
  DropdownContent,
  DropdownItem,
  DropdownTitle,
  HeaderMenuButton,
  Separator,
} from "./header-menu-styles";
import NavLinksSection from "../NavBar/NavLinksSection";
import SocialLinksSection from "../NavBar/SocialLinksSection";
import { NAVBAR_MODE } from "../../constants/applications";
import {useSetActiveWallet} from '@privy-io/wagmi';

const networkLabel = (chainId: number) => {
  const isTestnet = [
    SUPPORTED_CHAINID.ARBITRUM_SEPOLIA,
    SUPPORTED_CHAINID.BARTIO,
    SUPPORTED_CHAINID.IMOLA,
  ].includes(chainId);

  return (
    <>
      <Text>{CHAIN_LIST[chainId]}</Text>
      {isTestnet ? (
        <Text style={{ color: theme.color.red1 }}>Testnet</Text>
      ) : null}
    </>
  );
};

const HeaderMenu = () => {
  const [open, setOpen] = useState(false);
  const { address: account, chainId } = useAccount();
  const { disconnect } = useDisconnect();

  const handleWalletDisconnect = () => {
    disconnect();
  };

  const {login} = usePrivy()
  const {setActiveWallet} = useSetActiveWallet();
  const {wallets, ready: walletsReady} = useWallets();

  const handleWalletConnect = async () => {
    try {
      await login();
    } catch (error) {
      walletsReady && setActiveWallet(wallets[0]);
      console.error("Failed to connect:", error);
    }
  };

  return (
    <DropdownMenu.Root open={open} onOpenChange={setOpen}>
      <DropdownMenu.Trigger>
        <HeaderMenuButton onClick={() => setOpen(true)}>
          <MenuHamburger open={open} />
        </HeaderMenuButton>
      </DropdownMenu.Trigger>

      <DropdownContent sideOffset={10} align="end">
        {account && chainId && (
          <DropdownTitle>
            <Flex gap="8px">
              <ChainLogo src={NETWORK_ICONS[chainId as number]} />
              {networkLabel(chainId)}
            </Flex>
          </DropdownTitle>
        )}

        <Box
          display={{ initial: "block", sm: "none" }}
          width={{ initial: "auto" }}
          onClick={() => setOpen(false)}
        >
          <NavLinksSection mode={NAVBAR_MODE.BURGER} />
        </Box>

        <Separator />

        {account ? (
          <DropdownItem onClick={handleWalletDisconnect}>
            <div>Disconnect Wallet</div>
          </DropdownItem>
        ) : (
          <DropdownItem onClick={handleWalletConnect}>
            <Text>Connect Wallet</Text>
          </DropdownItem>
        )}
        <Flex
          display={{ initial: "flex", sm: "none" }}
          onClick={() => setOpen(false)}
        >
          <SocialLinksSection />
        </Flex>
      </DropdownContent>
    </DropdownMenu.Root>
  );
};

export default HeaderMenu;
