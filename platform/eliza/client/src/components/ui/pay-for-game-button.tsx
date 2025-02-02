import { useCookies } from "react-cookie";
import { Button } from "./button";
import { useState } from "react";
import Storage from '../../Storage';
import { ethers } from "ethers";

const DEAI_TOKEN_ADDRESS = "0xd740D6fC8C6A45c222ABb5D1B13Ff7053a299762";
const GAME_WALLET_ADDRESS = "0x50b29758C5793b694af6Cf7909cA7727149ce5A5";
const TOKEN_ABI = [
  "function transfer(address to, uint256 amount) public returns (bool)"
];

export default function ButtonPayForGame(props: any) {
    const [cookies, setCookie, removeCookie] = useCookies(['is_game_paid', 'payment_in_process']);
    const [loading, setLoading] = useState(false);
    const { walletAddress, metaMask } = Storage();
    const { is_game_paid, payment_in_process } = cookies;
    const { agent, className } = props;
    const game_paid = is_game_paid?.status && is_game_paid?.walletAddress === walletAddress;
    
    const startGame = async (agentId: any) => {
        if ( ! window.ethereum ) {
            alert("Set up MetaMask!");
            return;
        }

        if ( is_game_paid ) {
            window.location.href = `/chat/${agentId}`;
        } else {
            try {
                setCookie('payment_in_process', true);
    
                const ethereum = metaMask.getProvider();
    
                // Request account access
                await ethereum.request({ method: 'eth_requestAccounts' });
                const accounts = await ethereum.request({ method: 'eth_accounts' });
    
                // Create an Ethers provider and signer
                const provider = new ethers.BrowserProvider(window.ethereum);
                const signer = await provider.getSigner();
    
                // Instantiate the contract
                const tokenContract = new ethers.Contract(DEAI_TOKEN_ADDRESS, TOKEN_ABI, signer);
    
                const amount = ethers.parseUnits("10", 18); 
    
                const tx = await tokenContract.transfer(GAME_WALLET_ADDRESS, amount);
    
                await tx.wait();
    
                // Set a cookie that expires in 2 hours
                setCookie('is_game_paid', {
                    status: true,
                    walletAddress: walletAddress
                }, { path: '/', expires: new Date(Date.now() + 2 * 60 * 60 * 1000) });
                window.location.href = `/chat/${agentId}`;
            } catch (error) {
                console.error("Transaction error:", error);
            } finally {
                removeCookie("payment_in_process", {path: '/'});
            }
        }
    };

    return payment_in_process ? <span>Payment in process...</span> : <Button
                variant="outline"
                onClick={() => startGame(agent)}
                className={className}
            >{game_paid ? 'Chat' : 'Pay to chat'}</Button>
}