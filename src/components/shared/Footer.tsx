import Link from "next/link"

export function Footer() {
    return (
        <footer className="mt-auto border-t border-border/40 py-6 md:px-8 md:py-0">
            <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
                <p className="text-sm text-muted-foreground">
                    &copy; {new Date().getFullYear()} GigAgent. All rights reserved.
                </p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <Link href="/guide" className="hover:underline">Guide</Link>
                    <Link href="/terms" className="hover:underline">Terms</Link>
                    <Link href="/privacy" className="hover:underline">Privacy</Link>
                </div>
            </div>
        </footer>
    )
}
