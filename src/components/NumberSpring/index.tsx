import { Flex } from "@radix-ui/themes";
import { useSpring, animated } from "react-spring";

type NumberSpringProps = {
  inputValue: number;
  text?: string;
};

const NumberSpring: React.FC<NumberSpringProps> = ({ inputValue, text }) => {
  const props = useSpring({
    from: { value: 0 },
    value: inputValue,
  });

  return (
    <Flex gap={"4px"}>
      <animated.div>{props.value.to((x: number) => x.toFixed(4))}</animated.div>
      {text}
    </Flex>
  );
};

export default NumberSpring;
