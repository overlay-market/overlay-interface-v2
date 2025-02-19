export interface CardData {
  id: number;
  name: string;
  image: string;
  effect: string;
  duration: string;
  rarity: string;
  status: "available" | "owned" | "burnt";
}
