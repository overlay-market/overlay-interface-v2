import {CardDetailsData} from '../../home_config/types'
import {CardTextContent, CardLinkLabel, CardLink, SubTitle, Title, Description, ImgContainer} from './CardInfo2_'
import {CardMedia, Stack} from '@mui/material'
import RightwardsArrow from '../../assets/svg_icons/RightwardsArrow'

type CardProps = {
  card: CardDetailsData
}

const CardInfo2 = ({card}: CardProps) => {
  return (
    <>
      <CardTextContent cardSize={card.cardSize}>
        <Stack spacing={card.cardSize === 3 ? 1 : card.cardSize === 4 ? 1.5 : 2} alignItems={'flex-end'}>
          <SubTitle cardSize={card.cardSize}>{card.subTitle}</SubTitle>
          <Title cardSize={card.cardSize}>{card.title}</Title>
          <Description cardSize={card.cardSize}>{card.description}</Description>
          <CardLink cardSize={card.cardSize}>
            <CardLinkLabel>{card.linkLabel ?? `More`}</CardLinkLabel>
            <RightwardsArrow />
          </CardLink>
        </Stack>
      </CardTextContent>
      <ImgContainer cardSize={card.cardSize}>
        <CardMedia component="img" image={card.img} width="100%" height="100%" alt="image" />
      </ImgContainer>
    </>
  )
}

export default CardInfo2
