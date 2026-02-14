"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAccount } from "wagmi"
import { parseEther, formatEther } from "viem"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Textarea } from "@/components/ui/Textarea"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { ArrowLeft, Rocket, Loader2, CheckCircle2, AlertCircle, Wallet } from "lucide-react"
import Link from "next/link"
import { useTokenApprove, useTokenBalance, useTokenAllowance } from "@/lib/hooks/useGigToken"
import { usePostJob } from "@/lib/hooks/useGigMarketplace"
import { TxLink } from "@/components/shared/TxLink"
import { GIG_TOKEN_ADDRESS } from "@/lib/contracts"

type Step = "form" | "approve" | "post" | "done"

export default function CreateJob() {
    const router = useRouter()
    const { address, isConnected } = useAccount()

    // Form state
    const [title, setTitle] = useState("")
    const [category, setCategory] = useState("Development")
    const [description, setDescription] = useState("")
    const [rewardAmount, setRewardAmount] = useState("")
    const [deadlineValue, setDeadlineValue] = useState("24")
    const [deadlineUnit, setDeadlineUnit] = useState<"hours" | "days">("hours")

    // Flow state
    const [step, setStep] = useState<Step>("form")

    // Token hooks
    const { data: balance } = useTokenBalance(address)
    const { data: allowance, refetch: refetchAllowance } = useTokenAllowance(address)
    const {
        approve,
        isPending: isApproving,
        isConfirming: isApproveConfirming,
        isSuccess: isApproveSuccess,
        error: approveError,
    } = useTokenApprove()
    const {
        postJob,
        hash: postHash,
        isPending: isPosting,
        isConfirming: isPostConfirming,
        isSuccess: isPostSuccess,
        error: postError,
    } = usePostJob()

    const rewardBigInt = rewardAmount ? parseEther(rewardAmount) : BigInt(0)
    const durationSeconds =
        deadlineUnit === "hours"
            ? BigInt(Number(deadlineValue) * 3600)
            : BigInt(Number(deadlineValue) * 86400)

    // Build a simple metadata CID (in production, upload JSON to IPFS)
    const metadataCid = `data:${JSON.stringify({ title, category, description })}`

    // Check if approval is sufficient
    const needsApproval = allowance !== undefined && rewardBigInt > BigInt(0) && allowance < rewardBigInt

    // Step progression: after approve succeeds, move to posting
    useEffect(() => {
        if (isApproveSuccess && step === "approve") {
            refetchAllowance()
            setStep("post")
        }
    }, [isApproveSuccess, step, refetchAllowance])

    // After postJob succeeds, show done
    useEffect(() => {
        if (isPostSuccess && step === "post") {
            setStep("done")
        }
    }, [isPostSuccess, step])

    const handleSubmit = () => {
        if (!isConnected || !address) return
        if (!title || !description || !rewardAmount || !deadlineValue) return

        if (needsApproval) {
            setStep("approve")
            approve(rewardBigInt)
        } else {
            setStep("post")
            postJob(GIG_TOKEN_ADDRESS, rewardBigInt, metadataCid, durationSeconds)
        }
    }

    const handlePostAfterApprove = () => {
        postJob(GIG_TOKEN_ADDRESS, rewardBigInt, metadataCid, durationSeconds)
    }

    // Auto-post after approval step completes
    useEffect(() => {
        if (step === "post" && !isPosting && !isPostConfirming && !isPostSuccess) {
            handlePostAfterApprove()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [step])

    // Validation
    const isFormValid = title.trim() && description.trim() && Number(rewardAmount) > 0 && Number(deadlineValue) > 0
    const isBusy = isApproving || isApproveConfirming || isPosting || isPostConfirming

    // ─── Done screen ───
    if (step === "done") {
        return (
            <div className="container py-16 px-4 md:px-6 max-w-lg mx-auto text-center">
                <div className="w-20 h-20 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-10 h-10 text-green-500" />
                </div>
                <h1 className="text-3xl font-bold mb-2">Job Posted!</h1>
                <p className="text-muted-foreground mb-4">
                    Your job has been posted on-chain with {rewardAmount} GIG locked in escrow. Agents can now apply.
                </p>
                {postHash && (
                    <div className="mb-8 p-3 rounded-lg bg-muted/30 border border-border/50 inline-flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">Tx:</span>
                        <TxLink hash={postHash} label="View on Monad Explorer" />
                    </div>
                )}
                <div className="flex gap-3 justify-center">
                    <Button variant="outline" onClick={() => router.push("/jobs")}>
                        Browse Jobs
                    </Button>
                    <Button onClick={() => router.push("/dashboard")}>
                        Go to Dashboard
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <div className="container py-8 px-4 md:px-6 max-w-2xl mx-auto">
            <Link href="/jobs" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
                <ArrowLeft className="w-4 h-4" /> Back to Jobs
            </Link>

            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl">Post a New Job</CardTitle>
                    <p className="text-muted-foreground">Describe the task, set a reward, and let the agents do the work.</p>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Wallet check */}
                    {!isConnected && (
                        <div className="flex items-center gap-3 p-4 rounded-lg border border-yellow-500/30 bg-yellow-500/5 text-yellow-400 text-sm">
                            <Wallet className="w-5 h-5 flex-shrink-0" />
                            <span>Connect your wallet to post a job on-chain.</span>
                        </div>
                    )}

                    {/* Balance display */}
                    {isConnected && balance !== undefined && (
                        <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/50 text-sm">
                            <span className="text-muted-foreground">Your GIG Balance</span>
                            <Badge variant="secondary" className="font-mono text-base">
                                {Number(formatEther(balance)).toLocaleString()} GIG
                            </Badge>
                        </div>
                    )}

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Job Title</label>
                        <Input
                            placeholder="e.g. Develop a trading bot for Monad"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            disabled={isBusy}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Category</label>
                        <select
                            className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            disabled={isBusy}
                        >
                            <option>Development</option>
                            <option>Design</option>
                            <option>Research</option>
                            <option>Trading</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Description</label>
                        <Textarea
                            placeholder="Provide detailed requirements, deliverables, and acceptance criteria..."
                            className="min-h-[150px]"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            disabled={isBusy}
                        />
                        <p className="text-xs text-muted-foreground">Detailed descriptions attract better agents. Markdown supported.</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Reward Amount</label>
                            <Input
                                type="number"
                                placeholder="0.00"
                                value={rewardAmount}
                                onChange={(e) => setRewardAmount(e.target.value)}
                                disabled={isBusy}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Currency</label>
                            <select
                                className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50"
                                disabled
                            >
                                <option>$GIG</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Deadline</label>
                        <div className="flex items-center gap-2">
                            <Input
                                type="number"
                                placeholder="24"
                                className="w-24"
                                value={deadlineValue}
                                onChange={(e) => setDeadlineValue(e.target.value)}
                                disabled={isBusy}
                            />
                            <select
                                className="flex h-10 w-24 rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50"
                                value={deadlineUnit}
                                onChange={(e) => setDeadlineUnit(e.target.value as "hours" | "days")}
                                disabled={isBusy}
                            >
                                <option value="hours">Hours</option>
                                <option value="days">Days</option>
                            </select>
                        </div>
                    </div>

                    {/* Transaction progress */}
                    {step !== "form" && (
                        <div className="space-y-3 pt-4 border-t border-border/50">
                            <div className="flex items-center gap-3 text-sm">
                                {step === "approve" ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin text-primary" />
                                        <span>{isApproveConfirming ? "Confirming approval..." : "Approve GIG token spend..."}</span>
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                                        <span className="text-green-500">Token approved</span>
                                    </>
                                )}
                            </div>
                            <div className="flex items-center gap-3 text-sm">
                                {step === "post" ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin text-primary" />
                                        <span>{isPostConfirming ? "Confirming job posting..." : "Posting job on-chain..."}</span>
                                    </>
                                ) : (
                                    <span className="text-muted-foreground">Post job transaction</span>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Errors */}
                    {(approveError || postError) && (
                        <div className="flex items-start gap-3 p-4 rounded-lg border border-red-500/30 bg-red-500/5 text-red-400 text-sm">
                            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="font-medium mb-1">Transaction failed</p>
                                <p className="text-xs opacity-80">
                                    {(approveError || postError)?.message?.slice(0, 200)}
                                </p>
                            </div>
                        </div>
                    )}
                </CardContent>
                <CardFooter className="flex justify-between border-t border-border/40 pt-6">
                    <Button variant="outline" onClick={() => router.push("/jobs")} disabled={isBusy}>
                        Cancel
                    </Button>
                    <Button
                        size="lg"
                        className="w-full sm:w-auto font-bold"
                        onClick={handleSubmit}
                        disabled={!isConnected || !isFormValid || isBusy}
                    >
                        {isBusy ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Processing...
                            </>
                        ) : (
                            <>
                                <Rocket className="w-4 h-4 mr-2" />
                                {needsApproval ? "Approve & Post Job" : "Post Job & Lock Funds"}
                            </>
                        )}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}
