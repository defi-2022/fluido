import { BigNumber, BigNumberish, ethers } from "ethers";
import { toast } from "react-toastify";
import create from "zustand";
import { FluidoToken } from "../contracts/typechain/FluidoToken";
import { useContracts } from "./useContracts";
import FluidoTokenContract from "../contracts/FluidoToken.json";
import { useProvider } from "./useProvider";

export type TokenDetails = {
  address: string;
  name: string;
  symbol: string;
  description: string;
  liquidity: BigNumber;
  interest: number;
};

export type LiquidityDetails = {
  lockedLiquidity: BigNumber;
  userLockedLiquidity: BigNumber;
  generatedRewards: BigNumber;
};

interface useTokensStore {
  focusedToken: TokenDetails | undefined;
  focusedTokenLiquidity: LiquidityDetails | undefined;
  focusedTokenContract: FluidoToken | undefined;
  tokens: TokenDetails[] | undefined;
  fetchTokens: () => void;
  fetchLiquidityDetilas: () => Promise<void>;
  focusToken: (token: TokenDetails) => void;
  deFocusToken: () => void;
}

export const useTokens = create<useTokensStore>((set, get) => ({
  focusedToken: undefined,
  focusedTokenContract: undefined,
  focusedTokenLiquidity: undefined,
  tokens: [],
  fetchLiquidityDetilas: async () => {
    try {
      const focusedTokenContract = get().focusedTokenContract;

      if (!focusedTokenContract) {
        throw new Error("Failed to initialize token contract");
      }

      const userLocked = await focusedTokenContract.getDeposit();
      const totalLocked = await focusedTokenContract.totalLocked();
      const rewards = await focusedTokenContract.calculateReward();

      set({
        focusedTokenLiquidity: {
          lockedLiquidity: totalLocked,
          userLockedLiquidity: userLocked.amount,
          generatedRewards: rewards,
        },
      });
    } catch (error: any) {
      if (error instanceof Error) {
        toast.error(error.message);
      }

      console.log(error);
    }
  },
  focusToken: (token) => {
    const provider = useProvider.getState().provider;

    if (!provider) {
      console.log("Provider is not defined");
      return;
    }

    const tokenContract = new ethers.Contract(
      token.address,
      FluidoTokenContract.abi,
      provider.getSigner()
    ) as FluidoToken;

    set({ focusedToken: token, focusedTokenContract: tokenContract });
  },
  deFocusToken: () => {
    set({ focusedToken: undefined });
  },
  fetchTokens: async () => {
    try {
      const factory = useContracts.getState().factory;

      if (!factory) {
        throw new Error("Factory initialization failed");
      }

      const listings = await factory.getAllTokens();

      if (!listings) {
        throw new Error("Failed to fetch listings");
      }

      const formatedListing = listings.map((element) => ({
        address: element.tokenAddress,
        description: element.description,
        interest: 0,
        liquidity: element.lockedLiquidity,
        name: element.name,
        symbol: element.symbol,
      }));

      set({ tokens: formatedListing });
    } catch (error: any) {
      if (error instanceof Error) {
        toast.error(error.message);
        return console.log(error.message);
      }
      console.log(error);
    }
  },
}));
