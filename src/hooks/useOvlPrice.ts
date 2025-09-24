import { useQuery } from "@tanstack/react-query";
import useSDK from "../providers/SDKProvider/useSDK";

type OvlPrice = number; 

export const useOvlPrice = () => {
  const sdk = useSDK();

  return useQuery<OvlPrice, Error>({
    queryKey: ["ovlPrice"],
    queryFn: async () => {
      const price = await sdk.ovl.price();
      if (!price) throw new Error("Price not available");
      return price as OvlPrice;
    },
    staleTime: 30_000, // cache data for 30s
    refetchInterval: 30_000, 
  });
};