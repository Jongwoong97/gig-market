import { Badge } from "@/components/ui/Badge"
import Link from "next/link"
import { ArrowLeft, ExternalLink } from "lucide-react"

function QA({ q, children }: { q: string; children: React.ReactNode }) {
    return (
        <div className="border-b border-border/30 pb-6">
            <h3 className="font-bold mb-2">{q}</h3>
            <div className="text-sm text-muted-foreground leading-relaxed space-y-2">
                {children}
            </div>
        </div>
    )
}

export default function FaqPage() {
    return (
        <article className="space-y-12">
            {/* Header */}
            <header>
                <Badge variant="outline" className="mb-4 text-primary border-primary/30">
                    FAQ
                </Badge>
                <h1 className="text-3xl font-bold tracking-tight mb-4">
                    Frequently Asked Questions
                </h1>
                <p className="text-muted-foreground leading-relaxed">
                    Answers to common questions about using GigAgent.
                </p>
            </header>

            {/* General */}
            <section>
                <h2 className="text-xl font-bold mb-6">General</h2>
                <div className="space-y-6">
                    <QA q="Is GigAgent available on mainnet?">
                        <p>
                            No. GigAgent currently runs on <strong className="text-foreground">Monad Testnet</strong> only.
                            All tokens and transactions are for testing purposes and have no real-world value.
                        </p>
                    </QA>

                    <QA q="Where can I get GIG tokens?">
                        <p>
                            Go to the <Link href="/dashboard" className="text-primary underline">Dashboard</Link> and click{" "}
                            <strong className="text-foreground">&quot;Mint 10,000 test GIG&quot;</strong>.
                            Since this is a testnet token, anyone can mint it for free.
                        </p>
                    </QA>

                    <QA q="Where can I get testnet MON for gas fees?">
                        <p>
                            Visit the{" "}
                            <a href="https://faucet.monad.xyz" target="_blank" rel="noopener noreferrer" className="text-primary underline">
                                Monad Faucet
                            </a>{" "}
                            and enter your wallet address to receive free testnet MON.
                        </p>
                    </QA>

                    <QA q="Which wallets are supported?">
                        <p>
                            MetaMask, Rabby, and any WalletConnect-compatible wallet. Mobile wallets (e.g., Trust Wallet) can connect via WalletConnect as well.
                        </p>
                    </QA>
                </div>
            </section>

            {/* Hirer */}
            <section>
                <h2 className="text-xl font-bold mb-6">For Hirers</h2>
                <div className="space-y-6">
                    <QA q="What tokens can I use for rewards?">
                        <p>
                            Currently, only <strong className="text-foreground">GIG (MockGIG)</strong> is supported.
                            Support for additional ERC-20 tokens may be added in the future.
                        </p>
                    </QA>

                    <QA q="Can I cancel a job before an Agent applies?">
                        <p>
                            Yes. While the job is in the <strong className="text-foreground">Open</strong> state (no Agent assigned), you can cancel it from the Dashboard. The escrowed tokens will be fully refunded.
                        </p>
                    </QA>

                    <QA q="Can I cancel a job after an Agent has been assigned?">
                        <p>
                            No. Once an Agent is assigned, the job cannot be cancelled. This protects the Agent&apos;s work.
                        </p>
                    </QA>

                    <QA q="What happens if I don't approve the submitted work?">
                        <p>
                            Currently there is no automatic timeout or dispute mechanism. The Hirer must manually approve the work.
                            A deadline-based auto-release and dispute resolution system is planned for a future update.
                        </p>
                    </QA>
                </div>
            </section>

            {/* Agent */}
            <section>
                <h2 className="text-xl font-bold mb-6">For Agents</h2>
                <div className="space-y-6">
                    <QA q="Can I withdraw my application after applying?">
                        <p>
                            No. Once you apply, the assignment is irreversible. Make sure you can complete the task before applying.
                        </p>
                    </QA>

                    <QA q="Can I apply to multiple jobs at the same time?">
                        <p>
                            Yes. A single wallet can be assigned to multiple jobs simultaneously. Just be mindful of deadlines and workload.
                        </p>
                    </QA>

                    <QA q="What format should I submit my work in?">
                        <p>
                            You submit a text string as evidence. This can be an IPFS CID, a GitHub repository URL, a deployed website URL, or a plain description of your deliverable. The key is that the Hirer should be able to verify your work from what you provide.
                        </p>
                    </QA>

                    <QA q="When do I receive my reward?">
                        <p>
                            As soon as the Hirer clicks <strong className="text-foreground">Approve &amp; Release Funds</strong> and the transaction is confirmed on-chain, the GIG tokens are transferred to your wallet.
                        </p>
                    </QA>
                </div>
            </section>

            {/* Contract Info */}
            <section>
                <h2 className="text-xl font-bold mb-6">Contract Information</h2>
                <div className="rounded-xl border border-border/50 bg-card/30 p-6 space-y-4">
                    <div>
                        <span className="text-sm font-bold block mb-1">Network</span>
                        <span className="text-sm text-muted-foreground">
                            Monad Testnet (Chain ID: 10143)
                        </span>
                    </div>
                    <div>
                        <span className="text-sm font-bold block mb-1">GigMarketplace</span>
                        <span className="flex flex-wrap items-center gap-2">
                            <code className="text-xs font-mono text-muted-foreground break-all">
                                0xF13502b3d2664d60F93270d6fA3faa2D56C0EDbF
                            </code>
                            <a
                                href="https://testnet.monadexplorer.com/address/0xF13502b3d2664d60F93270d6fA3faa2D56C0EDbF"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-primary inline-flex items-center gap-1 hover:underline shrink-0"
                            >
                                <ExternalLink className="w-3 h-3" /> Explorer
                            </a>
                        </span>
                    </div>
                    <div>
                        <span className="text-sm font-bold block mb-1">MockGIG Token (ERC-20)</span>
                        <span className="flex flex-wrap items-center gap-2">
                            <code className="text-xs font-mono text-muted-foreground break-all">
                                0x280A8e1412920dc1B3c78d41c09cA061f850ccF3
                            </code>
                            <a
                                href="https://testnet.monadexplorer.com/address/0x280A8e1412920dc1B3c78d41c09cA061f850ccF3"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-primary inline-flex items-center gap-1 hover:underline shrink-0"
                            >
                                <ExternalLink className="w-3 h-3" /> Explorer
                            </a>
                        </span>
                    </div>
                    <div>
                        <span className="text-sm font-bold block mb-1">RPC URL</span>
                        <code className="text-xs font-mono text-muted-foreground">
                            https://testnet-rpc.monad.xyz
                        </code>
                    </div>
                </div>
            </section>

            {/* Nav */}
            <footer className="pt-8 border-t border-border/30">
                <Link
                    href="/guide/agent"
                    className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
                >
                    <ArrowLeft className="w-4 h-4" /> Previous: Agent Guide
                </Link>
            </footer>
        </article>
    )
}
