const MONAD_TESTNET_EXPLORER = "https://testnet.monadexplorer.com";

export function getTxUrl(hash: string): string {
  return `${MONAD_TESTNET_EXPLORER}/tx/${hash}`;
}

export function getAddressUrl(address: string): string {
  return `${MONAD_TESTNET_EXPLORER}/address/${address}`;
}
