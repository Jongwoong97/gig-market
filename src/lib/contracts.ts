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
  [MONAD_TESTNET_CHAIN_ID]: {
    gigToken: "0x280A8e1412920dc1B3c78d41c09cA061f850ccF3" as `0x${string}`,
    gigMarketplace: "0xF13502b3d2664d60F93270d6fA3faa2D56C0EDbF" as `0x${string}`,
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
