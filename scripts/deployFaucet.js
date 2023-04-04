const hre = require("hardhat");

async function main() {
	const tokenAddress = "";

	const Faucet = await hre.ethers.getContractFactory("Faucet");
	const faucet = await Faucet.deploy(tokenAddress);

	await faucet.deployed();

	console.log("Faucet contract deployed to:", runToken.address);

	// Verify contract on Etherscan
	// Wait for 5 blocks to be mined
	const blockNumber = await hre.ethers.provider.getBlockNumber();
	const targetBlockNumber = blockNumber + 5;
	while (true) {
		const latestBlockNumber = await hre.ethers.provider.getBlockNumber();
		if (latestBlockNumber >= targetBlockNumber) {
			break;
		}
		await new Promise((resolve) => setTimeout(resolve, 1000));
	}

	const verification = await hre.run("verify:verify", {
		address: faucet.address,
		constructorArguments: [tokenAddress],
	});
	console.log("Contract verified on Etherscan:", verification);
}

main().catch((error) => {
	console.error(error);
	process.exit(1);
});
