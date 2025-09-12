import { Flex, Text } from "@radix-ui/themes";
import { useState } from "react";
import theme from "../../theme";
import Modal from "../../components/Modal";

interface ReferralModalProps {
  tier: string;
}

const ReferralModal = ({ tier }: ReferralModalProps) => {
  const [open, setOpen] = useState(false);

  const handleDismiss = () => setOpen(false);
  const handleOpen = () => setOpen(true);

  return (
    <>
      <Flex direction="row">
        {tier === "ambassador" && (
          <Flex
            direction={{ initial: "column", md: "row" }}
            gap="8px"
            mb={"32px"}
          >
            <Text as="p" size="2">
              Refer users to earn rewards. Ambassadors earn greater rewards.{" "}
            </Text>
            <span
              onClick={handleOpen}
              style={{ color: theme.color.blue2, cursor: "pointer" }}
            >
              How does it work
            </span>
          </Flex>
        )}
        {tier === "affiliate" && (
          <Flex gap="8px">
            Need more info?
            <Flex
              onClick={handleOpen}
              style={{ color: theme.color.blue2, cursor: "pointer" }}
            >
              <Text>Overlay Referral Program -&gt;</Text>
            </Flex>
          </Flex>
        )}
      </Flex>

      <Modal
        triggerElement={null}
        open={open}
        handleClose={handleDismiss}
        title="How Referral Rewards Work"
        fontSizeTitle="20px"
        width="480px"
        minHeight="300px"
      >
        <Flex
          direction="column"
          width="100%"
          style={{ color: theme.color.grey2 }}
        >
          <Text size="3" mt="16px">
            Referrers earn 10% of referred users’ fees, and referred users
            receive a 4% fee discount. Referral earnings will have a cap per
            referred user.
          </Text>
          <Text size="3" mt="12px">
            If you have over $10M volume on Overlay in 30d or have 5000+ social
            media followers, you can apply for the Ambassador Program.
          </Text>

          <Text size="2" mt="12px">
            <a
              style={{
                color: theme.color.blue2,
                cursor: "pointer",
                textDecoration: "none",
              }}
              target="_blank"
              rel="noreferrer"
              href="https://forms.gle/tAJQ7XUN43kp6smP7"
            >
              <Text
                size="2"
                style={{ color: theme.color.blue2, cursor: "pointer" }}
              >
                Apply for the Ambassador program -&gt;
              </Text>
            </a>
          </Text>
        </Flex>
      </Modal>
    </>
  );
};

export default ReferralModal;
