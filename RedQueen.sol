// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract YourContract is Ownable, ReentrancyGuard {
    IERC20 public immutable usdtToken;
    uint256 public constant DISTRIBUTION_AMOUNT = 1_000_000 * 10**18; // 1M USDT (assuming 18 decimals)

    // Structure to store liquidation data
    struct Liquidation {
        bool exists;
        uint256 fiatAmount;
        address payable recipient;
    }

    // Mapping to track liquidations
    mapping(string => Liquidation) public liquidations;

    // Events for transparency
    event Distributed(address indexed recipient, uint256 amount);
    event LiquidationInitiated(string transactionCode, uint256 fiatAmount, address recipient);
    event LiquidationExecuted(string transactionCode, uint256 fiatAmount, address recipient);

    constructor(address _usdtToken) Ownable(msg.sender) {
        require(_usdtToken != address(0), "Invalid USDT address");
        usdtToken = IERC20(_usdtToken);
    }

    function distribute(address recipient) external onlyOwner nonReentrant returns (bool) {
        require(recipient != address(0), "Invalid recipient address");
        require(usdtToken.balanceOf(address(this)) >= DISTRIBUTION_AMOUNT, "Insufficient USDT balance");

        usdtToken.transfer(recipient, DISTRIBUTION_AMOUNT);
        emit Distributed(recipient, DISTRIBUTION_AMOUNT);
        return true;
    }

    function initiateLiquidation(
        string memory transactionCode,
        uint256 fiatAmount,
        address payable recipient
    ) external onlyOwner nonReentrant returns (bool) {
        require(bytes(transactionCode).length > 0, "Transaction code cannot be empty");
        require(fiatAmount > 0, "Fiat amount must be greater than 0");
        require(recipient != address(0), "Invalid recipient address");
        require(!liquidations[transactionCode].exists, "Liquidation already exists");
        require(usdtToken.balanceOf(address(this)) >= fiatAmount, "Insufficient USDT balance");

        liquidations[transactionCode] = Liquidation({
            exists: true,
            fiatAmount: fiatAmount,
            recipient: recipient
        });

        emit LiquidationInitiated(transactionCode, fiatAmount, recipient);
        return true;
    }

    function executeLiquidation(string memory transactionCode) external onlyOwner nonReentrant {
        require(bytes(transactionCode).length > 0, "Transaction code cannot be empty");
        Liquidation memory liquidation = liquidations[transactionCode];
        require(liquidation.exists, "Liquidation does not exist");
        require(usdtToken.balanceOf(address(this)) >= liquidation.fiatAmount, "Insufficient USDT balance");

        // Transfer USDT
        usdtToken.transfer(liquidation.recipient, liquidation.fiatAmount);

        // Clean up storage
        delete liquidations[transactionCode];

        emit LiquidationExecuted(transactionCode, liquidation.fiatAmount, liquidation.recipient);
    }

    // Function to withdraw any stuck tokens (emergency use)
    function withdrawTokens(address token, uint256 amount) external onlyOwner {
        IERC20(token).transfer(owner(), amount);
    }
}