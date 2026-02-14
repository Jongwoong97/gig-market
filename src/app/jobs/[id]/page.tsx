"use client"

import { use, useMemo } from "react"
import { useAccount } from "wagmi"
import { formatEther } from "viem"
import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/Badge"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/Card"
import { Clock, ShieldCheck, Globe, ArrowLeft, Share2, Loader2, AlertCircle, CheckCircle2 } from "lucide-react"
import Link from "next/link"
import { MOCK_JOBS } from "@/lib/constants"
import ReactMarkdown from "react-markdown"
import Image from "next/image"
import { useJob, useApplyToJob, JOB_STATUS_LABELS } from "@/lib/hooks/useGigMarketplace"
import { TxLink } from "@/components/shared/TxLink"

export default function JobDetails({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params)
    const { address, isConnected } = useAccount()

    // Try to load on-chain data for numeric IDs
    const isOnChainId = /^\d+$/.test(id)
    const jobId = isOnChainId ? BigInt(id) : undefined
    const { data: onChainJob, isLoading: isOnChainLoading } = useJob(jobId)

    // Apply hook
    const {
        applyToJob,
        hash: applyHash,
        isPending: isApplying,
        isConfirming: isApplyConfirming,
        isSuccess: isApplySuccess,
        error: applyError,
    } = useApplyToJob()

    // Fallback to mock data for non-numeric IDs
    const mockJob = MOCK_JOBS.find((j) => j.id === id) || MOCK_JOBS[0]

    // Determine which data to display
    const isOnChain = isOnChainId && !!onChainJob
    const isApplyBusy = isApplying || isApplyConfirming

    // Parse on-chain metadata
    const onChainMeta = useMemo(() => {
        if (!onChainJob?.metadataCid) return null
        try {
            if (onChainJob.metadataCid.startsWith("data:")) {
                return JSON.parse(onChainJob.metadataCid.slice(5)) as {
                    title?: string
                    category?: string
                    description?: string
                }
            }
        } catch {
            // ignore parse errors
        }
        return null
    }, [onChainJob?.metadataCid])

    // Resolved display values
    const title = isOnChain ? (onChainMeta?.title || `Job #${id}`) : mockJob.title
    const description = isOnChain ? (onChainMeta?.description || onChainJob?.metadataCid || "") : mockJob.description
    const category = isOnChain ? (onChainMeta?.category || "General") : (mockJob.category || "General")
    const reward = isOnChain ? formatEther(onChainJob!.reward) : mockJob.reward
    const token = isOnChain ? "$GIG" : mockJob.token
    const status = isOnChain ? JOB_STATUS_LABELS[onChainJob!.status] : ((mockJob as { status?: string }).status || "Open")
    const hirer = isOnChain ? `${onChainJob!.hirer.slice(0, 6)}...${onChainJob!.hirer.slice(-4)}` : mockJob.hirer
    const isOpen = isOnChain ? onChainJob!.status === 0 : status === "Open"
    const isHirer = isOnChain && address ? onChainJob!.hirer.toLowerCase() === address.toLowerCase() : false
    const deadline = isOnChain ? new Date(Number(onChainJob!.deadline) * 1000) : null

    const timeLeftStr = deadline
        ? (() => {
              const diff = deadline.getTime() - Date.now()
              if (diff <= 0) return "Expired"
              const h = Math.floor(diff / 3600000)
              const d = Math.floor(h / 24)
              return d > 0 ? `${d}d ${h % 24}h` : `${h}h`
          })()
        : mockJob.timeLeft

    // Loading state for on-chain
    if (isOnChainId && isOnChainLoading) {
        return (
            <div className="container py-16 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <div className="container py-8 px-4 md:px-6">
            <Link href="/jobs" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
                <ArrowLeft className="w-4 h-4" /> Back to Jobs
            </Link>

            <div className="flex flex-wrap gap-8">
                {/* Left Column: Job Description */}
                <div className="flex-1 min-w-0 space-y-8">
                    {/* Header */}
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            {isOnChain && (
                                <Badge variant="outline" className="text-green-400 border-green-500/50 bg-green-500/5">
                                    On-Chain
                                </Badge>
                            )}
                            <Badge variant="outline" className={`${isOpen ? "text-primary border-primary/50 bg-primary/5" : "text-muted-foreground"}`}>
                                {status}
                            </Badge>
                            <Badge variant="secondary">{category}</Badge>
                        </div>
                        <h1 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight leading-tight">{title}</h1>
                        <div className="flex flex-wrap items-center gap-4 text-muted-foreground text-sm">
                            <div className="flex items-center gap-1">
                                <ShieldCheck className="w-4 h-4 text-green-500" />
                                <span>{isOnChain ? "Escrow Verified" : "Payment Verified"}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Globe className="w-4 h-4" />
                                <span>Remote</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                <span>{isOnChain ? `Deadline: ${timeLeftStr}` : `Posted 2 hours ago`}</span>
                            </div>
                        </div>
                    </div>

                    {/* Banner Image (only for mock jobs) */}
                    {!isOnChain && (
                        <div className="relative w-full h-64 md:h-96 rounded-2xl overflow-hidden border border-border/50 bg-muted shadow-2xl">
                            {mockJob.coverImage ? (
                                <Image
                                    src={mockJob.coverImage}
                                    alt={title}
                                    fill
                                    className="object-cover"
                                    priority
                                />
                            ) : (
                                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-secondary/20 flex items-center justify-center">
                                    <p className="text-muted-foreground font-medium italic">No cover image available</p>
                                </div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent pointer-events-none" />
                        </div>
                    )}

                    {/* Content */}
                    <div className="prose prose-invert max-w-none">
                        <div className="rounded-2xl border border-border/30 bg-card/30 backdrop-blur-sm p-6 md:p-10 shadow-sm leading-relaxed text-balance">
                            <ReactMarkdown
                                components={{
                                    h1: ({ node, ...props }) => <h1 className="text-2xl font-bold mb-4 mt-8 text-foreground" {...props} />,
                                    h2: ({ node, ...props }) => <h2 className="text-xl font-bold mb-3 mt-6 text-foreground border-b border-border/50 pb-2" {...props} />,
                                    h3: ({ node, ...props }) => <h3 className="text-lg font-bold mb-2 mt-4 text-foreground/90" {...props} />,
                                    p: ({ node, ...props }) => <p className="mb-4 text-muted-foreground/90 leading-relaxed" {...props} />,
                                    ul: ({ node, ...props }) => <ul className="list-disc pl-6 mb-4 space-y-2 text-muted-foreground/90" {...props} />,
                                    li: ({ node, ...props }) => <li className="pl-1" {...props} />,
                                    strong: ({ node, ...props }) => <strong className="text-foreground font-semibold" {...props} />,
                                    code: ({ node, ...props }) => <code className="bg-muted px-1.5 py-0.5 rounded text-sm text-primary font-mono" {...props} />,
                                }}
                            >
                                {description}
                            </ReactMarkdown>
                        </div>
                    </div>

                    {/* On-chain evidence (if work was submitted) */}
                    {isOnChain && onChainJob!.evidenceCid && (
                        <div className="rounded-2xl border border-border/30 bg-card/30 p-6">
                            <h3 className="font-bold mb-2">Work Evidence</h3>
                            <p className="text-sm text-muted-foreground break-all">{onChainJob!.evidenceCid}</p>
                        </div>
                    )}
                </div>

                {/* Right Column: Sticky Sidebar */}
                <div className="w-full min-[900px]:w-96 flex-shrink-0">
                    <div className="sticky top-24 space-y-6">
                        <Card className="border-primary/20 shadow-xl shadow-primary/5 overflow-hidden">
                            <div className="h-2 bg-gradient-to-r from-primary via-secondary to-accent" />
                            <CardHeader>
                                <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Total Reward</CardTitle>
                                <div className="text-5xl font-extrabold text-primary flex items-baseline gap-2 mt-2">
                                    {Number(reward).toLocaleString()} <span className="text-2xl text-foreground font-bold">{token}</span>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4 pt-4">
                                {/* Apply Button */}
                                {isOpen && !isHirer && (
                                    <Button
                                        size="lg"
                                        className="w-full font-bold text-lg h-14 shadow-lg shadow-primary/20 active:scale-95 transition-transform"
                                        onClick={() => isOnChain && jobId !== undefined && applyToJob(jobId)}
                                        disabled={!isConnected || isApplyBusy || isApplySuccess || !isOnChain}
                                    >
                                        {isApplyBusy ? (
                                            <>
                                                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                                {isApplyConfirming ? "Confirming..." : "Signing..."}
                                            </>
                                        ) : isApplySuccess ? (
                                            "Applied!"
                                        ) : (
                                            "Apply Now"
                                        )}
                                    </Button>
                                )}

                                {!isOpen && (
                                    <Badge variant="secondary" className="w-full justify-center py-3 text-base">
                                        {status}
                                    </Badge>
                                )}

                                {isHirer && isOpen && (
                                    <p className="text-center text-sm text-muted-foreground">
                                        This is your job posting.
                                    </p>
                                )}

                                {/* Apply success tx link */}
                                {isApplySuccess && applyHash && (
                                    <div className="flex items-center gap-3 p-3 rounded-lg border border-green-500/30 bg-green-500/5">
                                        <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                                        <div>
                                            <p className="text-sm font-medium text-green-400 mb-1">Applied successfully!</p>
                                            <TxLink hash={applyHash} label="View on Monad Explorer" />
                                        </div>
                                    </div>
                                )}

                                {/* Apply error */}
                                {applyError && (
                                    <div className="flex items-start gap-2 p-3 rounded-lg border border-red-500/30 bg-red-500/5 text-red-400 text-xs">
                                        <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                                        <span>{applyError.message?.slice(0, 150)}</span>
                                    </div>
                                )}

                                <div className="grid grid-cols-2 gap-3">
                                    <Button variant="outline" className="w-full">Save</Button>
                                    <Button variant="outline" className="w-full flex items-center gap-2">
                                        <Share2 className="w-4 h-4" /> Share
                                    </Button>
                                </div>

                                <div className="pt-6 border-t border-border/50 space-y-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-muted-foreground text-sm">Time Left</span>
                                        <Badge variant="outline" className="font-mono">{timeLeftStr}</Badge>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-muted-foreground text-sm">Status</span>
                                        <Badge variant="secondary" className="font-bold">{status}</Badge>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-muted-foreground text-sm">Escrow Status</span>
                                        <div className="flex items-center gap-1 font-bold text-green-400 text-sm">
                                            <ShieldCheck className="w-4 h-4" /> {isOnChain ? "On-Chain" : "Secured"}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className="bg-muted/30 py-4 flex justify-center border-t border-border/30">
                                <Link href="#" className="underline text-xs text-muted-foreground hover:text-primary transition-colors">
                                    Learn about trustless escrow
                                </Link>
                            </CardFooter>
                        </Card>

                        {/* Hirer Profile */}
                        <Card className="border-border/50">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm text-muted-foreground font-medium">ABOUT THE HIRER</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 via-accent to-pink-500 p-[1px]">
                                        <div className="w-full h-full rounded-2xl bg-background flex items-center justify-center overflow-hidden">
                                            <div className="text-lg font-bold">{hirer.slice(0, 2).toUpperCase()}</div>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="font-bold text-lg">{hirer}</div>
                                        {isOnChain && (
                                            <div className="text-xs text-muted-foreground font-mono">
                                                {onChainJob!.hirer}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                {isOnChain && onChainJob!.agent !== "0x0000000000000000000000000000000000000000" && (
                                    <div className="mt-4 p-3 rounded-lg bg-muted/30 border border-border/50 text-sm">
                                        <span className="text-muted-foreground">Assigned Agent: </span>
                                        <span className="font-mono text-xs">{onChainJob!.agent}</span>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}
