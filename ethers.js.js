// Define the contract address (replace with the actual address from Remix deployment)
const contractAddress = "0xDeployedContractAddress"; // Replace with the address from Step 7 of the Remix prompt

// Define the contract ABI (replace with the full ABI from Remix after deployment)
const contractABI = [
  {
    "inputs": [
      {"internalType": "address", "name": "usdtAddress", "type": "address"},
      {"internalType": "address", "name": "priceFeedAddress", "type": "address"}
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "internalType": "address", "name": "to", "type": "address"},
      {"indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256"}
    ],
    "name": "Distributed",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": false, "internalType": "uint256", "name": "count", "type": "uint256"}
    ],
    "name": "BatchDistributed",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": false, "internalType": "string", "name": "transactionCode", "type": "string"},
      {"indexed": false, "internalType": "uint256", "name": "fiatAmount", "type": "uint256"},
      {"indexed": false, "internalType": "uint256", "name": "usdtAmount", "type": "uint256"},
      {"indexed": false, "internalType": "address", "name": "recipient", "type": "address"},
      {"indexed": false, "internalType": "string", "name": "utrCode", "type": "string"}
    ],
    "name": "LiquidationInitiated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": false, "internalType": "string", "name": "transactionCode", "type": "string"},
      {"indexed": false, "internalType": "uint256", "name": "usdtAmount", "type": "uint256"},
      {"indexed": false, "internalType": "address", "name": "recipient", "type": "address"}
    ],
    "name": "LiquidationExecuted",
    "type": "event"
  },
  {
    "inputs": [
      {"internalType": "address[]", "name": "recipients", "type": "address[]"},
      {"internalType": "uint256[]", "name": "amounts", "type": "uint256[]"}
    ],
    "name": "batchDistribute",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "uint256", "name": "amount", "type": "uint256"}
    ],
    "name": "depositUSDT",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "address", "name": "to", "type": "address"},
      {"internalType": "uint256", "name": "amount", "type": "uint256"}
    ],
    "name": "distribute",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "string", "name": "_transactionCode", "type": "string"},
      {"internalType": "uint256", "name": "_fiatAmount", "type": "uint256"},
      {"internalType": "address", "name": "_recipient", "type": "address"},
      {"internalType": "string", "name": "_utrCode", "type": "string"}
    ],
    "name": "initiateLiquidation",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [{"internalType": "address", "name": "", "type": "address"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "address", "name": "token", "type": "address"},
      {"internalType": "address", "name": "to", "type": "address"},
      {"internalType": "uint256", "name": "amount", "type": "uint256"}
    ],
    "name": "rescueTokens",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "string", "name": "_transactionCode", "type": "string"}
    ],
    "name": "executeLiquidation",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "address", "name": "newOwner", "type": "address"}
    ],
    "name": "transferOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "string", "name": "", "type": "string"}
    ],
    "name": "transactions",
    "outputs": [
      {"internalType": "string", "name": "transactionCode", "type": "string"},
      {"internalType": "uint256", "name": "fiatAmount", "type": "uint256"},
      {"internalType": "uint256", "name": "usdtAmount", "type": "uint256"},
      {"internalType": "address", "name": "recipient", "type": "address"},
      {"internalType": "string", "name": "utrCode", "type": "string"},
      {"internalType": "bool", "name": "executed", "type": "bool"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "usdt",
    "outputs": [{"internalType": "contract IERC20", "name": "", "type": "address"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "stateMutability": "payable",
    "type": "receive"
  }
  // Add more ABI entries as needed from Remix
];

// Function to initialize the contract connection
async function connectToContract() {
  try {
    // Create a Web3 provider using MetaMask
    const provider = new ethers.providers.Web3Provider(window.ethereum);

    // Request account access if needed
    await provider.send("eth_requestAccounts", []);

    // Get the signer (user's account) for transactions
    const signer = provider.getSigner();

    // Create the contract instance
    const contract = new ethers.Contract(contractAddress, contractABI, signer);

    // Optional: Fetch and log initial contract state (e.g., owner, USDT balance)
    const owner = await contract.owner();
    const usdtAddress = await contract.usdt();
    const usdtContract = new ethers.Contract(usdtAddress, ["function balanceOf(address) view returns (uint256)"], provider);
    const balance = await usdtContract.balanceOf(contractAddress);
    console.log("Owner:", owner);
    console.log("USDT Balance:", ethers.utils.formatUnits(balance, 6), "USDT");

    // Return the contract instance for further use
    return contract;
  } catch (error) {
    console.error("Error connecting to contract:", error.message);
    alert("Failed to connect to the contract. Check console for details.");
    throw error;
  }
}

// Call the function on page load or button click (e.g., "MetaMask Connect")
document.addEventListener("DOMContentLoaded", async () => {
  const connectButton = document.querySelector("button"); // Adjust selector based on your HTML
  if (connectButton) {
    connectButton.addEventListener("click", async () => {
      try {
        const contract = await connectToContract();
        console.log("Contract connected successfully:", contract);
        // Store contract instance in a global variable or state (e.g., React useState)
        window.contract = contract; // Example for global access
      } catch (error) {
        console.error("Connection failed:", error);
      }
    });
  }
});

// Example function to initiate liquidation using the provided address
async function initiateLiquidation() {
  const contract = window.contract; // Or from state
  if (!contract) {
    alert("Contract not connected. Please connect MetaMask first.");
    return;
  }
  try {
    const tx = await contract.initiateLiquidation(
      "HBUK72818890467294", // Transaction Code
      ethers.utils.parseUnits("897100000", 18), // Fiat Amount in wei (adjust decimals)
      "0x5753f6e11d7C1A69DB4312426c214CFF21bC3dEB", // Recipient (your provided address)
      "HBUK68470677902613" // UTR Code
    );
    await tx.wait();
    console.log("Liquidation initiated:", tx.hash);
    alert("Liquidation initiated successfully!");
  } catch (error) {
    console.error("Error initiating liquidation:", error.message);
    alert("Failed to initiate liquidation. Check console for details.");
  }
}

// Example function to distribute USDT to the provided address
async function distributeUSDT() {
  const contract = window.contract;
  if (!contract) {
    alert("Contract not connected. Please connect MetaMask first.");
    return;
  }
  try {
    const tx = await contract.distribute(
      "0x5753f6e11d7C1A69DB4312426c214CFF21bC3dEB", // Recipient (your provided address)
      ethers.utils.parseUnits("1", 6) // Amount (1 USDT, 6 decimals)
    );
    await tx.wait();
    console.log("Distribution completed:", tx.hash);
    alert("USDT distributed successfully!");
  } catch (error) {
    console.error("Error distributing USDT:", error.message);
    alert("Failed to distribute USDT. Check console for details.");
  }
}

// Example function to execute liquidation
async function executeLiquidation() {
  const contract = window.contract;
  if (!contract) {
    alert("Contract not connected. Please connect MetaMask first.");
    return;
  }
  try {
    const tx = await contract.executeLiquidation("HBUK72818890467294"); // Transaction Code
    await tx.wait();
    console.log("Liquidation executed:", tx.hash);
    alert("Liquidation executed successfully!");
  } catch (error) {
    console.error("Error executing liquidation:", error.message);
    alert("Failed to execute liquidation. Check console for details.");
  }
}