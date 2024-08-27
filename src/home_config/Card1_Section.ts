import {CardSize, CardStyle, CardDetailsData} from './types'
import Img1 from '../assets/images/cardsImg/1.png'
import Img2 from '../assets/images/cardsImg/2.png'
import Img3 from '../assets/images/cardsImg/3.png'
import Img4 from '../assets/images/cardsImg/4.png'

// put sections in the right order

export const CARD1_SECTION_LIST: {[id: string]: CardDetailsData} = {
  '1': {
    cardSize: CardSize.small,
    cardStyle: CardStyle.info2,
    title: 'Leaderboard rush!',
    subTitle: 'Subheading',
    description: 'TL;DR -- The market cap of the top 5000 most commonly traded Counter Strike skins.',
    link: 'https://app.overlay.market/#/markets',
    linkLabel: 'More',
    img: Img1,
  },
  '2': {
    cardSize: CardSize.middle,
    cardStyle: CardStyle.info2,
    title: 'This is Leaderboard rush!',
    subTitle: 'Subheading',
    description: 'TL;DR -- The market cap of the top 5000 most commonly traded Counter Strike skins.',
    link: 'https://app.overlay.market/#/markets',
    linkLabel: 'More',
    img: Img2,
  },
  '3': {
    cardSize: CardSize.large,
    cardStyle: CardStyle.info2,
    title: 'Leaderboard rush!',
    subTitle: 'Subheading',
    description: 'TL;DR -- The market cap of the top 5000 most commonly traded Counter Strike skins.',
    link: 'https://app.overlay.market/#/markets',
    linkLabel: 'Go to this awesome market',
    img: Img4,
  },
  '4': {
    cardSize: CardSize.large,
    cardStyle: CardStyle.market2,
    title: 'sysysysy',
    img: Img3,
  },
  '5': {
    cardSize: CardSize.large,
    cardStyle: CardStyle.info1,
    title: 'sysysysy',
    img: Img4,
  }
}  