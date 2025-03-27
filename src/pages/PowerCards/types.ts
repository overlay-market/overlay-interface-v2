export interface AllCardData {
  id: number;
  name: string;
  image: string;
  status: string;
  address: string;
  ipfsData?: any;
}
export interface UnifiedCardData extends Omit<AllCardData, "id"> {
  id: string;
  ipfsData?: any;
  amount?: string;
  burnt?: string;
  token?: {
    tokenUri: string;
    address: string;
    id: string;
    tokenId: string;
  };
}
