import { Text } from "@radix-ui/themes";
import theme from "../../theme";

export const EnterReferralCodeLink: React.FC<{ onClick: () => void }> = ({
  onClick,
}) => (
  <Text
    size="2"
    style={{
      color: theme.color.blue2,
      cursor: "pointer",
    }}
    onClick={onClick}
  >
    Enter a referral code -&gt;
  </Text>
);
