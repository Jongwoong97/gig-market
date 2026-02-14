"use client";

import {
  useReadContract,
  useReadContracts,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { GIG_MARKETPLACE_ABI } from "@/lib/abi";
import { MARKETPLACE_ADDRESS } from "@/lib/contracts";

// ─────────────── Types ───────────────

export type OnChainJobStatus = 0 | 1 | 2 | 3 | 4;
// 0=Open, 1=InProgress, 2=Review, 3=Completed, 4=Cancelled

export const JOB_STATUS_LABELS: Record<OnChainJobStatus, string> = {
  0: "Open",
  1: "In Progress",
  2: "Review",
  3: "Completed",
  4: "Cancelled",
};

export interface OnChainJob {
  hirer: `0x${string}`;
  agent: `0x${string}`;
  token: `0x${string}`;
  reward: bigint;
  metadataCid: string;
  deadline: bigint;
  status: OnChainJobStatus;
  evidenceCid: string;
}

// ─────────────── Read Hooks ───────────────

export function useJobCount() {
  return useReadContract({
    address: MARKETPLACE_ADDRESS,
    abi: GIG_MARKETPLACE_ABI,
    functionName: "jobCount",
  });
}

export function useJob(jobId: bigint | undefined) {
  const result = useReadContract({
    address: MARKETPLACE_ADDRESS,
    abi: GIG_MARKETPLACE_ABI,
    functionName: "getJob",
    args: jobId !== undefined ? [jobId] : undefined,
    query: { enabled: jobId !== undefined },
  });

  // Parse the tuple into a typed object
  const data = result.data
    ? ({
        hirer: result.data.hirer as `0x${string}`,
        agent: result.data.agent as `0x${string}`,
        token: result.data.token as `0x${string}`,
        reward: result.data.reward as bigint,
        metadataCid: result.data.metadataCid as string,
        deadline: result.data.deadline as bigint,
        status: Number(result.data.status) as OnChainJobStatus,
        evidenceCid: result.data.evidenceCid as string,
      } satisfies OnChainJob)
    : undefined;

  return { ...result, data };
}

export function useJobsByHirer(address: `0x${string}` | undefined) {
  return useReadContract({
    address: MARKETPLACE_ADDRESS,
    abi: GIG_MARKETPLACE_ABI,
    functionName: "getJobsByHirer",
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });
}

export function useJobsByAgent(address: `0x${string}` | undefined) {
  return useReadContract({
    address: MARKETPLACE_ADDRESS,
    abi: GIG_MARKETPLACE_ABI,
    functionName: "getJobsByAgent",
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });
}

/**
 * Batch-fetch multiple jobs by their IDs.
 */
export function useJobs(jobIds: bigint[]) {
  const contracts = jobIds.map((id) => ({
    address: MARKETPLACE_ADDRESS,
    abi: GIG_MARKETPLACE_ABI,
    functionName: "getJob" as const,
    args: [id] as const,
  }));

  const result = useReadContracts({ contracts, query: { enabled: jobIds.length > 0 } });

  const data = result.data
    ?.map((r) => {
      if (r.status !== "success" || !r.result) return null;
      const d = r.result as {
        hirer: `0x${string}`;
        agent: `0x${string}`;
        token: `0x${string}`;
        reward: bigint;
        metadataCid: string;
        deadline: bigint;
        status: number;
        evidenceCid: string;
      };
      return {
        hirer: d.hirer,
        agent: d.agent,
        token: d.token,
        reward: d.reward,
        metadataCid: d.metadataCid,
        deadline: d.deadline,
        status: Number(d.status) as OnChainJobStatus,
        evidenceCid: d.evidenceCid,
      } satisfies OnChainJob;
    })
    .filter(Boolean) as OnChainJob[] | undefined;

  return { ...result, data };
}

// ─────────────── Write Hooks ───────────────

export function usePostJob() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const postJob = (token: `0x${string}`, reward: bigint, metadataCid: string, duration: bigint) => {
    writeContract({
      address: MARKETPLACE_ADDRESS,
      abi: GIG_MARKETPLACE_ABI,
      functionName: "postJob",
      args: [token, reward, metadataCid, duration],
    });
  };

  return { postJob, hash, isPending, isConfirming, isSuccess, error };
}

export function useApplyToJob() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const applyToJob = (jobId: bigint) => {
    writeContract({
      address: MARKETPLACE_ADDRESS,
      abi: GIG_MARKETPLACE_ABI,
      functionName: "applyToJob",
      args: [jobId],
    });
  };

  return { applyToJob, hash, isPending, isConfirming, isSuccess, error };
}

export function useSubmitWork() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const submitWork = (jobId: bigint, evidenceCid: string) => {
    writeContract({
      address: MARKETPLACE_ADDRESS,
      abi: GIG_MARKETPLACE_ABI,
      functionName: "submitWork",
      args: [jobId, evidenceCid],
    });
  };

  return { submitWork, hash, isPending, isConfirming, isSuccess, error };
}

export function useApproveWork() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const approveWork = (jobId: bigint) => {
    writeContract({
      address: MARKETPLACE_ADDRESS,
      abi: GIG_MARKETPLACE_ABI,
      functionName: "approveWork",
      args: [jobId],
    });
  };

  return { approveWork, hash, isPending, isConfirming, isSuccess, error };
}

export function useCancelJob() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const cancelJob = (jobId: bigint) => {
    writeContract({
      address: MARKETPLACE_ADDRESS,
      abi: GIG_MARKETPLACE_ABI,
      functionName: "cancelJob",
      args: [jobId],
    });
  };

  return { cancelJob, hash, isPending, isConfirming, isSuccess, error };
}
