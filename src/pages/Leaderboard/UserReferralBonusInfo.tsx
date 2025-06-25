import { DropdownMenu, Flex, Text } from "@radix-ui/themes";
import theme from "../../theme";
import { useState } from "react";
import { useMediaQuery } from "../../hooks/useMediaQuery";

type UserReferralBonusInfoProps = {
  userBonusInfo:
    | {
        affiliateBonus: number;
        referralBonus: number;
        walletBoostBonus: number;
      }
    | undefined;
};

const UserReferralBonusInfo: React.FC<UserReferralBonusInfoProps> = ({
  userBonusInfo,
}) => {
  const isMobile = useMediaQuery("(max-width: 450px)");
  const [detailsOpen, setDetailsOpen] = useState<boolean>(false);

  return (
    <Flex>
      <DropdownMenu.Root open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DropdownMenu.Trigger>
          <button
            style={{
              background: "none",
              border: "none",
              outline: "none",
              padding: 0,
              fontSize: "14px",
              fontWeight: 500,
              color: theme.color.grey8,
              cursor: "pointer",
              textAlign: "right",
            }}
          >
            {detailsOpen
              ? isMobile
                ? "▲"
                : "Bonus Info ▲"
              : isMobile
              ? "▼"
              : "Bonus Info ▼"}
          </button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content
          style={{
            background: theme.color.background,
            padding: "10px",
          }}
        >
          <DropdownMenu.Item
            style={{
              background: "transparent",
            }}
          >
            <Flex width={"100%"} justify={"between"} gap={"20px"}>
              <Text>Affiliate bonus</Text>
              <Text>{userBonusInfo?.affiliateBonus}</Text>
            </Flex>
          </DropdownMenu.Item>
          <DropdownMenu.Item
            style={{
              background: "transparent",
            }}
          >
            <Flex width={"100%"} justify={"between"} gap={"20px"}>
              <Text>Referral bonus</Text>
              <Text>{userBonusInfo?.referralBonus}</Text>
            </Flex>
          </DropdownMenu.Item>
          <DropdownMenu.Item
            style={{
              background: "transparent",
            }}
          >
            <Flex width={"100%"} justify={"between"} gap={"20px"}>
              <Text>Wallet boost bonus</Text>
              <Text>{userBonusInfo?.walletBoostBonus}</Text>
            </Flex>
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </Flex>
  );
};

export default UserReferralBonusInfo;
