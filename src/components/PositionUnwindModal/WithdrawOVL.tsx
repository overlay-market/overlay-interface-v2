import { Flex, Text } from "@radix-ui/themes";
import theme from "../../theme";
import { UNIT } from "../../constants/applications";
import { OpenPositionData, UnwindStateError } from "overlay-sdk";
import { GradientLoaderButton, GradientOutlineButton } from "../Button";
import { useState } from "react";
import useSDK from "../../providers/SDKProvider/useSDK";
import { useAddPopup } from "../../state/application/hooks";
import { TransactionType } from "../../constants/transaction";
import { currentTimeParsed } from "../../utils/currentTime";
import { useTradeActionHandlers } from "../../state/trade/hooks";
import { Address } from "viem";
import useAccount from "../../hooks/useAccount";
import { trackEvent } from "../../utils/analytics";

type WithdrawOVLProps = {
  position: OpenPositionData;
  unwindState: UnwindStateError;
  handleDismiss: () => void;
};

const WithdrawOVL: React.FC<WithdrawOVLProps> = ({
  position,
  unwindState,
  handleDismiss,
}) => {
  const sdk = useSDK();
  const { address: account } = useAccount();
  const addPopup = useAddPopup();
  const currentTimeForId = currentTimeParsed();
  const { handleTxnHashUpdate } = useTradeActionHandlers();

  const [attemptingWithdraw, setAttemptingWithdraw] = useState(false);

  const cost = unwindState.cost
    ? Number(unwindState.cost).toString()
    : undefined;

  const handleWithdraw = async () => {
    if (position) {
      setAttemptingWithdraw(true);

      sdk.market
        .emergencyWithdraw({
          account,
          marketAddress: position.marketAddress as Address,
          positionId: BigInt(position.positionId),
          owner: account as Address,
        })
        .then((result) => {
          trackEvent("withdraw_ovl_success", {
            address: account,
            position_id: position.positionId,
            market_name: position.marketName,
            transaction_hash: result.hash,
            timestamp: new Date().toISOString(),
          });

          addPopup(
            {
              txn: {
                hash: result.hash,
                success: result.receipt?.status === "success",
                message: "",
                type: TransactionType.UNWIND_OVL_POSITION,
              },
            },
            result.hash
          );
          handleTxnHashUpdate(result.hash, Number(result.receipt?.blockNumber));
        })
        .catch((error: Error) => {
          const { errorCode, errorMessage } = handleError(error);

          trackEvent("withdraw_ovl_failed", {
            address: account,
            position_id: position.positionId,
            market_name: position.marketName,
            error_message: errorMessage,
            timestamp: new Date().toISOString(),
          });

          addPopup(
            {
              txn: {
                hash: currentTimeForId,
                success: false,
                message: errorMessage,
                type: errorCode,
              },
            },
            currentTimeForId
          );
        })
        .finally(() => {
          setAttemptingWithdraw(false);
          handleDismiss();
        });
    }
  };

  const handleError = (error: Error) => {
    const errorString = JSON.stringify(error);
    const errorObj = JSON.parse(errorString);

    const errorCode: number | string =
      errorObj.cause?.cause?.code || errorObj.code;

    let errorMessage =
      errorObj.cause?.shortMessage || errorObj.cause?.cause?.shortMessage;
    return { errorCode, errorMessage };
  };

  return (
    <>
      <Flex
        mt={"24px"}
        direction={"column"}
        width={"100%"}
        align={"center"}
        gap={"24px"}
      >
        <Text
          style={{
            color: theme.color.blue1,
            fontWeight: "500",
            fontSize: "20px",
          }}
        >
          Withdraw: {cost ?? "-"} {UNIT}
        </Text>
        <Text
          style={{
            textAlign: "center",
          }}
        >
          This market has been shut down.
          <br />
          You may only withdraw any previously deposited OVL.
        </Text>

        {!attemptingWithdraw && (
          <GradientOutlineButton
            title={`Withdraw ${UNIT}`}
            width={"100%"}
            height={"46px"}
            handleClick={handleWithdraw}
          />
        )}

        {attemptingWithdraw && (
          <GradientLoaderButton
            height={"46px"}
            title={"Pending confirmation..."}
          />
        )}
      </Flex>
    </>
  );
};

export default WithdrawOVL;
