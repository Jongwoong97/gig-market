"use client"

import { useState, useEffect, useCallback } from "react"
import { useAccount } from "wagmi"
import { formatEther } from "viem"
import { Button } from "@/components/ui/Button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { Input } from "@/components/ui/Input"
import { Textarea } from "@/components/ui/Textarea"
import {
    Wallet, TrendingUp, Briefcase, User, CheckCircle2, AlertCircle,
    ArrowLeft, Loader2, Plus, Coins
} from "lucide-react"
import Link from "next/link"
import {
    useJobsByHirer,
    useJobsByAgent,
    useJobs,
    useSubmitWork,
    useApproveWork,
    useCancelJob,
    JOB_STATUS_LABELS,
    type OnChainJob,
    type OnChainJobStatus,
} from "@/lib/hooks/useGigMarketplace"
import { useTokenBalance, useTokenMint } from "@/lib/hooks/useGigToken"
import { TxLink } from "@/components/shared/TxLink"

// ─── On-chain job card ───
function OnChainJobCard({
    jobId,
    job,
    role,
    onSubmit,
    onReview,
    onCancel,
}: {
    jobId: bigint
    job: OnChainJob
    role: "agent" | "hirer"
    onSubmit: (jobId: bigint) => void
    onReview: (jobId: bigint, job: OnChainJob) => void
    onCancel: (jobId: bigint) => void
}) {
    const statusLabel = JOB_STATUS_LABELS[job.status]
    const reward = formatEther(job.reward)

    // Parse metadata
    let title = `Job #${jobId.toString()}`
    let category = "General"
    try {
        if (job.metadataCid.startsWith("data:")) {
            const meta = JSON.parse(job.metadataCid.slice(5))
            title = meta.title || title
            category = meta.category || category
        }
    } catch { /* ignore */ }

    const statusColor: Record<OnChainJobStatus, string> = {
        0: "text-blue-400 border-blue-500/50 bg-blue-500/10",
        1: "text-yellow-400 border-yellow-500/50 bg-yellow-500/10",
        2: "text-orange-400 border-orange-500/50 bg-orange-500/10",
        3: "text-green-400 border-green-500/50 bg-green-500/10",
        4: "text-red-400 border-red-500/50 bg-red-500/10",
    }

    return (
        <Card className="flex flex-col">
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline" className={statusColor[job.status]}>
                        {statusLabel}
                    </Badge>
                    <Badge variant="secondary" className="text-xs">{category}</Badge>
                </div>
                <CardTitle className="text-lg leading-snug">{title}</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 space-y-3">
                <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-primary">{Number(reward).toLocaleString()}</span>
                    <span className="text-sm text-muted-foreground">$GIG</span>
                </div>
                <div className="text-xs text-muted-foreground font-mono">
                    {role === "agent"
                        ? `Hirer: ${job.hirer.slice(0, 6)}...${job.hirer.slice(-4)}`
                        : job.agent !== "0x0000000000000000000000000000000000000000"
                            ? `Agent: ${job.agent.slice(0, 6)}...${job.agent.slice(-4)}`
                            : "No agent assigned yet"
                    }
                </div>
            </CardContent>
            <CardFooter className="pt-0 flex-col gap-2">
                {role === "agent" ? (
                    <div className="flex gap-2 w-full">
                        {job.status === 3 ? (
                            <Button size="sm" variant="outline" className="w-full text-green-500 border-green-500/50" asChild>
                                <Link href={`/jobs/${jobId.toString()}`}>
                                    <CheckCircle2 className="w-4 h-4 mr-2" /> Completed — View Details
                                </Link>
                            </Button>
                        ) : job.status === 2 ? (
                            <Button size="sm" variant="outline" className="w-full" asChild>
                                <Link href={`/jobs/${jobId.toString()}`}>Under Review — View Details</Link>
                            </Button>
                        ) : job.status === 1 ? (
                            <Button size="sm" className="w-full" onClick={() => onSubmit(jobId)}>
                                Submit Work
                            </Button>
                        ) : null}
                    </div>
                ) : (
                    <div className="flex gap-2 w-full">
                        {job.status === 2 ? (
                            <Button size="sm" className="w-full" onClick={() => onReview(jobId, job)}>
                                Review Submission
                            </Button>
                        ) : job.status === 0 ? (
                            <div className="flex gap-2 w-full">
                                <Button size="sm" variant="outline" className="flex-1" asChild>
                                    <Link href={`/jobs/${jobId.toString()}`}>View</Link>
                                </Button>
                                <Button size="sm" variant="destructive" className="flex-1" onClick={() => onCancel(jobId)}>
                                    Cancel
                                </Button>
                            </div>
                        ) : job.status === 3 ? (
                            <Button size="sm" variant="outline" className="w-full text-green-500 border-green-500/50" asChild>
                                <Link href={`/jobs/${jobId.toString()}`}>
                                    <CheckCircle2 className="w-4 h-4 mr-2" /> Completed — View Details
                                </Link>
                            </Button>
                        ) : (
                            <Button size="sm" variant="outline" className="w-full" asChild>
                                <Link href={`/jobs/${jobId.toString()}`}>View Details</Link>
                            </Button>
                        )}
                    </div>
                )}
            </CardFooter>
        </Card>
    )
}

