import { createPublicClient, formatUnits, getContract, http } from 'viem';
import { berachain } from 'viem/chains';
import {rewardsVaultABI} from '../abi/rewardsVaultABI';
import { PartialVault } from '../../../types/vaultTypes';
import { PriceItem } from '../hooks/useTokenPrices';
import { getTokenPrice } from './getTokenPrice';
import { VAULTS } from '../../../constants/vaults';
import { getTokenDecimals } from './getTokenDecimals';

type RewardDataTuple = [
  `0x${string}`, // rewardsDistributor
  bigint,        // rewardsDuration
  bigint,        // periodFinish
  bigint,        // rewardRate
  bigint,        // lastUpdateTime
  bigint         // rewardPerTokenStored
];

const publicClient = createPublicClient({
  chain: berachain,
  transport: http(),
});

export const calculateRewardsAPR = async({
  vault,
  prices
}: {
  vault: PartialVault;
  prices: PriceItem[];
}): Promise<void> => {
  const currentVault = VAULTS.find(vt => vt.vaultAddress.poolVault.toLowerCase() === vault.poolVaultAddress?.toLowerCase())!; 
  
  const contractAddress = currentVault && currentVault.vaultAddress.rewardsVault;

  const contract = getContract({
    address: contractAddress,
    abi: rewardsVaultABI,
    client: publicClient,
  });

  const [totalStaked, stakingTokenAddress] = await Promise.all([
    contract.read.totalSupply(),
    contract.read.stakingToken(),
    
  ] as [Promise<bigint>, Promise<`0x${string}`>]);
  
  const decimals = await getTokenDecimals(stakingTokenAddress)

  // const totalStakedFormatted = parseFloat(formatUnits(totalStaked, 18));
  const stakingTokenPrice = getTokenPrice(prices, stakingTokenAddress);
  const totalStakedValue = Number(totalStaked) * stakingTokenPrice;

  let totalAPR = 0;

  for (const { rewardTokenAddress } of currentVault.rewardTokens) {
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

  vault.rewardsApr = totalAPR.toString();
}