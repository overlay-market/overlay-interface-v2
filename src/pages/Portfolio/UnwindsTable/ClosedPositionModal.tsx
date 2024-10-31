import { Flex, Text } from "@radix-ui/themes";
import Modal from "../../../components/Modal";
import theme from "../../../theme";
import { UnwindPositionData } from "../../../types/positionTypes";
import DetailRow from "../../../components/Modal/DetailRow";

type ClosedPositionModalProps = {
  open: boolean;
  position: UnwindPositionData;
  handleDismiss: () => void;
};

const ClosedPositionModal: React.FC<ClosedPositionModalProps> = ({
  open,
  position,
  handleDismiss,
}) => {
  const positionSide = position.positionSide
    ? position.positionSide.split(" ")[1]
    : undefined;
  const isLong = positionSide === "Long";
  const isPnLPositive = Number(position.pnl) > 0;

  return (
    <Modal triggerElement={null} open={open} handleClose={handleDismiss}>
      <Flex mt={"24px"} direction={"column"} width={"100%"} align={"center"}>
        <Text
          style={{
            color: theme.color.blue1,
            fontWeight: "700",
            fontSize: "20px",
          }}
        >
          ID: 3528 - UNWIND: #0
        </Text>
        <Text
          style={{
            color: theme.color.blue1,
            fontWeight: "500",
            fontSize: "20px",
            textAlign: "center",
          }}
        >
          {position?.marketName}
        </Text>
      </Flex>

      <Flex mt={"48px"} direction={"column"} width={"100%"}>
        <DetailRow
          detail={"Profit/Loss"}
          value={`${position.pnl} OVL`}
          valueColor={isPnLPositive ? theme.color.green1 : theme.color.red1}
        />
        <DetailRow
          detail={"Side"}
          valueColor={isLong ? theme.color.green1 : theme.color.red1}
          value={isLong ? "Long" : "Short"}
        />
      </Flex>

      <Flex direction={"column"} width={"100%"} mt={"48px"} mb={"24px"}>
        <DetailRow detail={"Entry Price"} value={position.entryPrice} />
        <DetailRow detail={"Exit Price"} value={position.exitPrice} />
      </Flex>
    </Modal>
  );
};

export default ClosedPositionModal;
