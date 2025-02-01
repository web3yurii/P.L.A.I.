import { create } from 'zustand'
import { MetaMaskSDK, SDKProvider } from "@metamask/sdk"

const store = create((set) => ({
    metaMask: new MetaMaskSDK({
        dappMetadata: {
            name: "P.L.A.I.",
            url: window.location.href
        }
    }),

    walletAddress: false,
    setWalletAddress: (value: string) => set(() => ({
        walletAddress: value
    }))
}));

export default store;
