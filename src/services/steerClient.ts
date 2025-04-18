import { createPublicClient, createWalletClient, http } from 'viem';
import { SteerClient, SteerConfig } from '@steerprotocol/sdk';
import { kava } from 'viem/chains';

const viemClient = createPublicClient({
  chain: kava,
  transport: http(),
});

const walletClient = createWalletClient({
  chain:   kava,
  transport: http()
});

const steerConfig: SteerConfig = {
  environment: 'production',
  client: viemClient,
  walletClient
};

const steerClient = new SteerClient(steerConfig);

export default steerClient;
