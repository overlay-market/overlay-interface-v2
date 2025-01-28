import AiIndex from "../assets/images/markets-full-logos/AI-Index.png";
import BTCDominance from "../assets/images/markets-full-logos/BTC-Dominance.png";
import RealEstateDominance from "../assets/images/markets-full-logos/Real-Estate-Dominance.png";
import SuperETH from "../assets/images/markets-full-logos/Super-ETH.png";
import CatsVsDogs from "../assets/images/markets-full-logos/cats-vs-dogs.png";
import CatsVsFrogs from "../assets/images/markets-full-logos/cats-vs-frogs.png";
import EvIndex from "../assets/images/markets-full-logos/ev-index.png";
import FrogsVsDogs from "../assets/images/markets-full-logos/frogs-vs-dogs.png";
import HikaruNakamura from "../assets/images/markets-full-logos/hikaru-nakamura.png";
import KnivesCS2Skins from "../assets/images/markets-full-logos/knives-CS2-Skins.png";
import KnivesVsRiflesCS2Skins from "../assets/images/markets-full-logos/knives-vs-rifles-CS2-Skins.png";
import MagnusCarlsen from "../assets/images/markets-full-logos/magnus-carlsen.png";
import QuantumCats from "../assets/images/markets-full-logos/quantum-cats.png";
import RiflesCS2Skins from "../assets/images/markets-full-logos/rifles-CS2-Skins.png";
import CS2Skins from "../assets/images/markets-full-logos/cs2-index.png";
import ETHDominance from "../assets/images/markets-full-logos/eth-dom.png";
import BTCFrog from "../assets/images/markets-full-logos/btc-frogs.png";
import NodeMonkes from "../assets/images/markets-full-logos/node-monkes.png";
import ETHSOL from "../assets/images/markets-full-logos/eth-sol.png";
import INK from "../assets/images/markets-full-logos/ink.jpeg";
import ChessVideo from "../assets/videos/FuturisticChessMatch.mp4";
import LanaDelRey from "../assets/images/markets-full-logos/lana-del-rey.png";
import BeraNFT from "../assets/images/markets-full-logos/Bera-Nft-Index.png";
import AiAgents from "../assets/images/markets-full-logos/AI-Agents-Index.png";

export const MARKETS_FULL_LOGOS: { [marketId: string]: string | undefined } = {
  "Counter-Strike%202%20Skins": CS2Skins,
  "Rifles%20-%20CS2%20Skins": RiflesCS2Skins,
  "Knives%20-%20CS2%20Skins": KnivesCS2Skins,
  "Knives%20vs%20Rifles%20-%20CS2%20Skins": KnivesVsRiflesCS2Skins,
  "BTC%20Dominance": BTCDominance,
  "ETH%20Dominance": ETHDominance,
  "Bitcoin%20Frogs": BTCFrog,
  NodeMonkes: NodeMonkes,
  "Quantum%20Cats": QuantumCats,
  Ink: INK,
  "ETH%20%2F%20SOL": ETHSOL,
  "AI%20Index": AiIndex,
  "Frogs%20vs%20Dogs%20-%20Meme%20War": FrogsVsDogs,
  "SUPER%20%2F%20ETH": SuperETH,
  "Cats%20vs%20Dogs%20-%20Meme%20War": CatsVsDogs,
  "Real%20Estate%20Dominance": RealEstateDominance,
  "Hikaru%20Nakamura": HikaruNakamura,
  "Cats%20vs%20Frogs%20-%20Meme%20War": CatsVsFrogs,
  "Magnus%20Carlsen": MagnusCarlsen,
  "Electric%20Vehicle%20Commodity%20Index": EvIndex,
  "Lana%20Del%20Rey": LanaDelRey,
  "Bera%20NFT%20Index": BeraNFT,
  "AI%20Agents%20Index": AiAgents,
};

export const MARKETS_VIDEOS: { [marketId: string]: string | undefined } = {
  "Hikaru%20Nakamura": ChessVideo,
};

export const MARKETSORDER = [
  "Counter-Strike%202%20Skins",
  "BTC%20Dominance",
  "ETH%20Dominance",
  "Bera%20NFT%20Index",
  "AI%20Agents%20Index",
  "AI%20Index",
  "Lana%20Del%20Rey",
  "ETH%20%2F%20SOL",
  "Quantum%20Cats",
  "Bitcoin%20Frogs",
  "NodeMonkes",
  "Ink",
  "Real%20Estate%20Dominance",
  "SUPER%20%2F%20ETH",
  "Hikaru%20Nakamura",
  "Magnus%20Carlsen",
  "Cats%20vs%20Dogs%20-%20Meme%20War",
  "Rifles%20-%20CS2%20Skins",
  "Cats%20vs%20Frogs%20-%20Meme%20War",
  "Knives%20-%20CS2%20Skins",
  "Frogs%20vs%20Dogs%20-%20Meme%20War",
  "Knives%20vs%20Rifles%20-%20CS2%20Skins",
];

export const EXCLUDEDMARKETS = ["ETH%20Dominance", "Hikaru%20Nakamura"];

export enum CategoryName {
  MemeWar = 'Meme Wars',
  CounterStrikeSkins = 'Counter-Strike',
  OrdinalNft = 'Ordinals',
  Crypto = 'Crypto',
  Chess = 'Chess',
  Artists = 'Artists',
  Other = 'Other',
}

export type MarketCategoryMap = {
  [key in CategoryName]: string[];
};

export const MARKET_CATEGORIES: MarketCategoryMap = {
  [CategoryName.Chess]: [
    "Hikaru%20Nakamura",
    "Magnus%20Carlsen",
  ],
  [CategoryName.MemeWar]: [
    "Cats%20vs%20Dogs%20-%20Meme%20War",
    "Cats%20vs%20Frogs%20-%20Meme%20War",
    "Frogs%20vs%20Dogs%20-%20Meme%20War",
  ],
  [CategoryName.CounterStrikeSkins]: [
    "Counter-Strike%202%20Skins",
    "Rifles%20-%20CS2%20Skins",
    "Knives%20-%20CS2%20Skins",
    "Knives%20vs%20Rifles%20-%20CS2%20Skins",
  ],
  [CategoryName.OrdinalNft]: [
    "Quantum%20Cats",
    "Bitcoin%20Frogs",
    "NodeMonkes",
    "Ink",
  ],
  [CategoryName.Crypto]: [
    "BTC%20Dominance",
    "ETH%20Dominance",
    "AI%20Index",
    "ETH%20%2F%20SOL",
    "Real%20Estate%20Dominance",
    "SUPER%20%2F%20ETH",
  ],
  [CategoryName.Artists]: [
    "Lana%20Del%20Rey",
  ],
  [CategoryName.Other]: [

  ],
}