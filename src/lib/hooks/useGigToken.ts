"use client";

import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { MOCK_GIG_ABI } from "@/lib/abi";
import { GIG_TOKEN_ADDRESS, MARKETPLACE_ADDRESS, MONAD_TESTNET_CHAIN_ID } from "@/lib/contracts";
import { parseEther } from "viem";

// ─────────────── Read Hooks ───────────────

export function useTokenBalance(address: `0x${string}` | undefined) {
  return useReadContract({
    address: GIG_TOKEN_ADDRESS,
    abi: MOCK_GIG_ABI,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    chainId: MONAD_TESTNET_CHAIN_ID,
    query: { enabled: !!address },
  });
}

export function useTokenAllowance(owner: `0x${string}` | undefined) {
  return useReadContract({
    address: GIG_TOKEN_ADDRESS,
    abi: MOCK_GIG_ABI,
    functionName: "allowance",
    args: owner ? [owner, MARKETPLACE_ADDRESS] : undefined,
    chainId: MONAD_TESTNET_CHAIN_ID,
    query: { enabled: !!owner },
  });
}

export function useTokenDecimals() {
  return useReadContract({
    address: GIG_TOKEN_ADDRESS,
    abi: MOCK_GIG_ABI,
    functionName: "decimals",
    chainId: MONAD_TESTNET_CHAIN_ID,
  });
}

// ─────────────── Write Hooks ───────────────

export function useTokenApprove() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const approve = (amount: bigint) => {
    writeContract({
      address: GIG_TOKEN_ADDRESS,
      abi: MOCK_GIG_ABI,
      functionName: "approve",
      args: [MARKETPLACE_ADDRESS, amount],
    });
  };

  return { approve, hash, isPending, isConfirming, isSuccess, error };
}

export function useTokenMint() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const mint = (to: `0x${string}`, amount: string) => {
    writeContract({
      address: GIG_TOKEN_ADDRESS,
      abi: MOCK_GIG_ABI,
      functionName: "mint",
      args: [to, parseEther(amount)],
    });
  };

  return { mint, hash, isPending, isConfirming, isSuccess, error };
}
