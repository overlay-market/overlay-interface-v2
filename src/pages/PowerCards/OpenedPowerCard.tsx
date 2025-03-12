import { CardData } from "./types";
import samuraiJack from "../../assets/images/power-cards/samuraijack.png";
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

type OpenedPowerCardProps = {
  card: CardData;
  isOwned?: boolean;
};

const OpenedPowerCard: React.FC<OpenedPowerCardProps> = ({ card, isOwned }) => {
  const buttonText = isOwned ? "Burn this Power Card" : "Get this Power Card";

  return (
    <Flex width={"100%"} justify={"center"}>
      <Container>
        <ImgBox>
          <img src={samuraiJack} alt={card.name} width={"100%"} />
        </ImgBox>

        <InfoBox>
          <Flex gap={{ initial: "12px", lg: "16px" }} direction={"column"}>
            <Badge>
              <Text
                size={"1"}
                weight={"medium"}
                style={{ color: theme.color.green2 }}
              >
                PowerCard
              </Text>
            </Badge>

            <Text weight={"bold"} style={{ fontSize: "32px" }}>
              {card.name}
            </Text>

            <Details>
              <StatsDetails>
                <Text weight={"bold"} style={{ color: theme.color.grey3 }}>
                  Stats
                </Text>
                <Flex direction={"column"} align={"end"}>
                  <TextItem>{card.rarity}</TextItem>
                  <TextItem>{card.duration}</TextItem>
                </Flex>
              </StatsDetails>

              <InfoDetails>
                <Text weight={"bold"} style={{ color: theme.color.grey3 }}>
                  Info
                </Text>
                <Flex direction={"column"} align={"end"}>
                  <TextItem>Step 1: Get this card</TextItem>
                  <TextItem>Step 2: Burn this card</TextItem>
                  <TextItem>Step 3: Trade for 24 hours</TextItem>
                  <TextItem>
                    Step 4: OV sent to you at the end of each month
                  </TextItem>
                </Flex>
              </InfoDetails>
            </Details>
          </Flex>

          <GradientSolidButton
            title={buttonText}
            width={"100%"}
            height={"49px"}
            handleClick={() => console.log(buttonText)}
          />
        </InfoBox>
      </Container>
    </Flex>
  );
};

export default OpenedPowerCard;
