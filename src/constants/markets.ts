import AiIndex from "../assets/images/markets-full-logos/AI-Index.webp";
import BTCDominance from "../assets/images/markets-full-logos/BTC-Dominance.webp";
import RealEstateDominance from "../assets/images/markets-full-logos/Real-Estate-Dominance.webp";
import SuperETH from "../assets/images/markets-full-logos/Super-ETH.webp";
import CatsVsDogs from "../assets/images/markets-full-logos/cats-vs-dogs.webp";
import CatsVsFrogs from "../assets/images/markets-full-logos/cats-vs-frogs.webp";
import EvIndex from "../assets/images/markets-full-logos/ev-index.webp";
import FrogsVsDogs from "../assets/images/markets-full-logos/frogs-vs-dogs.webp";
import HikaruNakamura from "../assets/images/markets-full-logos/hikaru-nakamura.webp";
import KnivesCS2Skins from "../assets/images/markets-full-logos/knives-CS2-Skins.webp";
import KnivesVsRiflesCS2Skins from "../assets/images/markets-full-logos/knives-vs-rifles-CS2-Skins.webp";
import MagnusCarlsen from "../assets/images/markets-full-logos/magnus-carlsen.webp";
import QuantumCats from "../assets/images/markets-full-logos/quantum-cats.webp";
import RiflesCS2Skins from "../assets/images/markets-full-logos/rifles-CS2-Skins.webp";
import CS2Skins from "../assets/images/markets-full-logos/cs2-index.webp";
import ETHDominance from "../assets/images/markets-full-logos/eth-dom.webp";
import BTCFrog from "../assets/images/markets-full-logos/btc-frogs.webp";
import NodeMonkes from "../assets/images/markets-full-logos/node-monkes.webp";
import ETHSOL from "../assets/images/markets-full-logos/eth-sol.webp";
import INK from "../assets/images/markets-full-logos/ink.webp";
import ChessVideo from "../assets/videos/FuturisticChessMatch.mp4";
import LanaDelRey from "../assets/images/markets-full-logos/lana-del-rey.webp";
import BeraNFT from "../assets/images/markets-full-logos/Bera-Nft-Index.webp";
import AiAgents from "../assets/images/markets-full-logos/AI-Agents-Index.webp";
import TrumpFamily from "../assets/images/markets-full-logos/trump-family-index.webp";
import MrBeast from "../assets/images/markets-full-logos/mrbeast-yt-index.webp";
import MemesIndex from "../assets/images/markets-full-logos/meme-index.webp";
import L2 from "../assets/images/markets-full-logos/l2-index.webp";
import L1vL2 from "../assets/images/markets-full-logos/l1-vs-l2-index.webp";
import L1 from "../assets/images/markets-full-logos/l1-index.webp";
import HoneryJar from "../assets/images/markets-full-logos/honeyjar.webp";
import DeFi from "../assets/images/markets-full-logos/defi-index.webp";
import DefaultLogo from '../assets/images/markets-full-logos/dafault-logo.webp';

export const DEFAULT_LOGO = DefaultLogo;

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
  "Trump%20Family%20Index": TrumpFamily,
  "Mr%20Beast%20Popularity%20Index": MrBeast,
  "Memes%20Index": MemesIndex,
  "Layer%202%20Index": L2,
  "Layer1%20Vs%20Layer2%20Index": L1vL2,
  "Layer%201%20Index": L1,
  "HoneyComb%20and%20Jars%20NFT%20Index": HoneryJar,
  "Defi%20Index": DeFi,
};

export const MARKETS_VIDEOS: { [marketId: string]: string | undefined } = {
  "Hikaru%20Nakamura": ChessVideo,
};

export const MARKETSORDER = [
  "Counter-Strike%202%20Skins",
  "BTC%20Dominance",
  "ETH%20Dominance",
  "Bera%20NFT%20Index",
  "Bullas",
  "iBGT%20%2F%20BERA",
  "Mr%20Beast%20Popularity%20Index",
  "AI%20Agents%20Index",
  "AI%20Index",
  "Trump%20Family%20Index",
  "Memes%20Index",
  "Layer%202%20Index",
  "Layer1%20Vs%20Layer2%20Index",
  "Layer%201%20Index",
  "HoneyComb%20and%20Jars%20NFT%20Index",
  "Defi%20Index",
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
  MemeWar = "Meme Wars",
  CounterStrikeSkins = "Counter-Strike",
  OrdinalNft = "Ordinals",
  Crypto = "Crypto",
  Chess = "Chess",
  Artists = "Artists",
  Bera = "Bera",
  Other = "Other",
}

export type MarketCategoryMap = {
  [key in CategoryName]: string[];
};

export const MARKET_CATEGORIES: MarketCategoryMap = {
  [CategoryName.Chess]: ["Hikaru%20Nakamura", "Magnus%20Carlsen"],
  [CategoryName.Bera]: ["Bera%20NFT%20Index", "Bullas", "iBGT%20%2F%20BERA"],
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
    "Mr%20Beast%20Popularity%20Index",
  ],
  [CategoryName.Other]: [],
};