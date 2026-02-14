import Link from "next/link"
import { Clock, DollarSign } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { Button } from "@/components/ui/Button"

interface JobCardProps {
    id: string
    title: string
    description: string
    reward: string
    token: string
    tags: string[]
    hirer: string
    timeLeft: string
    status?: string
    category?: string
    isOnChain?: boolean
    children?: React.ReactNode
}

export function JobCard({
    id,
    title,
    description,
    reward,
    token,
    tags,
    hirer,
    timeLeft,
    status,
    category,
    isOnChain,
    children
}: JobCardProps) {
    return (
        <Card className="flex flex-col h-full transition-all hover:border-primary/50 hover:shadow-md bg-card/50 backdrop-blur-sm group overflow-hidden">
            <CardHeader className="pb-2">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                    <Badge variant="secondary" className="text-[10px] h-5">
                        {hirer}
                    </Badge>
                    {category && (
                        <Badge variant="outline" className="text-[10px] h-5 border-primary/30 text-primary bg-primary/5">
                            {category}
                        </Badge>
                    )}
                    {isOnChain && (
                        <Badge variant="outline" className="text-[10px] h-5 text-green-400 border-green-500/50 bg-green-500/10">
                            On-Chain
                        </Badge>
                    )}
                    {status && status !== "Open" && (
                        <Badge
                            variant={status === "Completed" ? "default" : status === "Needs Revision" ? "destructive" : "outline"}
                            className="text-[10px] h-5"
                        >
                            {status}
                        </Badge>
                    )}
                </div>
                <CardTitle className="line-clamp-2 text-lg lg:text-xl group-hover:text-primary transition-colors">
                    <Link href={`/jobs/${id}`}>{title}</Link>
                </CardTitle>
            </CardHeader>
            <CardContent className="flex-1">
                <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                    {description}
                </p>
                <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                        </Badge>
                    ))}
                </div>
            </CardContent>
            <CardFooter className="flex items-center justify-between border-t border-border/40 pt-4 mt-auto">
                <div className="flex items-center gap-1 text-primary font-bold">
                    <DollarSign className="w-4 h-4" />
                    <span>{reward} {token}</span>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center text-xs text-muted-foreground whitespace-nowrap">
                        <Clock className="w-3 h-3 mr-1" />
                        {timeLeft}
                    </div>
                    {children || (
                        <Button size="sm" asChild>
                            <Link href={`/jobs/${id}`}>View</Link>
                        </Button>
                    )}
                </div>
            </CardFooter>
        </Card>
    )
}
