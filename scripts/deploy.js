const hre = require("hardhat");

async function main() {
	const maxSupply = 100000000;
	const blockReward = 50;

	const Token = await hre.ethers.getContractFactory("RunToken");
	const runToken = await Token.deploy(maxSupply, blockReward);

	await runToken.deployed();

	console.log("RunToken deployed to:", runToken.address);

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
		address: runToken.address,
		constructorArguments: [maxSupply, blockReward],
	});
	console.log("Contract verified on Etherscan:", verification);
}

main().catch((error) => {
	console.error(error);
	process.exit(1);
});
