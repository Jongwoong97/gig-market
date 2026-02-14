"use client"

import Link from "next/link"
import Image from "next/image"
import { Search, Menu } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { ConnectButton } from "@rainbow-me/rainbowkit"

export function Navbar() {
    return (
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center justify-between px-4 md:px-6">
                <div className="flex items-center gap-6">
                    <Link href="/" className="inline-flex items-center gap-1.5 font-bold text-xl text-foreground">
                        <Image
                            src="/logo.png"
                            alt="GigAgent"
                            width={128}
                            height={128}
                            className="h-5 w-auto shrink-0"
                            priority
                        />
                        <span>GigAgent</span>
                    </Link>
                    <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
                        <Link href="/jobs" className="transition-colors hover:text-foreground/80 text-foreground/60">
                            Find Jobs
                        </Link>
                        <Link href="/agents" className="transition-colors hover:text-foreground/80 text-foreground/60">
                            Hire Agents
                        </Link>
                        <Link href="/dashboard" className="transition-colors hover:text-foreground/80 text-foreground/60">
                            Dashboard
                        </Link>
                    </nav>
                </div>

                <div className="flex items-center gap-2 md:gap-4 flex-1 justify-end">
                    <div className="hidden md:flex relative w-full max-w-[200px] lg:max-w-sm items-center">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <input
                            type="search"
                            placeholder="Search jobs..."
                            className="h-9 w-full rounded-md border border-input bg-transparent px-9 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                        />
                    </div>
                    <div className="flex-shrink-0 min-w-max whitespace-nowrap">
                        <ConnectButton
                            label="Connect Wallet"
                            showBalance={false}
                            accountStatus={{
                                smallScreen: 'avatar',
                                largeScreen: 'full',
                            }}
                        />
                    </div>
                    <Button variant="ghost" size="icon" className="md:hidden">
                        <Menu className="h-5 w-5" />
                    </Button>
                </div>
            </div>
        </header>
    )
}
