import { useQuery } from "@tanstack/react-query";
import { Cog } from "lucide-react";
import PageTitle from "@/components/page-title";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { apiClient } from "@/lib/api";
import { NavLink } from "react-router";
import type { UUID } from "@elizaos/core";
import { formatAgentName } from "@/lib/utils";
import Storage from '../Storage';
import MetaMask from "../components/ui/icons/meta-mask-logo.svg";
import { MetaMaskSDK, SDKProvider } from "@metamask/sdk";
import { useCookies } from "react-cookie";
import { useState } from "react";
import ButtonPayForGame from "@/components/ui/pay-for-game-button";

export default function Home() {
    const { metaMask, walletAddress, setWalletAddress } = Storage();
    const query = useQuery({
        queryKey: ["agents"],
        queryFn: () => apiClient.getAgents(),
        refetchInterval: 5_000
    });
    
    const agents = query?.data?.agents;

    return (
        <div className="flex flex-col gap-4 h-full p-4">
            <PageTitle title="Agents" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {agents?.map((agent: { id: UUID; name: string }) => (
                    <Card key={agent.id}>
                        <CardHeader>
                            <CardTitle>{agent?.name}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="rounded-md bg-muted aspect-square w-full grid place-items-center">
                                <div className="text-6xl font-bold uppercase">
                                    {formatAgentName(agent?.name)}
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <div className="flex items-center gap-4 w-full m-auto justify-center">
                                {walletAddress ? 
                                
                                <ButtonPayForGame className="w-full" agent={agent.id} /> : 
                                
                                <span className="text-center">Connect wallet to proceed</span>
                                
                                }
                            </div>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
}
