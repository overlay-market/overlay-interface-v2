import {CardDetailsData} from '../../home_config/types'
import {BaseCard} from './Card_'
import CardInfo2 from './CardInfo2'

type CardProps = {
  card: CardDetailsData
}

export const enum CardStyle {
  market1 = 'market1',
  market2 = 'market2',
  info1 = 'info1',
  info2 = 'info2',
  chartHourly = 'chartHourly',
  chartMonthly = 'chartMonthly',
}

type CardsStyles = {
  // market1: JSX.Element
  // market1FullWidth: JSX.Element
  // market2: JSX.Element
  // market2FullWidth: JSX.Element
  // info1: JSX.Element
  // info1FullWidth: JSX.Element
  info2: JSX.Element
  // info2FullWidth: JSX.Element
  // chartHourly: JSX.Element
  // chartMonthly: JSX.Element
}

export const Card = ({card}: CardProps) => {
  const CARDS_STYLES: CardsStyles = {
    // market1: <CardInfo2 card={card} />,
    // market1FullWidth: <CardMarket1FullWidth card={card} />,
    // market2: <CardMarket2 card={card} />,
    // market2FullWidth: <CardMarket2FullWidth card={card} />,
    // info1: <CardInfo1 card={card} />,
    // info1FullWidth: <CardInfo1FullWidth card={card} />,
    info2: <CardInfo2 card={card} />,
    // info2FullWidth: <CardInfo2FullWidth card={card} />,
    // chartHourly: <CardInfoTextRight card={card} />,
    // chartMonthly: <CardInfoTextRight card={card} />,
  }
  const key = card.cardSize === 12 ? `${card.cardStyle}FullWidth` : `${card.cardStyle}`

  return <BaseCard>{CARDS_STYLES[key as keyof CardsStyles]}</BaseCard>
}
