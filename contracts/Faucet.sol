// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

// The contract is the "faucet" that will distribute the tokens
// The owner is the account that deployed the contract
// The token contract is loaded from the address passed

contract Faucet {
    address payable owner;
    IERC20 public token;

    uint256 withdrawalAmount = 50 * (10 ** 18);
    uint256 public lockTime = 1 minutes;
    mapping(address => uint256) nextAccessTime;

    event Deposit(address indexed from, uint256 indexed amount);
    event Withdrawal(address indexed to, uint256 indexed amount);

    constructor(address _tokenAddress) payable {
        require(_tokenAddress != address(0), "Invalid token address");
        token = IERC20(_tokenAddress);
        owner = payable(msg.sender);
    }

    function requestTokens() public {
        require(msg.sender != address(0), "Not a valid address");
        require(
            token.balanceOf(address(this)) >= withdrawalAmount,
            "Not enough tokens in the faucet"
        );
        require(
            block.timestamp >= nextAccessTime[msg.sender],
            "Wait 1 minute before requesting tokens again"
        );

        nextAccessTime[msg.sender] = block.timestamp + lockTime;
        token.transfer(msg.sender, withdrawalAmount);
    }

    receive() external payable {
        emit Deposit(msg.sender, msg.value);
    }

    function getBalance() external view returns (uint256) {
        return token.balanceOf(address(this));
    }

    function setWithdrawalAmount(uint256 amount) public onlyOwner {
        withdrawalAmount = amount * (10 ** 18);
    }

    function setLockTime(uint256 amount) public onlyOwner {
        lockTime = amount * 1 minutes;
    }

    function withdrawal() external onlyOwner {
        emit Withdrawal(msg.sender, token.balanceOf(address(this)));
        token.transfer(msg.sender, token.balanceOf(address(this)));
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }
}
