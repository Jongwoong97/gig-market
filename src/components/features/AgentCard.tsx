import { Star, CheckCircle2, Clock, Briefcase, TrendingUp } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { Button } from "@/components/ui/Button"
import type { Agent } from "@/lib/types"

const statusConfig = {
    Available: { label: "Available", className: "bg-green-500/15 text-green-500 border-green-500/30" },
    Busy: { label: "Busy", className: "bg-yellow-500/15 text-yellow-500 border-yellow-500/30" },
    Offline: { label: "Offline", className: "bg-muted text-muted-foreground border-border" },
} as const;

export function AgentCard({ agent }: { agent: Agent }) {
    const status = statusConfig[agent.status];

    return (
        <Card className="flex flex-col h-full transition-all hover:border-primary/50 hover:shadow-md bg-card/50 backdrop-blur-sm group overflow-hidden">
            <CardHeader className="pb-3">
                <div className="flex items-start gap-4">
                    {/* Avatar */}
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${agent.gradientFrom} ${agent.gradientTo} flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-105 transition-transform`}>
                        <span className="text-white font-bold text-lg">{agent.initials}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-bold text-lg truncate group-hover:text-primary transition-colors">
                                {agent.name}
                            </h3>
                            <Badge variant="outline" className={`text-[10px] h-5 flex-shrink-0 ${status.className}`}>
                                {status.label}
                            </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2 leading-snug">
                            {agent.tagline}
                        </p>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="flex-1 space-y-4">
                {/* Skills */}
                <div className="flex flex-wrap gap-1.5">
                    {agent.skills.map((skill) => (
                        <Badge key={skill} variant="outline" className="text-[11px] font-normal">
                            {skill}
                        </Badge>
                    ))}
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center gap-2 text-sm">
                        <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500 flex-shrink-0" />
                        <span className="font-semibold">{agent.rating}</span>
                        <span className="text-muted-foreground text-xs">rating</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                        <Briefcase className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                        <span className="font-semibold">{agent.completedJobs}</span>
                        <span className="text-muted-foreground text-xs">jobs</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
                        <span className="font-semibold">{agent.successRate}%</span>
                        <span className="text-muted-foreground text-xs">success</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                        <Clock className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                        <span className="font-semibold">{agent.avgDelivery}</span>
                        <span className="text-muted-foreground text-xs">avg</span>
                    </div>
                </div>
            </CardContent>

            <CardFooter className="flex items-center justify-between border-t border-border/40 pt-4 mt-auto">
                <div className="flex items-center gap-1 text-sm">
                    <TrendingUp className="w-3.5 h-3.5 text-primary" />
                    <span className="font-bold text-primary">{agent.totalEarned}</span>
                    <span className="text-muted-foreground text-xs">$GIG earned</span>
                </div>
                <Button size="sm" variant={agent.status === "Available" ? "default" : "outline"}>
                    {agent.status === "Available" ? "Hire" : "View Profile"}
                </Button>
            </CardFooter>
        </Card>
    )
}
