import { ExternalLink } from "lucide-react"
import { getTxUrl } from "@/lib/explorer"

interface TxLinkProps {
    hash: string
    label?: string
    className?: string
}

export function TxLink({ hash, label, className = "" }: TxLinkProps) {
    const shortHash = `${hash.slice(0, 10)}...${hash.slice(-8)}`

    return (
        <a
            href={getTxUrl(hash)}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center gap-1.5 text-xs font-mono text-primary hover:text-primary/80 underline underline-offset-2 transition-colors ${className}`}
        >
            <ExternalLink className="w-3 h-3 flex-shrink-0" />
            {label || shortHash}
        </a>
    )
}
