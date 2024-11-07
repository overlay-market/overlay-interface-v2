import { Flex, Text } from "@radix-ui/themes";
import theme from "../../theme";
import { OpenPositionData } from "../../types/positionTypes";
import { ErrorUnwindStateData } from "../../types/tradeStateTypes";
import { formatPriceByCurrency } from "../../utils/formatPriceByCurrency";
import { UNIT } from "../../constants/applications";

type WithdrawOVLProps = {
  position: OpenPositionData;
  unwindState: ErrorUnwindStateData;
};

const WithdrawOVL: React.FC<WithdrawOVLProps> = ({ position, unwindState }) => {
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
            fontWeight: "700",
            fontSize: "20px",
          }}
        >
          Withdraw:{" "}
          {formatPriceByCurrency(
            unwindState.cost as string,
            position.priceCurrency
          )}{" "}
          {UNIT}
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
      </Flex>
    </>
  );
};

export default WithdrawOVL;