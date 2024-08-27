export const enum CardSize {
  small = 3,
  middle = 4,
  large = 6,
  fullWidth = 12
}

export const enum CardStyle {
  market1 = 'market1',
  market2 = 'market2',
  info1 = 'info1',
  info2 = 'info2',
  chartHourly = 'chartHourly',
  chartMonthly = 'chartMonthly',
}

export type CardDetailsData = {
  cardSize: CardSize
  cardStyle: CardStyle
  title: string
  subTitle?: string
  description?: string
  img?: string
  link?: string
  linkLabel?: string
  price?: string
  funding7h?: string
  funding24h?: string 
  imgLeft?: string
  imgRight?: string

}