import { Flex, Text } from "@radix-ui/themes";
import theme from "../../theme";
import Loader from "../Loader";

type AdditionalDetailRowProps = {
  detail: string;
  value?: string | number;
  detailColor?: string;
  valueColor?: string;
  valueSize?: string;
};

const DetailRow: React.FC<AdditionalDetailRowProps> = ({
  detail,
  value,
  detailColor = `${theme.color.grey3}`,
  valueColor = `${theme.color.blue1}`,
  valueSize,
}) => {
  return (
    <Flex justify={"between"} align={"center"}>
      <Text size={"3"} style={{ color: detailColor }}>
        {detail}
      </Text>

      <Text
        size={"3"}
        style={{
          color: valueColor,
          fontWeight: "600",
          fontSize: valueSize,
          textAlign: "end",
        }}
      >
        {value === undefined ? <Loader stroke="white" size="12px" /> : value}
      </Text>
    </Flex>
  );
};

export default DetailRow;
