import { Flex, Text, Checkbox, DropdownMenu, IconButton } from "@radix-ui/themes";
import { GearIcon } from "@radix-ui/react-icons";
import theme from "../../theme";
import { useUnwindPreference, useTradeActionHandlers } from "../../state/trade/hooks";
import useAccount from "../../hooks/useAccount";
import { useAvatarTrading, useZodiacRoles } from "../../hooks/useZodiacRoles";
import { CopyIcon, CheckIcon, ExternalLinkIcon } from "@radix-ui/react-icons";
import { useState } from "react";
import { getExplorerLink, ExplorerDataType } from "../../utils/getExplorerLink";
import { SUPPORTED_CHAINID } from "../../constants/chains";

const SettingsDropdown: React.FC = () => {
  const { address: account, signerAddress, chainId } = useAccount();
  const unwindPreference = useUnwindPreference();
  const { handleUnwindPreferenceChange } = useTradeActionHandlers();
  const { isAvatarTradingActive, setStatus, activeAvatar, setActiveAvatar } = useAvatarTrading();
  const { data: rolesData } = useZodiacRoles(signerAddress);
  const [copied, setCopied] = useState(false);

  const memberships = rolesData?.memberOf.filter(m => Number(m.chainId) === Number(chainId)) || [];
  const hasMemberships = memberships.length > 0;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!account) return null;

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <IconButton
          variant="ghost"
          style={{
            cursor: "pointer",
            color: theme.color.grey1,
          }}
        >
          <GearIcon width="20" height="20" />
        </IconButton>
      </DropdownMenu.Trigger>

      <DropdownMenu.Content
        style={{
          backgroundColor: theme.color.background,
          border: `1px solid ${theme.color.darkBlue}`,
          borderRadius: "8px",
          padding: "8px",
          minWidth: "280px",
        }}
      >
        <Flex direction="column" gap="8px" p="4px">
          <Text size="2" weight="medium" style={{ color: theme.color.grey1 }}>
            Unwind Settings
          </Text>
          <label
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: "8px",
              cursor: "pointer",
              padding: "4px",
            }}
          >
            <Checkbox
              checked={unwindPreference === "stable"}
              onCheckedChange={(checked) =>
                handleUnwindPreferenceChange(checked ? "stable" : "normal")
              }
              style={{ marginTop: "2px" }}
            />
            <Flex direction="column" gap="4px">
              <Text size="2" style={{ color: theme.color.grey1 }}>
                Convert profits to USDT when unwinding
              </Text>
              <Text size="1" style={{ color: theme.color.grey3 }}>
                Uses 1inch to swap OVL profits to USDT
              </Text>
            </Flex>
          </label>

          {(hasMemberships || isAvatarTradingActive) && (
            <>
              <div style={{ height: '1px', backgroundColor: theme.color.darkBlue, margin: '8px 0' }} />
              <Text size="2" weight="medium" style={{ color: theme.color.grey1 }}>
                Safe Trading (Zodiac Roles)
              </Text>
              <label
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "8px",
                  cursor: "pointer",
                  padding: "4px",
                }}
              >
                <Checkbox
                  checked={isAvatarTradingActive}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setStatus('active');
                      if (!activeAvatar && hasMemberships) {
                        setActiveAvatar(memberships[0].rolesModifier);
                      }
                    } else {
                      setStatus('inactive');
                    }
                  }}
                  style={{ marginTop: "2px" }}
                />
                <Flex direction="column" gap="4px" width="100%">
                  <Text size="2" style={{ color: theme.color.grey1 }}>
                    Trade on behalf of Safe
                  </Text>
                  {isAvatarTradingActive && activeAvatar && (
                    <Flex direction="column" gap="4px" style={{ backgroundColor: theme.color.grey9, padding: '8px', borderRadius: '4px', marginTop: '4px' }}>
                      <Flex align="center" justify="between" gap="8px">
                        <Text size="1" style={{ color: theme.color.grey3 }}>Avatar (Safe):</Text>
                        <Flex gap="8px">
                          <IconButton size="1" variant="ghost" onClick={() => handleCopy(activeAvatar.avatar)}>
                            {copied ? <CheckIcon color={theme.color.green2} /> : <CopyIcon color={theme.color.grey3} />}
                          </IconButton>
                          <a
                            href={getExplorerLink(Number(chainId) || SUPPORTED_CHAINID.BSC_MAINNET, activeAvatar.avatar, ExplorerDataType.ADDRESS)}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <ExternalLinkIcon color={theme.color.grey3} width="14" height="14" />
                          </a>
                        </Flex>
                      </Flex>
                      <Text size="1" style={{ color: theme.color.white, wordBreak: 'break-all' }}>
                        {activeAvatar.avatar}
                      </Text>
                    </Flex>
                  )}
                </Flex>
              </label>
            </>
          )}
        </Flex>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
};

export default SettingsDropdown;
