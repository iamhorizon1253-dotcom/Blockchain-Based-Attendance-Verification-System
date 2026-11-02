import hre from "hardhat";
import fs from "node:fs";

const wallet = process.env.FACULTY;
if (!wallet) throw new Error("Usage: FACULTY=0x... npx hardhat run scripts/authorize-faculty.js --network sepolia");
const { address } = JSON.parse(fs.readFileSync("src/contract-address.json", "utf8"));
const c = await hre.ethers.getContractAt("BlockAttend", address);
const tx = await c.authorizeFaculty(wallet);
await tx.wait();
console.log(`Authorized faculty ${wallet} on ${address}`);
