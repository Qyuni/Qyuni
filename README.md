## Hi there 👋

<!--
**Qyuni/Qyuni** is a ✨ _special_ ✨ repository because its `README.md` (this file) appears on your GitHub profile.

# USDT Distributor

A secure and flexible smart contract for distributing USDT tokens to multiple recipients with equal or custom amounts.

## Features

- Equal distribution to multiple recipients
- Custom amount distribution
- Whitelist management
- Pause mechanism for emergency situations
- Token recovery functionality
- Ownership management
- Comprehensive event logging
- Balance tracking per recipient

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Python 3.7+ (for bytecode decryption)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd usdt-distributor
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```env
# Network RPC URLs
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/your-api-key
MAINNET_RPC_URL=https://mainnet.infura.io/v3/your-api-key

# Private key for deployment
PRIVATE_KEY=your-private-key-here

# Etherscan API key for contract verification
ETHERSCAN_API_KEY=your-etherscan-api-key

# USDT contract address
USDT_ADDRESS=your-usdt-contract-address

# Python script environment variables
KEY_FILE=configs/key.bin
BYTECODE_FILE=configs/bytecode.enc
```

## Testing

Run the test suite:
```bash
npx hardhat test
```

The test suite covers:
- Contract deployment
- Whitelist management
- Equal distribution
- Custom distribution
- Pause functionality
- Recovery functionality
- Ownership management
- View functions

## Deployment

1. Deploy to Sepolia testnet:
```bash
npx hardhat run scripts/deploy.js --network sepolia
```

2. Verify the contract on Etherscan:
```bash
npx hardhat verify --network sepolia <deployed-contract-address> <usdt-address>
```

## Usage

### Whitelist Management

```javascript
// Whitelist addresses
await distributor.setWhitelist([address1, address2], true);

// Remove from whitelist
await distributor.setWhitelist([address1], false);
```

### Equal Distribution

```javascript
// Distribute equal amounts to multiple recipients
await distributor.distributeEqual(
  [address1, address2, address3],
  ethers.utils.parseUnits("100", 6) // 100 USDT (6 decimals)
);
```

### Custom Distribution

```javascript
// Distribute custom amounts
await distributor.distribute(
  [address1, address2],
  [
    ethers.utils.parseUnits("100", 6), // 100 USDT
    ethers.utils.parseUnits("200", 6)  // 200 USDT
  ]
);
```

### Emergency Functions

```javascript
// Pause distribution
await distributor.setDistributionPaused(true);

// Recover tokens
await distributor.recover(ownerAddress, amount);

// Transfer ownership
await distributor.transferOwnership(newOwnerAddress);
```

### View Functions

```javascript
// Get distributed amount for a recipient
const amount = await distributor.getDistributedAmount(recipientAddress);

// Get contract balance
const balance = await distributor.getContractBalance();
```

## Security Features

- Owner-only access control
- Whitelist system for recipients
- Pause mechanism for emergency situations
- Token recovery functionality
- Input validation
- Balance checks before transfers
- Comprehensive event logging

## Development

### Compile Contracts
```bash
npx hardhat compile
```

### Run Local Network
```bash
npx hardhat node
```

### Deploy to Local Network
```bash
npx hardhat run scripts/deploy.js --network localhost
```

## License

MIT

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request 
