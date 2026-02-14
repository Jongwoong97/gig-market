"use client"

import { JobFilter } from "@/components/features/JobFilter";
import { JobCard } from "@/components/features/JobCard";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Search, Loader2 } from "lucide-react";

import { MOCK_JOBS } from "@/lib/constants";
import { useSearchParams } from "next/navigation";
import { useState, useMemo, Suspense } from "react";
import { formatEther } from "viem";
import {
    useJobCount,
    useJobs,
    JOB_STATUS_LABELS,
    type OnChainJob,
} from "@/lib/hooks/useGigMarketplace";

/** Parse on-chain job into props compatible with JobCard */
function parseOnChainJob(jobId: bigint, job: OnChainJob) {
    let title = `Job #${jobId.toString()}`;
    let category = "General";
    let description = "";
    let tags: string[] = [];

    try {
        if (job.metadataCid.startsWith("data:")) {
            const meta = JSON.parse(job.metadataCid.slice(5));
            title = meta.title || title;
            category = meta.category || category;
            description = meta.description || "";
            if (meta.tags) tags = meta.tags;
        }
    } catch { /* ignore */ }

    const reward = formatEther(job.reward);
    const deadline = new Date(Number(job.deadline) * 1000);
    const diff = deadline.getTime() - Date.now();
    let timeLeft = "Expired";
    if (diff > 0) {
        const h = Math.floor(diff / 3600000);
        const d = Math.floor(h / 24);
        timeLeft = d > 0 ? `${d}d ${h % 24}h` : `${h}h`;
    }

    return {
        id: jobId.toString(),
        title,
        description: description || `On-chain job with ${Number(reward).toLocaleString()} GIG reward`,
        reward: Number(reward).toLocaleString(),
        token: "$GIG",
        tags: tags.length > 0 ? tags : [category],
        hirer: `${job.hirer.slice(0, 6)}...${job.hirer.slice(-4)}`,
        timeLeft,
        status: JOB_STATUS_LABELS[job.status],
        category,
        isOnChain: true,
    };
}

function JobBoardContent() {
    const searchParams = useSearchParams();
    const categoryFilter = searchParams.get("category");
    const [searchQuery, setSearchQuery] = useState("");

    // Fetch on-chain jobs
    const { data: jobCount, isLoading: isCountLoading } = useJobCount();
    const totalJobs = jobCount !== undefined ? Number(jobCount) : 0;

    // Build array of job IDs to fetch
    const jobIds = useMemo(() => {
        const ids: bigint[] = [];
        for (let i = 0; i < totalJobs; i++) {
            ids.push(BigInt(i));
        }
        return ids;
    }, [totalJobs]);

    const { data: onChainJobs, isLoading: isJobsLoading } = useJobs(jobIds);

    // Parse on-chain jobs into display format
    const parsedOnChainJobs = useMemo(() => {
        if (!onChainJobs) return [];
        return onChainJobs
            .map((job, i) => parseOnChainJob(jobIds[i], job))
            // Only show non-cancelled jobs
            .filter((j) => j.status !== "Cancelled");
    }, [onChainJobs, jobIds]);

    // Combine: on-chain jobs first, then mock jobs
    const allJobs = useMemo(() => {
        const mockWithFlag = MOCK_JOBS.map((j) => ({ ...j, isOnChain: false, status: (j as { status?: string }).status || "Open" }));
        return [...parsedOnChainJobs, ...mockWithFlag];
    }, [parsedOnChainJobs]);

    // Filter
    const filteredJobs = allJobs.filter((job) => {
        const matchesCategory =
            !categoryFilter ||
            job.category === categoryFilter ||
            job.tags.some((t) => t.toLowerCase() === categoryFilter.toLowerCase());
        const matchesSearch =
            !searchQuery ||
            job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            job.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            job.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));

        return matchesCategory && matchesSearch;
    });

    const isLoading = isCountLoading || isJobsLoading;

    return (
        <div className="container py-8 px-4 md:px-6">
            <div className="flex flex-wrap gap-8">
                {/* Sidebar Filters */}
                <aside className="w-full min-[700px]:w-60 flex-shrink-0">
                    <JobFilter />
                </aside>

                {/* Main Content */}
                <div className="flex-1 min-w-0">
                    <div className="mb-6">
                        <div className="flex flex-wrap items-center gap-3 mb-4">
                            <h1 className="text-3xl font-bold">
                                {categoryFilter ? `${categoryFilter} Gigs` : "Find a Job"}
                            </h1>
                            {totalJobs > 0 && (
                                <Badge variant="secondary" className="text-xs">
                                    {totalJobs} on-chain
                                </Badge>
                            )}
                        </div>
                        <div className="relative">
                            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                                className="pl-9 h-10 w-full md:max-w-md"
                                placeholder="Search by title, skill, or keyword..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>

                    {isLoading && (
                        <div className="flex items-center justify-center py-12 gap-2 text-muted-foreground">
                            <Loader2 className="w-5 h-5 animate-spin" />
                            <span>Loading on-chain jobs...</span>
                        </div>
                    )}

                    {!isLoading && filteredJobs.length > 0 ? (
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 320px), 1fr))", gap: "1.5rem" }}>
                            {filteredJobs.map((job) => (
                                <JobCard
                                    key={`${job.isOnChain ? "chain" : "mock"}-${job.id}`}
                                    id={job.id}
                                    title={job.title}
                                    description={job.description}
                                    reward={job.reward}
                                    token={job.token}
                                    tags={job.tags}
                                    hirer={job.hirer}
                                    timeLeft={job.timeLeft}
                                    category={job.category}
                                    isOnChain={job.isOnChain}
                                />
                            ))}
                        </div>
                    ) : !isLoading ? (
                        <div className="py-20 text-center border rounded-xl border-dashed bg-muted/20">
                            <p className="text-muted-foreground text-lg mb-2">No jobs found matching your criteria.</p>
                            <Button variant="link" onClick={() => window.location.href = "/jobs"}>
                                Clear all filters
                            </Button>
                        </div>
                    ) : null}

                    {!isLoading && filteredJobs.length > 0 && (
                        <div className="mt-8 flex justify-center">
                            <Button variant="outline">Load More</Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function JobBoard() {
    return (
        <Suspense fallback={<div className="container py-20 text-center">Loading Gigs...</div>}>
            <JobBoardContent />
        </Suspense>
    );
}
