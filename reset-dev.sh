#!/bin/bash
echo "🚀 Resetting GigMarket Dev Environment..."

# 1. Kill any existing next or node processes related to this project
echo "Killing zombie processes..."
pkill -9 -f "next" || true
pkill -9 -f "node" || true

# 2. Clear Next.js cache and lock files
echo "Clearing cache and lock files..."
rm -rf .next
rm -f .next/dev/lock

# 3. Check if port 3000 is clear (if fuser/lsof were available, we'd check here)
# Since they aren't, we rely on the pkill.

echo "✅ Environment Reset! You can now run:"
echo "npm run dev"
