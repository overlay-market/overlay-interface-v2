import { Box, Flex, Text } from "@radix-ui/themes";
import * as Tooltip from "@radix-ui/react-tooltip";
import theme from "../../theme";
import { useState } from "react";
import { InfoIcon, Toast } from "./overview-card-styles";

type OverviewCardProps = {
  title: string;
  value?: string | number | null;
  valueType: string | null;
  percentageChange?: number | null;
  period?: string;
  isOver1000OpenPositions?: boolean;
  valueTypeLink?: boolean;
  button?: () => void;
  buttonText?: string;
  showModal?: (showModalTrigger: boolean) => void;
  infoTooltip?: {
    title: string;
    description?: string;
  };
  buttonTooltip?: string;
  hasClaimableReward?: boolean;
};

const OverviewCard: React.FC<OverviewCardProps> = ({
  title,
  value,
  valueType,
  percentageChange,
  period,
  isOver1000OpenPositions,
  valueTypeLink,
  button,
  buttonText,
  showModal,
  infoTooltip,
  buttonTooltip,
  hasClaimableReward,
}) => {
  const [toastVisible, setToastVisible] = useState(false);

  const showToast = (duration = 3000) => {
    setToastVisible(true);
    setTimeout(() => {
      setToastVisible(false);
    }, duration);
  };

  const copyText = () => {
    if (navigator.clipboard && value) {
      navigator.clipboard.writeText(value.toString()).then(() => {
        showToast();
      });
    }
  };

  return (
    <Flex
      direction="column"
      justify="between"
      py="20px"
      px="24px"
      style={{
        backgroundColor: theme.color.grey4,
        borderRadius: "8px",
        width: "100%",
        overflow: "hidden",
      }}
    >
      {/* Title with optional tooltip */}
      <Flex align="center" gap="1">
        <Text size="2" style={{ color: theme.color.grey3 }}>
          {title}
        </Text>

        {infoTooltip && (
          <Tooltip.Provider delayDuration={200}>
            <Tooltip.Root>
              <Tooltip.Trigger asChild>
                <InfoIcon size={14} />
              </Tooltip.Trigger>
              <Tooltip.Portal>
                <Tooltip.Content
                  side="top"
                  sideOffset={6}
                  style={{
                    backgroundColor: theme.color.grey9,
                    border: `1px solid ${theme.color.darkBlue}`,
                    padding: "10px 14px",
                    borderRadius: "6px",
                    maxWidth: "260px",
                    boxShadow: "0px 6px 12px rgba(0,0,0,0.25)",
                    zIndex: 50,
                  }}
                >
                  <Text
                    style={{
                      display: "block",
                      marginBottom: "6px",
                      fontSize: "12px",
                      fontWeight: 600,
                    }}
                  >
                    {infoTooltip.title}
                  </Text>
                  <Text
                    style={{
                      display: "block",
                      fontSize: "12px",
                      fontWeight: 400,
                    }}
                  >
                    {infoTooltip.description}
                  </Text>
                  <Tooltip.Arrow
                    offset={5}
                    width={8}
                    height={4}
                    style={{ fill: theme.color.grey5 }}
                  />
                </Tooltip.Content>
              </Tooltip.Portal>
            </Tooltip.Root>
          </Tooltip.Provider>
        )}
      </Flex>

      {isOver1000OpenPositions && (
        <Flex direction="column" mt="4px">
          <Text style={{ fontSize: "10px", color: theme.color.red1 }}>
            Open Positions {">"} 1000
          </Text>
          <Text style={{ fontSize: "10px", color: theme.color.red1 }}>
            May output wrong value
          </Text>
        </Flex>
      )}

      {/* Value */}
      <Box py="12px">
        {value === null || value === undefined ? (
          <Text size="2" style={{ color: theme.color.grey3 }}>
            No data
          </Text>
        ) : (
          <Text
            size="3"
            weight="bold"
            style={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {value}
          </Text>
        )}
      </Box>

      {/* Footer row */}
      <Flex align="center">
        {/* Value Type */}
        {!valueType ? (
          <Box mt="18px" />
        ) : (
          <Text size="2" style={{ color: theme.color.grey2 }}>
            {valueTypeLink ? (
              <a
                onClick={
                  valueType === "Copy link ->"
                    ? () => copyText()
                    : () => showModal && showModal(true)
                }
                style={{
                  color: theme.color.blue2,
                  cursor: "pointer",
                }}
              >
                {valueType}
              </a>
            ) : (
              <span>{valueType}</span>
            )}
          </Text>
        )}
        <Toast visible={toastVisible.toString()}>
          Link copied to clipboard
        </Toast>

        {/* Right side actions */}
        <Flex align="center" ml="auto" gap="2">
          {/* Percentage Change */}
          {value && !!percentageChange && (
            <Box
              px="6px"
              py="2px"
              style={{
                borderRadius: "5px",
                backgroundColor:
                  percentageChange > 0
                    ? "rgba(95, 208, 171, 0.20)"
                    : "rgba(255, 100, 138, 0.20)",
              }}
            >
              <Text
                size="2"
                style={{
                  color: percentageChange > 0 ? "#5FD0AB" : "#FF648A",
                }}
              >
                {percentageChange > 0 && "+"}
                {percentageChange}%
              </Text>
            </Box>
          )}

          {value && !!percentageChange && !button && period && (
            <Text size="1" style={{ color: theme.color.grey3 }}>
              {period}
            </Text>
          )}

          {/* Button with Radix Tooltip */}
          {buttonText && (
            <Tooltip.Provider delayDuration={200}>
              <Tooltip.Root>
                <Tooltip.Trigger asChild>
                  <Box
                    ml="1"
                    onClick={hasClaimableReward ? button : undefined}
                    style={{
                      color: hasClaimableReward
                        ? theme.color.blue2
                        : theme.color.grey3,
                      cursor: hasClaimableReward ? "pointer" : "default",
                      fontSize: "12px",
                      fontWeight: 400,
                    }}
                  >
                    {buttonText}
                  </Box>
                </Tooltip.Trigger>
                <Tooltip.Portal>
                  <Tooltip.Content
                    side="top"
                    sideOffset={6}
                    style={{
                      backgroundColor: theme.color.grey4,
                      color: theme.color.green2,
                      padding: "4px 8px",
                      borderRadius: "4px",
                      fontSize: "12px",
                      boxShadow: "0px 4px 10px rgba(0,0,0,0.15)",
                      zIndex: 50,
                    }}
                  >
                    {buttonTooltip || ""}
                    <Tooltip.Arrow
                      offset={5}
                      width={8}
                      height={4}
                      style={{ fill: theme.color.grey4 }}
                    />
                  </Tooltip.Content>
                </Tooltip.Portal>
              </Tooltip.Root>
            </Tooltip.Provider>
          )}
        </Flex>
      </Flex>
    </Flex>
  );
};

export default OverviewCard;
