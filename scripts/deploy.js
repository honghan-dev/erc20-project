const hre = require("hardhat");

async function main() {
	const maxSupply = 100000000;
	const blockReward = 50;

	const Token = await hre.ethers.getContractFactory("RunToken");
	const runToken = await Token.deploy(maxSupply, blockReward);

	await runToken.deployed();

	console.log("RunToken deployed to:", runToken.address);
}

main().catch((error) => {
	console.error(error);
	process.exit(1);
});