export default function Dashboard() {
    const { address, isConnected } = useAccount()

    const [role, setRole] = useState<"agent" | "hirer">("agent")

    // On-chain data
    const { data: hirerJobIds, refetch: refetchHirerIds } = useJobsByHirer(address)
    const { data: agentJobIds, refetch: refetchAgentIds } = useJobsByAgent(address)
    const { data: hirerJobs, refetch: refetchHirerJobs } = useJobs(
        (hirerJobIds as bigint[]) || []
    )
    const { data: agentJobs, refetch: refetchAgentJobs } = useJobs(
        (agentJobIds as bigint[]) || []
    )

    // Token
    const { data: tokenBalance } = useTokenBalance(address)
    const { mint, isPending: isMinting, isConfirming: isMintConfirming, isSuccess: isMintSuccess } = useTokenMint()

    // Submit work flow
    const [selectedJobId, setSelectedJobId] = useState<bigint | null>(null)
    const [selectedOnChainJob, setSelectedOnChainJob] = useState<OnChainJob | null>(null)
    const [viewMode, setViewMode] = useState<"list" | "submit" | "review">("list")
    const [submissionContent, setSubmissionContent] = useState("")

    // Contract write hooks
    const {
        submitWork: submitWorkFn,
        hash: submitHash,
        isPending: isSubmitting,
        isConfirming: isSubmitConfirming,
        isSuccess: isSubmitSuccess,
        error: submitError,
    } = useSubmitWork()
    const {
        approveWork: approveWorkFn,
        hash: approveHash,
        isPending: isApproving,
        isConfirming: isApproveConfirming,
        isSuccess: isApproveSuccess,
        error: approveError,
    } = useApproveWork()
    const {
        cancelJob: cancelJobFn,
        hash: cancelHash,
        isPending: isCancelling,
        isConfirming: isCancelConfirming,
        isSuccess: isCancelSuccess,
        error: cancelError,
    } = useCancelJob()

    // Refetch on success
    const refetchAll = useCallback(() => {
        refetchHirerIds()
        refetchAgentIds()
        refetchHirerJobs()
        refetchAgentJobs()
    }, [refetchHirerIds, refetchAgentIds, refetchHirerJobs, refetchAgentJobs])

    // Refetch data when transactions succeed (but don't auto-navigate — let user see tx hash)
    useEffect(() => {
        if (isSubmitSuccess || isApproveSuccess || isCancelSuccess) {
            refetchAll()
        }
    }, [isSubmitSuccess, isApproveSuccess, isCancelSuccess, refetchAll])

    const goBackToList = () => {
        setViewMode("list")
        setSelectedJobId(null)
        setSelectedOnChainJob(null)
    }

    // Handlers
    const handleSubmitWork = (jobId: bigint) => {
        setSelectedJobId(jobId)
        setViewMode("submit")
        setSubmissionContent("")
    }

    const handleReview = (jobId: bigint, job: OnChainJob) => {
        setSelectedJobId(jobId)
        setSelectedOnChainJob(job)
        setViewMode("review")
    }

    const handleCancel = (jobId: bigint) => {
        cancelJobFn(jobId)
    }

    const doSubmitWork = () => {
        if (selectedJobId === null) return
        submitWorkFn(selectedJobId, submissionContent)
    }

    const doApproveWork = () => {
        if (selectedJobId === null) return
        approveWorkFn(selectedJobId)
    }

    const handleMint = () => {
        if (!address) return
        mint(address, "10000")
    }

    const isAnyBusy = isSubmitting || isSubmitConfirming || isApproving || isApproveConfirming || isCancelling || isCancelConfirming

    // ─── Not connected ───
    if (!isConnected) {
        return (
            <div className="container py-16 px-4 text-center">
                <Wallet className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <h1 className="text-2xl font-bold mb-2">Connect Your Wallet</h1>
                <p className="text-muted-foreground">Connect your wallet to view your dashboard and manage jobs.</p>
            </div>
        )
    }

    // ─── Submit work view ───
    if (viewMode === "submit" && selectedJobId !== null) {
        return (
            <div className="container py-8 px-4 md:px-6 max-w-2xl mx-auto">
                <Button variant="ghost" onClick={() => setViewMode("list")} className="mb-4 pl-0">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
                </Button>
                <Card>
                    <CardHeader>
                        <CardTitle>Submit Work: Job #{selectedJobId.toString()}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Evidence CID / Submission Link</label>
                            <Textarea
                                placeholder="Paste IPFS CID, GitHub link, or description of delivered work..."
                                className="min-h-[150px]"
                                value={submissionContent}
                                onChange={(e) => setSubmissionContent(e.target.value)}
                                disabled={isAnyBusy}
                            />
                            <p className="text-xs text-muted-foreground">
                                This will be stored on-chain as the evidence CID.
                            </p>
                        </div>

                        {submitError && (
                            <div className="flex items-start gap-2 p-3 rounded-lg border border-red-500/30 bg-red-500/5 text-red-400 text-xs">
                                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                                <span>{submitError.message?.slice(0, 200)}</span>
                            </div>
                        )}

                        {isSubmitSuccess && submitHash && (
                            <div className="flex items-center gap-3 p-4 rounded-lg border border-green-500/30 bg-green-500/5">
                                <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                                <div>
                                    <p className="text-sm font-medium text-green-400 mb-1">Work submitted successfully!</p>
                                    <TxLink hash={submitHash} label="View transaction on Monad Explorer" />
                                </div>
                            </div>
                        )}
                    </CardContent>
                    <CardFooter className="flex justify-end gap-2">
                        {isSubmitSuccess ? (
                            <Button onClick={goBackToList}>Back to Dashboard</Button>
                        ) : (
                            <>
                                <Button variant="outline" onClick={goBackToList} disabled={isAnyBusy}>Cancel</Button>
                                <Button
                                    onClick={doSubmitWork}
                                    disabled={!submissionContent.trim() || isAnyBusy}
                                >
                                    {isSubmitting || isSubmitConfirming ? (
                                        <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Submitting...</>
                                    ) : (
                                        "Submit for Review"
                                    )}
                                </Button>
                            </>
                        )}
                    </CardFooter>
                </Card>
            </div>
        )
    }

    // ─── Review view ───
    if (viewMode === "review" && selectedJobId !== null && selectedOnChainJob) {
        return (
            <div className="container py-8 px-4 md:px-6 max-w-2xl mx-auto">
                <Button variant="ghost" onClick={() => setViewMode("list")} className="mb-4 pl-0">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
                </Button>
                <Card>
                    <CardHeader>
                        <CardTitle>Review: Job #{selectedJobId.toString()}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-muted-foreground">Agent Submission (Evidence CID)</label>
                            <div className="p-4 rounded-md border border-input bg-muted/20 min-h-[80px] whitespace-pre-wrap break-all font-mono text-sm">
                                {selectedOnChainJob.evidenceCid || "No evidence submitted yet"}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-muted-foreground">Agent Address</label>
                            <div className="font-mono text-sm text-muted-foreground">{selectedOnChainJob.agent}</div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-muted-foreground">Reward</label>
                            <div className="text-2xl font-bold text-primary">
                                {Number(formatEther(selectedOnChainJob.reward)).toLocaleString()} GIG
                            </div>
                        </div>

                        {approveError && (
                            <div className="flex items-start gap-2 p-3 rounded-lg border border-red-500/30 bg-red-500/5 text-red-400 text-xs">
                                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                                <span>{approveError.message?.slice(0, 200)}</span>
                            </div>
                        )}

                        {isApproveSuccess && approveHash && (
                            <div className="flex items-center gap-3 p-4 rounded-lg border border-green-500/30 bg-green-500/5">
                                <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                                <div>
                                    <p className="text-sm font-medium text-green-400 mb-1">Funds released to agent!</p>
                                    <TxLink hash={approveHash} label="View transaction on Monad Explorer" />
                                </div>
                            </div>
                        )}
                    </CardContent>
                    <CardFooter className="flex justify-end gap-2">
                        {isApproveSuccess ? (
                            <Button onClick={goBackToList}>Back to Dashboard</Button>
                        ) : (
                            <>
                                <Button variant="outline" onClick={goBackToList} disabled={isAnyBusy}>Cancel</Button>
                                <Button
                                    className="bg-green-600 hover:bg-green-700 text-white"
                                    onClick={doApproveWork}
                                    disabled={isAnyBusy}
                                >
                                    {isApproving || isApproveConfirming ? (
                                        <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Approving...</>
                                    ) : (
                                        <><CheckCircle2 className="w-4 h-4 mr-2" /> Approve &amp; Release Funds</>
                                    )}
                                </Button>
                            </>
                        )}
                    </CardFooter>
                </Card>
            </div>
        )
    }

    // ─── Main list view ───
    const displayJobs = role === "agent" ? agentJobs : hirerJobs
    const displayJobIds = role === "agent" ? (agentJobIds as bigint[]) : (hirerJobIds as bigint[])

    return (
        <div className="container py-8 px-4 md:px-6">
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between mb-8 gap-4">
                <div className="flex items-center gap-4">
                    <div className="h-16 w-16 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center text-2xl font-bold text-white">
                        {address ? address.slice(2, 4).toUpperCase() : "??"}
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold">
                            {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "Not Connected"}
                        </h1>
                        <div className="flex items-center gap-2 text-muted-foreground text-sm">
                            <span className="flex items-center gap-1">
                                <Wallet className="w-3 h-3" /> {address}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="flex gap-2 bg-muted/30 p-1 rounded-lg">
                    <button
                        onClick={() => setRole("agent")}
                        className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${role === "agent" ? "bg-primary text-primary-foreground shadow-sm" : "hover:bg-muted/50 text-muted-foreground"}`}
                    >
                        Working (Agent)
                    </button>
                    <button
                        onClick={() => setRole("hirer")}
                        className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${role === "hirer" ? "bg-primary text-primary-foreground shadow-sm" : "hover:bg-muted/50 text-muted-foreground"}`}
                    >
                        Hiring (Hirer)
                    </button>
                </div>
            </div>

            {/* Stats */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 240px), 1fr))", gap: "1.5rem" }} className="mb-8">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">GIG Balance</CardTitle>
                        <Coins className="w-4 h-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {tokenBalance !== undefined ? Number(formatEther(tokenBalance)).toLocaleString() : "—"}
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-xs text-primary mt-1 p-0 h-auto"
                            onClick={handleMint}
                            disabled={isMinting || isMintConfirming}
                        >
                            {isMinting || isMintConfirming ? (
                                <><Loader2 className="w-3 h-3 mr-1 animate-spin" /> Minting...</>
                            ) : isMintSuccess ? (
                                "Minted 10,000 GIG!"
                            ) : (
                                "Mint 10,000 test GIG"
                            )}
                        </Button>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            {role === "agent" ? "Jobs as Agent" : "Jobs Posted"}
                        </CardTitle>
                        <Briefcase className="w-4 h-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{displayJobIds?.length || 0}</div>
                        <p className="text-xs text-muted-foreground">On-chain jobs</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            {role === "agent" ? "Active Gigs" : "Pending Reviews"}
                        </CardTitle>
                        <User className="w-4 h-4 text-secondary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {displayJobs
                                ? displayJobs.filter((j) =>
                                    role === "agent"
                                        ? j.status === 1
                                        : j.status === 2
                                ).length
                                : 0}
                        </div>
                        <p className="text-xs text-muted-foreground">Requires attention</p>
                    </CardContent>
                </Card>
            </div>

            {/* Action bar */}
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">
                    {role === "agent" ? "My Active Gigs" : "Posted Jobs & Status"}
                </h2>
                {role === "hirer" && (
                    <Button asChild>
                        <Link href="/jobs/create">
                            <Plus className="w-4 h-4 mr-2" /> Post New Job
                        </Link>
                    </Button>
                )}
            </div>

            {/* Cancel feedback */}
            {cancelError && (
                <div className="flex items-start gap-2 p-3 rounded-lg border border-red-500/30 bg-red-500/5 text-red-400 text-xs mb-4">
                    <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <span>Cancel failed: {cancelError.message?.slice(0, 200)}</span>
                </div>
            )}
            {isCancelSuccess && cancelHash && (
                <div className="flex items-center gap-3 p-3 rounded-lg border border-green-500/30 bg-green-500/5 mb-4">
                    <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm text-green-400">Job cancelled.</span>
                    <TxLink hash={cancelHash} label="View tx" />
                </div>
            )}

            {/* Job list */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 320px), 1fr))", gap: "1.5rem" }}>
                {displayJobs && displayJobIds && displayJobs.length > 0
                    ? displayJobs.map((job, i) => (
                          <OnChainJobCard
                              key={displayJobIds[i].toString()}
                              jobId={displayJobIds[i]}
                              job={job}
                              role={role}
                              onSubmit={handleSubmitWork}
                              onReview={handleReview}
                              onCancel={handleCancel}
                          />
                      ))
                    : null}
            </div>

            {(!displayJobs || displayJobs.length === 0) && (
                <div className="text-center py-12 text-muted-foreground border border-dashed border-border rounded-lg">
                    <p className="mb-4">
                        {role === "agent"
                            ? "No active gigs yet. Browse open jobs to get started!"
                            : "You haven't posted any jobs yet."}
                    </p>
                    <Button variant="outline" asChild>
                        <Link href={role === "agent" ? "/jobs" : "/jobs/create"}>
                            {role === "agent" ? "Browse Jobs" : "Post Your First Job"}
                        </Link>
                    </Button>
                </div>
            )}
        </div>
    )
}
