import { ethers } from "ethers";
import { AsyncActionState } from "../../types/states/asyncActionState";
import { useContracts } from "../../stores/useContracts";

import FluidoFactoryContract from "../../contracts/FluidoFactory.json";
import { useCallback, useEffect, useState } from "react";
import { useProvider } from "../../stores/useProvider";
import { FACTORY } from "../../constants/contracts";
import { FluidoFactory } from "../../contracts/typechain/FluidoFactory";

export const useApplicationInitialization = () => {
  const [initializationStatus, setInitializationStatus] =
    useState<AsyncActionState>({ status: undefined });
  const provider = useProvider((state) => state.provider);

  const initializeApplication = useCallback(async () => {
    console.log("calling");
    try {
      setInitializationStatus({ status: "loading" });
      console.log("Setting factory contract");
      if (!provider) throw new Error("Provider is unexpectedly undefined");

      // Application initalization goes here
      const factoryContract = new ethers.Contract(
        FACTORY,
        FluidoFactoryContract.abi,
        provider.getSigner()
      ) as FluidoFactory;
      useContracts.setState({ factory: factoryContract });

      setInitializationStatus({ status: "succeeded" });
    } catch (error: any) {
      if (error instanceof Error) {
        return setInitializationStatus({ status: "failed", error });
      }

      setInitializationStatus({
        status: "failed",
        error: new Error("Failed to initialize application"),
      });
    }
  }, [provider]);

  useEffect(() => {
    if (provider && initializationStatus.status === undefined) {
      console.log("calling");
      initializeApplication();
    }
  }, [provider, initializationStatus, initializeApplication]);

  return initializationStatus;
};
