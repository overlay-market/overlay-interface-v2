import { AlertTriangle, CheckCircle, Clock } from "react-feather";
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

  let title: string | undefined;
  let details: string | undefined;

  if (success === true) {
    switch (type) {
      case TransactionType.APPROVAL:
        title = "Spending Limit Approved";
        break;
      case TransactionType.BUILD_OVL_POSITION:
        title = "Position Successfully Built";
        break;
      case TransactionType.UNWIND_OVL_POSITION:
        title = "Unwind Successful";
        break;
      case TransactionType.LIQUIDATE_OVL_POSITION:
        title = "Liquidation Successful";
        break;
      case TransactionType.BRIDGE_OVL:
        title = "Bridge Successful";
        break;
      case TransactionType.CLAIM_OVL:
        title = "Claim Successful";
        break;
      default:
        title = "Transaction Successful";
    }
  } else if (success === false) {
    switch (type) {
      case 4001:
        title = "Transaction Rejected";
        break;
      default:
        title = "Transaction Failed";
        details = message;
    }
  } else {
    // success === null
    title = "Transaction Pending Confirmation";
    details = message;
  }

  return (
    <Flex style={{ zIndex: 420 }} align={"center"}>
      <Box>
        {success === true && (
          <CheckCircle width={22} height={22} color={theme.color.green1} />
        )}
        {success === false && (
          <AlertTriangle width={22} height={22} color={theme.color.red1} />
        )}
        {success === null && <Clock width={22} height={22} color="#FACC15" />}
      </Box>
      <Flex direction={"column"} align={"start"} mr={"16px"} ml={"12px"}>
        <Text weight="bold">{title}</Text>
        {details && <Text>{details}</Text>}

        {chainId && hash && success && (
          <ExternalLink
            href={getExplorerLink(
              chainId as number,
              hash,
              type === TransactionType.BRIDGE_OVL
                ? ExplorerDataType.BRIDGE
                : ExplorerDataType.TRANSACTION
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
