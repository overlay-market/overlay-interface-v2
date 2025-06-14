import { useCallback, useEffect } from "react";
import { AlertTriangle, X as XIcon } from "react-feather";
import { useSpring } from "react-spring";
import { PopupContent } from "../../state/application/actions";
import { useRemovePopup } from "../../state/application/hooks";
import { AnimatedFader, PopupContainer } from "./popup-styles";
import { Box, Flex } from "@radix-ui/themes";
import TransactionPopup from "./TransactionPopup";
import theme from "../../theme";

type PopupProps = {
  removeAfterMs: number | null;
  content: PopupContent;
  popKey: string;
};

const Popup: React.FC<PopupProps> = ({ removeAfterMs, content, popKey }) => {
  const removePopup = useRemovePopup();

  const removeThisPopup = useCallback(() => {
    removePopup(popKey);
  }, [popKey, removePopup]);

  useEffect(() => {
    if (removeAfterMs === null) return undefined;

    const timeout = setTimeout(() => {
      removeThisPopup();
    }, removeAfterMs);

    return () => {
      clearTimeout(timeout);
    };
  }, [removeAfterMs, removeThisPopup]);

  let popupContent;

  if ("txn" in content) {
    popupContent = <TransactionPopup content={content} />;
  } else {
    popupContent = (
      <Flex gap={"10px"}>
        <Box>
          <AlertTriangle width={22} height={22} color={theme.color.red1} />
        </Box>
        {content.message}
      </Flex>
    );
  }

  const faderStyle = useSpring({
    from: { width: "100%" },
    to: { width: "0%" },
    config: { duration: removeAfterMs ?? undefined },
  });

  return (
    <PopupContainer>
      <Flex align={"center"} justify={"between"}>
        {popupContent}

        <XIcon
          width={"26px"}
          height={"26px"}
          color={theme.color.background}
          style={{ cursor: "pointer", minWidth: "26px" }}
          onClick={removeThisPopup}
        />
      </Flex>
      {removeAfterMs !== null ? <AnimatedFader style={faderStyle} /> : null}
    </PopupContainer>
  );
};

export default Popup;
