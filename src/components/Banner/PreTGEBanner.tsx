import { Box, Button, Flex, Text } from "@radix-ui/themes";
import { useEffect, useState } from "react";
import { ArrowRightIcon } from "../../assets/icons/ArrowRight";

const TGE_DATE = new Date("2025-08-14T00:00:00Z");

const PreTGEBanner: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = +TGE_DATE - +new Date();

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <Box
      ml={{ sm: "16px", xs: "0" }}
      width={{ sm: "calc(100% - 16px)", xs: "100%" }}
      style={{
        background: 'url("/src/assets/images/bnc_pre_TGE.png")',
        backgroundSize: "cover",
        padding: "2rem",
        marginTop: "1rem",
        borderRadius: "12px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Button
        size="1"
        style={{
          position: "absolute",
          top: "12px",
          right: "12px",
          minWidth: "unset",
          width: "24px",
          height: "24px",
          padding: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "rgba(255, 255, 255, 0.2)",
          color: "white",
          borderRadius: "50%",
          cursor: "pointer",
          border: "none",
          zIndex: 10,
        }}
        onClick={() => setIsVisible(false)}
      >
        ✕
      </Button>
      <Flex direction="column" align="center" gap="4">
        <Flex
          direction={{ initial: "column", sm: "row" }}
          align="center"
          gap={{ initial: "2", sm: "4" }}
        >
          <Flex align="center">
            <img
              src="/src/assets/images/overlay-full-logo.png"
              alt="Overlay"
              style={{
                height: "60px",
                maxWidth: "100%",
                objectFit: "contain",
              }}
            />
          </Flex>
          <Text size="6" style={{ color: "white" }}>
            x
          </Text>
          <Flex align="center">
            <img
              src="/src/assets/images/bsc-mainnet-logo.png"
              alt="Binance Alpha"
              style={{
                height: "60px",
                maxWidth: "100%",
                objectFit: "contain",
              }}
            />
          </Flex>
        </Flex>

        <Flex gap="2" align="center" style={{ margin: "1rem 0" }}>
          <CountdownBox value={timeLeft.days} label="DAYS" />
          <Text size="6" style={{ color: "white", margin: "0 0.5rem" }}>
            :
          </Text>
          <CountdownBox value={timeLeft.hours} label="HRS" />
          <Text size="6" style={{ color: "white", margin: "0 0.5rem" }}>
            :
          </Text>
          <CountdownBox value={timeLeft.minutes} label="MINS" />
          <Text size="6" style={{ color: "white", margin: "0 0.5rem" }}>
            :
          </Text>
          <CountdownBox value={timeLeft.seconds} label="SECS" />
        </Flex>

        <Button
          size="3"
          style={{
            background: "#F0B90B",
            color: "black",
            padding: "0 2rem",
            cursor: "pointer",
            borderRadius: "25px",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
          onClick={() => window.open("https://x.com/overlayprotocol", "_blank")}
        >
          LEARN MORE <ArrowRightIcon />
        </Button>
      </Flex>
    </Box>
  );
};

const CountdownBox: React.FC<{ value: number; label: string }> = ({
  value,
  label,
}) => (
  <Flex
    direction="column"
    align="center"
    style={{
      background: "rgba(0, 0, 0, 0.7)",
      padding: "0.5rem",
      borderRadius: "4px",
      minWidth: "60px",
      border: "1px solid rgba(255, 255, 255, 0.2)",
    }}
  >
    <Text
      size="6"
      weight="bold"
      style={{
        color: "white",
        fontFamily: "monospace",
        fontSize: "2rem",
      }}
    >
      {value.toString().padStart(2, "0")}
    </Text>
    <Text size="1" style={{ color: "rgba(255, 255, 255, 0.7)" }}>
      {label}
    </Text>
  </Flex>
);
export default PreTGEBanner;
