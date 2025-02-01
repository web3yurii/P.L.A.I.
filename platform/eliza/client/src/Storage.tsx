import { create } from 'zustand'

const store = create((set) => ({
  loggedIn: false,
  setLoggedIn: (value: string) => set(() => ({
    loggedIn: value
  }))
}));

export default store;
