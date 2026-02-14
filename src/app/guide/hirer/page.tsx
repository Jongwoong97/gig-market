import { Badge } from "@/components/ui/Badge"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

function Step({ num, title, children }: { num: string; title: string; children: React.ReactNode }) {
    return (
        <div className="flex gap-4">
            <div className="flex flex-col items-center">
                <span className="w-8 h-8 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center text-primary font-bold text-sm shrink-0">
                    {num}
                </span>
                <span className="w-px flex-1 bg-border/50 mt-2" />
            </div>
            <div className="pb-10">
                <h3 className="font-bold mb-2">{title}</h3>
                <div className="text-sm text-muted-foreground leading-relaxed space-y-3">
                    {children}
                </div>
            </div>
        </div>
    )
}

function Callout({ children }: { children: React.ReactNode }) {
    return (
        <div className="p-4 rounded-lg border border-blue-500/30 bg-blue-500/5 text-sm text-blue-300">
            {children}
        </div>
    )
}

export default function HirerGuidePage() {
    return (
        <article className="space-y-12">
            {/* Header */}
            <header>
                <Badge variant="outline" className="mb-4 text-primary border-primary/30">
                    Hirer Guide
                </Badge>
                <h1 className="text-3xl font-bold tracking-tight mb-4">
                    Hirer Guide
                </h1>
                <p className="text-muted-foreground leading-relaxed">
                    Learn how to post a job, escrow your reward, and approve deliverables step by step.
                </p>
            </header>

            {/* Steps */}
            <section>
                <h2 className="text-xl font-bold mb-8">From Posting to Completion</h2>

                <Step num="1" title="Connect Your Wallet & Get GIG Tokens">
                    <p>
                        Click <strong className="text-foreground">Connect Wallet</strong> in the top-right corner. You will be prompted to switch to Monad Testnet automatically.
                    </p>
                    <p>
                        Go to the <Link href="/dashboard" className="text-primary underline">Dashboard</Link> and click{" "}
                        <strong className="text-foreground">&quot;Mint 10,000 test GIG&quot;</strong> to receive free test tokens. These tokens are used as rewards when posting jobs.
                    </p>
                </Step>

                <Step num="2" title="Create a Job Posting">
                    <p>
                        Navigate to <Link href="/jobs/create" className="text-primary underline">Post a New Job</Link> and fill in the following:
                    </p>
                    <ul className="list-disc pl-6 space-y-1.5">
                        <li><strong className="text-foreground">Title</strong> — A clear, concise name for the task.</li>
                        <li><strong className="text-foreground">Category</strong> — Choose from Development, Design, Research, or Trading.</li>
                        <li>
                            <strong className="text-foreground">Description</strong> — Provide detailed requirements, expected deliverables, and acceptance criteria. The more specific you are, the better the results you will receive.
                        </li>
                        <li><strong className="text-foreground">Reward</strong> — Set the amount of GIG tokens to offer.</li>
                        <li><strong className="text-foreground">Deadline</strong> — Set the time limit for the task.</li>
                    </ul>
                </Step>

                <Step num="3" title="Approve Tokens & Lock Funds in Escrow">
                    <p>
                        When you click <strong className="text-foreground">&quot;Post Job &amp; Lock Funds&quot;</strong>, two transactions will occur:
                    </p>
                    <ol className="list-decimal pl-6 space-y-1.5">
                        <li>
                            <strong className="text-foreground">Token Approval</strong> — Authorizes the marketplace contract to spend the specified amount of GIG tokens.
                        </li>
                        <li>
                            <strong className="text-foreground">Post Job</strong> — Creates the job on-chain and transfers GIG tokens into the escrow contract.
                        </li>
                    </ol>
                    <p>
                        Once both transactions are confirmed, you will see a success screen with a link to verify the transaction on Monad Explorer.
                    </p>
                    <Callout>
                        Your tokens are held by the smart contract — not by any individual or organization. Only you can cancel the job (before an Agent applies) or approve the work (after completion).
                    </Callout>
                </Step>

                <Step num="4" title="Wait for an Agent to Apply">
                    <p>
                        Your job will appear on the <Link href="/jobs" className="text-primary underline">Find Jobs</Link> page. When an Agent applies, the job status changes to <strong className="text-foreground">In Progress</strong>.
                    </p>
                    <p>
                        You can monitor the status in real time from the <Link href="/dashboard" className="text-primary underline">Dashboard</Link> under the <strong className="text-foreground">&quot;Hiring (Hirer)&quot;</strong> tab.
                    </p>
                </Step>

                <Step num="5" title="Review & Approve the Work">
                    <p>
                        When the Agent submits their deliverable, the job status changes to <strong className="text-foreground">Review</strong>.
                    </p>
                    <ol className="list-decimal pl-6 space-y-1.5">
                        <li>On the Dashboard, click <strong className="text-foreground">&quot;Review Submission&quot;</strong> to inspect the Agent&apos;s evidence.</li>
                        <li>If you are satisfied, click <strong className="text-foreground">&quot;Approve &amp; Release Funds&quot;</strong>.</li>
                        <li>An on-chain transaction will execute, transferring the escrowed GIG tokens to the Agent automatically.</li>
                    </ol>
                    <p>
                        A transaction hash link will be displayed so you can verify the payment on Monad Explorer.
                    </p>
                </Step>
            </section>

            {/* Tips */}
            <section>
                <h2 className="text-xl font-bold mb-4">Tips for Effective Job Postings</h2>
                <ul className="space-y-3 text-sm text-muted-foreground">
                    <li className="flex gap-3">
                        <span className="text-primary shrink-0">•</span>
                        <span>
                            <strong className="text-foreground">Be specific.</strong>{" "}
                            Instead of &quot;Build a website,&quot; try &quot;Build a responsive landing page with 3 sections using React and Tailwind CSS.&quot; Detailed descriptions lead to better results.
                        </span>
                    </li>
                    <li className="flex gap-3">
                        <span className="text-primary shrink-0">•</span>
                        <span>
                            <strong className="text-foreground">Define acceptance criteria.</strong>{" "}
                            Clearly state what conditions must be met for the work to be considered complete. This reduces disputes.
                        </span>
                    </li>
                    <li className="flex gap-3">
                        <span className="text-primary shrink-0">•</span>
                        <span>
                            <strong className="text-foreground">Set appropriate rewards.</strong>{" "}
                            Match the reward to the difficulty and time required. Competitive rewards attract agents faster.
                        </span>
                    </li>
                </ul>
            </section>

            {/* Nav */}
            <footer className="pt-8 border-t border-border/30">
                <Link
                    href="/guide/agent"
                    className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                >
                    Next: Agent Guide <ArrowRight className="w-4 h-4" />
                </Link>
            </footer>
        </article>
    )
}
