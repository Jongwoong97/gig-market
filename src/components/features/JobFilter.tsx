
"use client"

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Filter } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { CATEGORIES } from "@/lib/constants";
import { useRouter, useSearchParams } from "next/navigation";

export function JobFilter() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const currentCategory = searchParams.get("category") || "All";

    const handleCategoryChange = (category: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (category === "All") {
            params.delete("category");
        } else {
            params.set("category", category);
        }
        router.push(`/jobs?${params.toString()}`);
    };

    const clearFilters = () => {
        router.push("/jobs");
    };

    return (
        <Card className="h-fit sticky top-24">
            <CardHeader>
                <CardTitle className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                        <Filter className="w-4 h-4" /> Filters
                    </div>
                    {(searchParams.toString() !== "") && (
                        <Button variant="ghost" size="sm" onClick={clearFilters} className="h-7 px-2 text-xs">
                            Clear
                        </Button>
                    )}
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-2">
                    <label className="text-sm font-medium">Category</label>
                    <div className="flex flex-col gap-1">
                        <label className="flex items-center gap-2 text-sm text-balance hover:text-foreground cursor-pointer py-1 px-2 rounded-md transition-colors hover:bg-muted/50">
                            <input
                                type="radio"
                                name="category"
                                checked={currentCategory === "All"}
                                onChange={() => handleCategoryChange("All")}
                                className="rounded-full border-input text-primary focus:ring-primary"
                            />
                            All Categories
                        </label>
                        {CATEGORIES.map((cat) => (
                            <label key={cat.id} className={`flex items-center gap-2 text-sm text-balance hover:text-foreground cursor-pointer py-1 px-2 rounded-md transition-colors ${currentCategory === cat.name ? "bg-primary/10 text-primary" : "hover:bg-muted/50"}`}>
                                <input
                                    type="radio"
                                    name="category"
                                    checked={currentCategory === cat.name}
                                    onChange={() => handleCategoryChange(cat.name)}
                                    className="rounded-full border-input text-primary focus:ring-primary"
                                />
                                {cat.name}
                            </label>
                        ))}
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Reward Range ($GIG)</label>
                    <div className="flex items-center gap-2">
                        <Input type="number" placeholder="Min" className="h-8" />
                        <span>-</span>
                        <Input type="number" placeholder="Max" className="h-8" />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Verification</label>
                    <div className="flex flex-wrap gap-2">
                        <Badge variant="outline" className="cursor-pointer hover:bg-primary/20 hover:text-primary transition-colors">KYC Verified</Badge>
                        <Badge variant="outline" className="cursor-pointer hover:bg-primary/20 hover:text-primary transition-colors">Pro Agent</Badge>
                    </div>
                </div>

                <Button className="w-full">Update Search</Button>
            </CardContent>
        </Card>
    );
}
