/**
 * Deployed contract addresses per chain.
 * Update these after deploying to Monad Testnet.
 */

// Monad Testnet chainId
export const MONAD_TESTNET_CHAIN_ID = 10143;

type ContractAddresses = {
  gigToken: `0x${string}`;
  gigMarketplace: `0x${string}`;
};

const addresses: Record<number, ContractAddresses> = {
  // Monad Testnet — replace with real addresses after deployment
  [MONAD_TESTNET_CHAIN_ID]: {
    gigToken: (process.env.NEXT_PUBLIC_GIG_TOKEN_ADDRESS || "0x0000000000000000000000000000000000000000") as `0x${string}`,
    gigMarketplace: (process.env.NEXT_PUBLIC_MARKETPLACE_ADDRESS || "0x0000000000000000000000000000000000000000") as `0x${string}`,
  },
};

export function getContractAddresses(chainId: number): ContractAddresses {
  const addrs = addresses[chainId];
  if (!addrs) {
    throw new Error(`No contract addresses configured for chainId ${chainId}`);
  }
  return addrs;
}

// Convenience exports for the default chain (Monad Testnet)
export const GIG_TOKEN_ADDRESS = addresses[MONAD_TESTNET_CHAIN_ID].gigToken;
export const MARKETPLACE_ADDRESS = addresses[MONAD_TESTNET_CHAIN_ID].gigMarketplace;
