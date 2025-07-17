import { forwardRef } from "react";
import { LiFiWidget, WidgetDrawer } from "@lifi/widget";
import theme from "../../../theme";

const ExchangeLiFiWidget = forwardRef<WidgetDrawer, {}>((_, ref) => {
  return (
    <LiFiWidget
      ref={ref}
      integrator="overlay"
      config={{
        buildUrl: false,
        variant: "drawer",
        subvariant: "default",
        appearance: "dark",
        toChain: 56,
        toToken: "0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82",
        theme: {
          colorSchemes: {
            dark: {
              palette: {
                primary: {
                  main: theme.color.darkBlue,
                },
                secondary: {
                  main: theme.color.green2,
                },
                background: {
                  default: theme.color.background,
                  paper: theme.color.grey4,
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
                playground: {
                  main: theme.color.background,
                },
                warning: {
                  main: theme.color.red1,
                },
              },
            },
          },
          typography: {
            fontFamily: "Inter, sans-serif",
          },
          container: {
            boxShadow: "0px 8px 32px rgba(0, 0, 0, 0.08)",
            borderRadius: "16px",
            height: "100%",
          },
          shape: {
            borderRadius: 12,
            borderRadiusSecondary: 12,
            borderRadiusTertiary: 24,
          },
          components: {
            MuiCard: {
              defaultProps: {
                variant: "filled",
              },
            },
            MuiButton: {
              styleOverrides: {
                root: ({ ownerState }) => ({
                  ...(ownerState.variant === "contained" &&
                    ownerState.fullWidth && {
                      background:
                        "linear-gradient(90deg, #ffc955 0%, #ff7cd5 100%)",
                      color: theme.color.black,
                    }),
                }),
              },
            },
          },
        },
        walletConfig: {
          usePartialWalletManagement: true,
        },
      }}
    />
  );
});

ExchangeLiFiWidget.displayName = "ExchangeLiFiWidget";
export default ExchangeLiFiWidget;
