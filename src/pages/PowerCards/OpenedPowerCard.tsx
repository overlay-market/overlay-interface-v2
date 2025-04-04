import { UnifiedCardData } from "./types";
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
import { Flex, Text } from "@radix-ui/themes";
import theme from "../../theme";
import { GradientSolidButton } from "../../components/Button";
import useAccount from "../../hooks/useAccount";
import { powerCardsABI } from "./PoweCardsABI";
import { useWriteContract, usePublicClient } from "wagmi";
import { useIsNewTxnHashCallback } from "../../state/powercards/hooks";
import { useAddPopup } from "../../state/application/hooks";
import { TransactionType } from "../../constants/transaction";
import { currentTimeParsed } from "../../utils/currentTime";

type OpenedPowerCardProps = {
  card: UnifiedCardData;
  isOwned?: boolean;
};

const OpenedPowerCard: React.FC<OpenedPowerCardProps> = ({ card, isOwned }) => {
  const { address: account } = useAccount();
  const { isPending, writeContract, data: hash, error } = useWriteContract();
  const publicClient = usePublicClient();
  const isNewTxnHashCallback = useIsNewTxnHashCallback();
  const addPopup = useAddPopup();
  const currentTimeForId = currentTimeParsed();

  const handleBurn = async () => {
    if (!account || !card.id) return;

    console.log("🔥 Initiating burn transaction for card:", card.id);
    try {
      writeContract({
        address: card.token?.address as `0x${string}`,
        abi: powerCardsABI,
        functionName: "burn",
        args: [
          account as `0x${string}`,
          BigInt(card.token?.tokenId as string),
          BigInt("1"),
        ],
      });

      console.log("💳 Transaction hash:", hash);
      console.log("error:", error);

      addPopup(
        {
          txn: {
            hash: !hash ? "" : hash,
            success: true,
            message: "Burning power card...",
            type: TransactionType.BURN_POWER_CARD,
          },
        },
        hash
      );

      const receipt = await publicClient?.waitForTransactionReceipt({
        hash,
      });
      console.log(
        "✅ Burn transaction confirmed in block:",
        receipt?.blockNumber
      );

      if (receipt?.blockNumber) {
        console.log("🔄 Updating transaction hash state...");
        await isNewTxnHashCallback(hash, receipt.blockNumber);

        addPopup(
          {
            txn: {
              hash,
              success: true,
              message: "Successfully burned power card",
              type: TransactionType.BURN_POWER_CARD,
            },
          },
          hash
        );
      }
    } catch (error) {
      console.error("❌ Error burning card:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to burn power card";

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
    }
  };

  const handleGetCard = () => {
    const openSeaUrl = `https://testnets.opensea.io/es/assets/arbitrum_sepolia/${card.address}/${card.id}`;
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
    <Flex width={"100%"} justify={"center"}>
      <Container>
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
                <Flex direction={"column"} align={"end"}>
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
    </Flex>
  );
};

export default OpenedPowerCard;
