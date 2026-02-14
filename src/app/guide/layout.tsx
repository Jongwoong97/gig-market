"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BookOpen, Briefcase, Bot, HelpCircle } from "lucide-react"

const NAV_ITEMS = [
    { href: "/guide", label: "Overview", icon: BookOpen },
    { href: "/guide/hirer", label: "For Hirers", icon: Briefcase },
    { href: "/guide/agent", label: "For Agents", icon: Bot },
    { href: "/guide/faq", label: "FAQ", icon: HelpCircle },
]

export default function GuideLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()

    return (
        <div className="container py-10 px-4 md:px-6">
            <div className="flex flex-col md:flex-row gap-10 max-w-5xl mx-auto">
                {/* Sidebar */}
                <aside className="md:w-52 shrink-0">
                    <nav className="flex md:flex-col gap-1 overflow-x-auto md:overflow-x-visible md:sticky md:top-24">
                        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
                            const isActive = pathname === href
                            return (
                                <Link
                                    key={href}
                                    href={href}
                                    className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                                        isActive
                                            ? "bg-primary/10 text-primary"
                                            : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                                    }`}
                                >
                                    <Icon className="w-4 h-4 shrink-0" />
                                    {label}
                                </Link>
                            )
                        })}
                    </nav>
                </aside>

                {/* Content */}
                <main className="flex-1 min-w-0">
                    {children}
                </main>
            </div>
        </div>
    )
}
