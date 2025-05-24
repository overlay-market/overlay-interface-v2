import { AlertTriangle, CheckCircle } from "react-feather";
import { ExternalLink as ExternalLinkIcon } from "react-feather";
import { Box, Flex, Text } from "@radix-ui/themes";
import useMultichainContext from "../../providers/MultichainContextProvider/useMultichainContext";
import { ExplorerDataType, getExplorerLink } from "../../utils/getExplorerLink";
import { ExternalLink } from "../ExternalLink";
import theme from "../../theme";
import { PopupContent } from "../../state/application/actions";
import { TransactionType } from "../../constants/transaction";

type TxnPopupContent = Extract<PopupContent, { txn: any }>;

type TxnPopupProps = {
  content: TxnPopupContent;
};

const TransactionPopup: React.FC<TxnPopupProps> = ({ content }) => {
  const { chainId } = useMultichainContext();
  const {
    txn: { hash, success, message, type },
  } = content;

  let errorMessage: string | undefined;
  let errorDetails: string | undefined;

  if (!success) {
    switch (type) {
      case 4001:
        errorMessage = "Transaction Rejected";
        break;
      default:
        errorMessage = "Transaction Failed";
        errorDetails = message;
    }
  }

  return (
    <Flex style={{ zIndex: 420 }} align={"center"}>
      <Box>
        {success ? (
          <CheckCircle width={22} height={22} color={theme.color.green1} />
        ) : (
          <AlertTriangle width={22} height={22} color={theme.color.red1} />
        )}
      </Box>
      <Flex direction={"column"} align={"start"} mr={"16px"} ml={"12px"}>
        <Text weight={"bold"}>
          {type === TransactionType.APPROVAL && "Spending Limit Approved"}
          {type === TransactionType.BUILD_OVL_POSITION &&
            "Position Successfully Built"}
          {type === TransactionType.UNWIND_OVL_POSITION && "Unwind Successful"}
          {type === TransactionType.LIQUIDATE_OVL_POSITION &&
            "Liquidation Successful"}
          {type === TransactionType.BRIDGE_OVL && "Bridge Successful"}
          {type === TransactionType.CLAIM_OVL && "Claim Successful"}

          {errorMessage}
        </Text>

        {errorDetails && <Text>{errorDetails}</Text>}

        {chainId && hash && success && (
          <ExternalLink
            href={getExplorerLink(
              chainId as number,
              hash,
              ExplorerDataType.TRANSACTION
            )}
          >
            <Flex mt={"4px"}>
              <Text weight={"regular"}>View on explorer</Text>
              <Box mx={"3px"}>
                <ExternalLinkIcon width={13} height={13} />
              </Box>
            </Flex>
          </ExternalLink>
        )}
      </Flex>
    </Flex>
  );
};

export default TransactionPopup;
