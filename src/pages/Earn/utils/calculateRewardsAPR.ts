import { formatUnits, getContract, PublicClient } from 'viem';
import {rewardsVaultABI} from '../abi/rewardsVaultABI';
import { MR_types } from '../../../types/vaultTypes';
import { PriceItem } from '../hooks/useTokenPrices';
import { getTokenPrice } from './getTokenPrice';
import { VAULT_ITEMS, vaultsById } from '../../../constants/vaults';
import { getTokenDecimals } from './getTokenDecimals';

type RewardDataTuple = [
  `0x${string}`, // rewardsDistributor
  bigint,        // rewardsDuration
  bigint,        // periodFinish
  bigint,        // rewardRate
  bigint,        // lastUpdateTime
  bigint         // rewardPerTokenStored
];

export const calculateRewardsAPR = async(vaultId: number, prices: PriceItem[], publicClient: PublicClient): Promise<number | null> => {
  try {
    const currentVault = vaultsById[vaultId]; 
    const currentMRVault = VAULT_ITEMS.find(vt => currentVault.vaultItems.includes(vt.id) && MR_types.includes(vt.vaultType))!;
    const contractAddress = currentMRVault && currentMRVault.vaultAddress;
    
    const contract = getContract({
      address: contractAddress,
      abi: rewardsVaultABI,
      client: publicClient,
    });

    const [totalStaked, stakingTokenAddress] = await Promise.all([
      contract.read.totalSupply(),
      contract.read.stakingToken(),
      
    ] as [Promise<bigint>, Promise<`0x${string}`>]);
    
    const decimals = await getTokenDecimals(stakingTokenAddress, publicClient)
  
    // const totalStakedFormatted = parseFloat(formatUnits(totalStaked, 18));
    const stakingTokenPrice = getTokenPrice(prices, stakingTokenAddress);
    const totalStakedValue = Number(totalStaked) * stakingTokenPrice;

    let totalAPR = 0;

    for (const { rewardTokenAddress } of currentMRVault.rewardTokens) {
      const rewardData = await contract.read.rewardData([rewardTokenAddress]) as RewardDataTuple;
      const rewardRate = rewardData[3];
          
      const secondsInYear = 31_536_000n; // 365 * 24 * 60 * 60
      const annualRewardRaw = rewardRate * secondsInYear; 
      const annualReward = Number(formatUnits(annualRewardRaw, decimals));
      const rewardTokenPrice = getTokenPrice(prices, rewardTokenAddress);
      const annualRewardValue = annualReward * rewardTokenPrice;

      const tokenAPR = totalStakedValue === 0 ? 0 : (annualRewardValue / totalStakedValue) * 100;
      totalAPR += tokenAPR;
    }

    return totalAPR;
  } catch (error) {
    console.error(`Error calculating APR for vault ${vaultId}:`, error);
    return null;
  }
}