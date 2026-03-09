import { useMutation, useQueryClient } from "@tanstack/react-query";
import { REFERRAL_API_BASE_URL } from "../../constants/applications";

export const usePostSignature = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      trader,
      affiliate,
      signature,
    }: {
      trader: string;
      affiliate: string;
      signature: string;
    }) => {
      const res = await fetch(`${REFERRAL_API_BASE_URL}/signatures`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ trader, affiliate, signature }),
      });
      if (!res.ok) {
        const result = await res.json();
        throw new Error(result?.message ?? "Failed to post signature");
      }
      return res.json();
    },
    onSuccess: (_, { trader }) => {
      queryClient.invalidateQueries({ queryKey: ["traderStatus", trader] });
    },
  });
};