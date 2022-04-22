import { ethers } from "hardhat";

async function main() {
  const FluidoFactory = await ethers.getContractFactory("FluidoFactory");
  const fluidoFactory = await FluidoFactory.deploy();
  await fluidoFactory.deployed();

  console.log("Fluido Factory deployed to:", fluidoFactory.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
