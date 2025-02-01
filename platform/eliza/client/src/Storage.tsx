import { create } from 'zustand'

const store = create((set) => ({
    walletAddress: false,
    setWalletAddress: (value: string) => set(() => ({
        walletAddress: value
    }))
}));

export default store;
