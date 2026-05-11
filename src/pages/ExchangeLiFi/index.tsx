import { useEffect, useRef } from "react";
import { LiFiWidget, WidgetConfig, WidgetDrawer } from "@lifi/widget";
import { Box, Flex } from "@radix-ui/themes";
import theme from "../../theme";
import { DEFAULT_CHAINID } from "../../constants/chains";
import { LiFiWidgetEventsHandler } from "./LiFiWidgetEventsHandler";
import useChainSwitch from "../../hooks/useChainSwitch";
import { useOvlTokenBalance } from "../../hooks/useOvlTokenBalance";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import useAccount from "../../hooks/useAccount";
import { GradientOutlineButton } from "../../components/Button";
import { useModalHelper } from "../../components/ConnectWalletModal/utils";

const ExchangeLiFi: React.FC = () => {
  const { address } = useAccount();
  const drawerRef = useRef<WidgetDrawer>(null);
  const switchChain = useChainSwitch();
  const { refetch } = useOvlTokenBalance();
  const { openModal } = useModalHelper();
  const isMobile = useMediaQuery("(max-width: 767px)");

  useEffect(() => {
    drawerRef.current?.openDrawer();
  }, []);

  const handleChainSwitch = async () => {
    try {
      await switchChain(DEFAULT_CHAINID as number);
      await refetch();
    } catch (error: any) {
      console.error(error);
    }
  };

  const widgetConfig: WidgetConfig = {
    buildUrl: true,
    integrator: "overlay",
    variant: "compact",
    subvariant: "default",
    appearance: "dark",
    formUpdateKey: new Date().valueOf().toString(),
    theme: {
      colorSchemes: {
        dark: {
          palette: {
            primary: { main: theme.semantic.accent },
            secondary: { main: theme.semantic.positive },
            background: {
              default: theme.color.background,
              paper: theme.semantic.panel,
            },
            text: {
              primary: theme.color.grey2,
              secondary: theme.color.grey3,
            },
            grey: {
              200: "#EEEFF2",
              300: "#D5DAE1",
              700: "#555B62",
              800: "#373F48",
            },
            playground: { main: theme.color.background },
            warning: { main: theme.color.red1 },
          },
        },
      },
      typography: { fontFamily: "Inter, sans-serif" },
      container: {
        display: "flex",
        height: "100%",
        boxShadow: "0px 8px 32px rgba(0, 0, 0, 0.08)",
        borderRadius: "4px",
      },
      shape: {
        borderRadius: 12,
        borderRadiusSecondary: 12,
        borderRadiusTertiary: 24,
      },
      components: {
        MuiCard: { defaultProps: { variant: "filled" } },
        MuiButton: {
          styleOverrides: {
            root: ({ ownerState }) => ({
              ...(ownerState.variant === "contained" &&
                ownerState.fullWidth && {
                  background:
              theme.gradient.accent,
                  color: theme.color.black,
                }),
            }),
          },
        },
      },
    },
    walletConfig: { usePartialWalletManagement: true },
  };

  return (
    <Flex
      width="100%"
      height="100%"
      justify={"center"}
      align={"center"}
      mb={isMobile ? "100px" : "0px"}
    >
      {address ? (
        <Box style={{ height: isMobile ? "auto" : "80%" }}>
          <LiFiWidget
            ref={drawerRef}
            integrator="overlay"
            config={widgetConfig}
          />
          <LiFiWidgetEventsHandler onRouteFinished={handleChainSwitch} />
        </Box>
      ) : (
        <Flex width={"200px"}>
          <GradientOutlineButton
            title={"Connect Wallet"}
            width={"100%"}
            handleClick={openModal}
          />
        </Flex>
      )}
    </Flex>
  );
};

export default ExchangeLiFi;
