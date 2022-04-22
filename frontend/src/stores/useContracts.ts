import create from "zustand";
import { FluidoFactory } from "../contracts/typechain/FluidoFactory";

interface ContractStore {
  factory: FluidoFactory | undefined;
  setFactory: (contract: FluidoFactory) => void;
}

export const useContracts = create<ContractStore>((set) => ({
  factory: undefined,
  setFactory: (contract: FluidoFactory) => set(() => ({ factory: contract })),
}));
