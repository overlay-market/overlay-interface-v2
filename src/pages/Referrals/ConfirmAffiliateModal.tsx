import { useReferralAccountData } from "../../hooks/referrals/useReferralAccountData";
import useAccount from "../../hooks/useAccount";
import { UNIT } from "../../constants/applications";
import { Flex, Text } from "@radix-ui/themes";
import Modal from "../../components/Modal";
import theme from "../../theme";
import DetailRow from "../../components/Modal/DetailRow";
import { formatBigNumber } from "../../utils/formatBigNumber";
import { GradientSolidButton } from "../../components/Button";

type ConfirmAffiliateModalProps = {
  open: boolean;
  handleDismiss?: () => void;
};

const ConfirmAffiliateModal = ({
  open,
  handleDismiss,
}: ConfirmAffiliateModalProps) => {
  const { address: account } = useAccount();
  const { referralAccountData } = useReferralAccountData(account);
  // const [signature, setSignature] = useState("");
  // const url = `${REWARDS_API}/signatures/${account?.toLowerCase()}`;

  // const { callback: referralCodeCallback } =
  //   useReferralCreateAffiliateCallback(signature);

  const referralPositionsChecker =
    (referralAccountData?.account?.referralPositions?.length ?? 0) > 0;

  // useEffect(() => {
  //   if (!account) return;
  //   fetch(url)
  //     .then((res) => res.json())
  //     .then((data) => setSignature(data.signature ?? ""))
  //     .catch((err) => console.error("Error fetching signature:", err));
  // }, [url, account]);

  const handleCreateAffiliate = () => {
    // referralCodeCallback && referralCodeCallback();
  };

  return (
    <Modal
      triggerElement={null}
      open={open}
      handleClose={handleDismiss}
      title="Confirm Transaction"
      fontSizeTitle="14px"
      width="310px"
      minHeight="300px"
    >
      <Flex direction="column" width="100%">
        <Text mt="21px" style={{ color: theme.color.grey3, fontSize: "14px" }}>
          Affiliate Program
        </Text>

        <Text
          mt="4px"
          style={{
            color: theme.color.grey2,
            fontSize: "18px",
            fontWeight: 700,
          }}
        >
          Confirm Transaction to become an Affiliate
        </Text>

        <Flex mt={"21px"} direction={"column"} width={"100%"}>
          <DetailRow
            detail={"Rewards"}
            value={`${
              formatBigNumber(
                referralPositionsChecker
                  ? referralAccountData?.account?.referralPositions[0]
                      .totalRewardsPending
                  : 0,
                18,
                0
              ) ?? 0
            }%`}
          />
          <DetailRow
            detail={"Discount on trading fees"}
            valueColor={theme.color.green1}
            value={`${
              formatBigNumber(
                referralPositionsChecker
                  ? referralAccountData?.account?.referralPositions[0]
                      .totalTraderDiscount
                  : 0,
                18,
                0
              ) ?? 0
            }%`}
          />
          <DetailRow detail={"Cap per user"} value={`??? ${UNIT}`} />
        </Flex>

        <Text my="21px" style={{ color: theme.color.grey3, fontSize: "14px" }}>
          You will need to sign transaction to become an affiliate.
        </Text>

        <GradientSolidButton
          title={"Create code"}
          width={"100%"}
          height={"46px"}
          handleClick={handleCreateAffiliate}
        />
      </Flex>
    </Modal>
  );
};

export default ConfirmAffiliateModal;
