"use client";

import * as React from "react";
import "@rainbow-me/rainbowkit/styles.css";
import {
    RainbowKitProvider,
    getDefaultConfig,
    darkTheme,
} from "@rainbow-me/rainbowkit";
import {
    argentWallet,
    trustWallet,
    ledgerWallet,
} from "@rainbow-me/rainbowkit/wallets";
import {
    base,
    mainnet,
    optimism,
    arbitrum,
    polygon,
} from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import type { Chain } from "viem";

const monadTestnet = {
    id: 10143,
    name: "Monad Testnet",
    nativeCurrency: {
        decimals: 18,
        name: "Monad",
        symbol: "MON",
    },
    rpcUrls: {
        default: { http: ["https://testnet-rpc.monad.xyz"] },
    },
    blockExplorers: {
        default: { name: "Monad Explorer", url: "https://testnet.monadexplorer.com" },
    },
    testnet: true,
} as const satisfies Chain;

const config = getDefaultConfig({
    appName: "GigAgent",
    projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "b4e4f559eb3d4f9abc78014081b1e837",
    wallets: [
        {
            groupName: "More",
            wallets: [argentWallet, trustWallet, ledgerWallet],
        },
    ],
    chains: [
        monadTestnet,
        mainnet,
        polygon,
        optimism,
        arbitrum,
        base,
    ],
    ssr: true,
});

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
                <RainbowKitProvider
                    theme={darkTheme({
                        accentColor: "#8b5cf6",
                        accentColorForeground: "white",
                        borderRadius: "medium",
                    })}
                >
                    {children}
                </RainbowKitProvider>
            </QueryClientProvider>
        </WagmiProvider>
    );
}
