# BlockAttend — Blockchain-Based Attendance

A React + Vite frontend with Solidity smart contracts on Hardhat. The blockchain is the source of truth; there is no MySQL, MongoDB, Firebase, or other traditional database.

## Implemented

- MetaMask wallet connection
- Student on-chain registration
- Institution-admin-controlled faculty authorization
- Faculty course creation and course QR generation
- Faculty approval of student wallet addresses
- Student enrollment requests and approved enrollment
- Time-limited attendance sessions and QR generation
- Smart-contract attendance checks, duplicate prevention and session expiry
- Per-course attendance threshold and exam eligibility
- On-chain student/session data retrieval
- CSV export from currently loaded on-chain data
- Responsive faculty and student dashboards

## Requirements

- Node.js 20+ recommended
- MetaMask browser extension
- npm

## Install


npm install


## Run the local blockchain

Open terminal 1:


npm run chain


Keep this terminal running. Hardhat prints test accounts and private keys. These keys are for local development only. Import two or more of the local accounts into MetaMask.

## Configure MetaMask for Hardhat

Add a network manually:
- Network name: Hardhat Local
- RPC URL: `http://127.0.0.1:8545`
- Chain ID: `31337`
- Currency symbol: `ETH`

Use only test accounts printed by your own local Hardhat node. Never import a real wallet or use real funds for local testing.

## Compile and deploy

Open terminal 2 in this project:


npm run compile
npm run deploy:local


The deploy script writes the contract ABI and deployed address into `src/contract-abi.json` and `src/contract-address.json`.

**Restart Vite after deploying** if it was already running.

## Start the website


npm run dev


Open `http://localhost:5173`.

## First-time setup

1. The account that deployed the contract is the institution admin.
2. To authorize a faculty wallet, open a terminal in the project and run:


npx hardhat console --network localhost


Then execute:

const c = await ethers.getContractAt("BlockAttend", "PASTE_DEPLOYED_CONTRACT_ADDRESS");
await c.authorizeFaculty("PASTE_FACULTY_WALLET_ADDRESS");


Use the deployed contract address from `src/contract-address.json`. Exit the console with `.exit`. If the frontend is already open, refresh the page and connect using the faculty wallet.

3. Connect a different wallet and choose Student. Student registration is a transaction.
4. Faculty creates a course.
5. Student connects their wallet and requests enrollment (or scans the course QR). Faculty approves the student's wallet address in the roster page, then the student can join. If the student requested first, the faculty still approves the address, and the student then enrolls.
6. Faculty starts a session in Attendance and shares the session QR.
7. Student scans the QR in the Scan QR page, or pastes its QR payload. MetaMask asks the student to sign the attendance transaction.
8. Faculty and student dashboards show attendance counts and exam eligibility.

## QR workflow

- Course QR: contains a course ID. It does not grant access by itself.
- Attendance QR: contains course ID, session ID and expiry timestamp. The contract independently checks that the session is open, not expired, the wallet is enrolled, and the attendance is not a duplicate.

## Important implementation notes

- Smart contract authorization is enforced on-chain.
- The institution admin is the wallet that deploys the contract. Faculty cannot self-authorize.
- The roster is managed by approving student wallet addresses. Students must first register as Student.
- The QR code is not proof of physical presence and can be shared. Faculty identity checks or additional classroom controls may be required.
- Public blockchain data is visible and generally permanent. Do not put real names, student IDs, email addresses, or other personal data on-chain.
- The current project targets a local Hardhat chain. A deployed frontend must use the correct network and deployed contract address.
- The dashboard queries contract state directly. For larger deployments, an indexer may improve performance, but it should not replace the chain as the source of truth.
- The frontend is a functional academic prototype, not an audited production system. Run the tests and security review before any public deployment.

## Tests


npm test


## Deploying publicly (Sepolia testnet + hosted frontend)

1. `cp .env.example .env` and fill in `SEPOLIA_RPC_URL` (Alchemy/Infura) and `PRIVATE_KEY` of a **throwaway** wallet. Fund it with Sepolia test ETH from a faucet.
2. `npm install && npm run compile && npm test`
3. `npm run deploy:sepolia` — deploys the contract, and writes `src/contract-address.json` (address + chainId) and `src/contract-abi.json`. The deploying wallet is the institution admin.
4. Authorize faculty: `FACULTY=0xFacultyWallet npm run authorize:sepolia`
5. (Optional) Verify on Etherscan: `npm run verify:sepolia -- <contract address>` (needs `ETHERSCAN_API_KEY`).
6. **Commit** the updated `src/contract-address.json` and `src/contract-abi.json`, then host the frontend:
   - Vercel: import the repo (build `npm run build`, output `dist`; `vercel.json` is included), or
   - Netlify / Cloudflare Pages: same build command and output; `public/_redirects` handles SPA routing.
7. Open the site over HTTPS (needed for the camera QR scanner). The app prompts MetaMask to switch to the deployed network automatically.
