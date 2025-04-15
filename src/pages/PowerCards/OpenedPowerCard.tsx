import { useNavigate, Navigate } from "react-router-dom";
import {
  Badge,
  Container,
  Details,
  ImgBox,
  InfoBox,
  InfoDetails,
  StatsDetails,
  TextItem,
} from "./opened-power-card-styles";
import { UnifiedCardData } from "./types";
import { Flex, Text } from "@radix-ui/themes";
import theme from "../../theme";
import { GradientSolidButton } from "../../components/Button";
import useAccount from "../../hooks/useAccount";
import { powerCardsABI } from "./PoweCardsABI";
import { useWriteContract } from "wagmi";
import { useAddPopup } from "../../state/application/hooks";
import { TransactionType } from "../../constants/transaction";
import { currentTimeParsed } from "../../utils/currentTime";

interface OpenedPowerCardProps {
  card: UnifiedCardData;
  isOwned: boolean;
}

const OpenedPowerCard = ({ card, isOwned }: OpenedPowerCardProps) => {
  const { address: account } = useAccount();
  const { isPending, writeContract } = useWriteContract();
  const addPopup = useAddPopup();
  const currentTimeForId = currentTimeParsed();
  const navigate = useNavigate();

  if (!card || !card.ipfsData) {
    return <Navigate to="/power-cards" replace />;
  }

  const handleBurn = () => {
    if (!account || !card.id) return;

    console.log("🔥 Initiating burn transaction for card:", card.id);

    writeContract(
      {
        address: card.token?.address as `0x${string}`,
        abi: powerCardsABI,
        functionName: "burn",
        args: [
          account as `0x${string}`,
          BigInt(card.token?.tokenId as string),
          BigInt("1"),
        ],
      },
      {
        onSuccess: (hash) => {
          console.log("💳 Transaction hash:", hash);
          addPopup(
            {
              txn: {
                hash,
                success: true,
                message: "Burning power card...",
                type: TransactionType.BURN_POWER_CARD,
              },
            },
            hash
          );
          navigate("/power-cards", {
            replace: true,
            state: { tab: "owned", refresh: Date.now() },
          });
        },
        onError: (error) => {
          console.error("❌ Error burning card:", error);
          const errorMessage =
            error instanceof Error
              ? error.message
              : "Failed to burn power card";

          addPopup(
            {
              txn: {
                hash: currentTimeForId,
                success: false,
                message: errorMessage,
                type: TransactionType.BURN_POWER_CARD,
              },
            },
            currentTimeForId
          );
        },
      }
    );
  };

  const handleGetCard = () => {
    // Remove 'es' from URL and handle undefined token properties
    const address = card.token?.address || card.address;
    const tokenId = card.token?.tokenId || card.id;
    console.log("Opening OpenSea with:", { address, tokenId });

    const openSeaUrl = `https://testnets.opensea.io/assets/arbitrum-sepolia/${address}/${tokenId}`;
    window.open(openSeaUrl, "_blank");
  };

  const buttonText = isOwned ? "Burn this Power Card" : "Get this Power Card";

  const cardDescription =
    card.ipfsData?.description || "No description available";

  const ipfsImageUrl = `https://blush-select-dog-727.mypinata.cloud/ipfs/${card.ipfsData?.image.replace(
    "ipfs://",
    ""
  )}`;

  return (
    <Container
      style={{
        justifySelf: "center",
        marginTop: "20px",
        paddingBottom: "40px",
      }}
    >
      <ImgBox>
        <img src={ipfsImageUrl} alt={card.name} width={"100%"} />
      </ImgBox>

      <InfoBox>
        <Flex gap={{ initial: "12px", lg: "16px" }} direction={"column"}>
          <Badge>
            <Text
              size={"1"}
              weight={"medium"}
              style={{ color: theme.color.green2 }}
            >
              {card.ipfsData?.attributes[0]?.value}
            </Text>
          </Badge>

          <Text weight={"bold"} style={{ fontSize: "32px" }}>
            {card.ipfsData?.name}
          </Text>

          <Details>
            <StatsDetails>
              <Text weight={"bold"} style={{ color: theme.color.grey3 }}>
                Stats
              </Text>
              <Flex direction={"column"} align={"end"}>
                <TextItem>{card.ipfsData?.attributes[1]?.value}</TextItem>
                <TextItem>{card.ipfsData?.attributes[4]?.value}</TextItem>
              </Flex>
            </StatsDetails>

            <InfoDetails>
              <Text weight={"bold"} style={{ color: theme.color.grey3 }}>
                Info
              </Text>
              <Flex
                direction={"column"}
                align={"end"}
                style={{ textAlign: "right" }}
              >
                <Text>{cardDescription}</Text>
              </Flex>
            </InfoDetails>
          </Details>
        </Flex>

        <GradientSolidButton
          title={buttonText}
          width={"100%"}
          height={"49px"}
          handleClick={isOwned ? handleBurn : handleGetCard}
          isDisabled={isPending}
        />
      </InfoBox>
    </Container>
  );
};

export default OpenedPowerCard;
