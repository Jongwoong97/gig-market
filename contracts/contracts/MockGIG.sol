// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/**
 * @title MockGIG
 * @notice Testnet-only ERC20 token for the GigLink marketplace.
 *         Anyone can mint tokens for testing purposes.
 */
contract MockGIG is ERC20 {
    uint8 private constant _DECIMALS = 18;

    constructor() ERC20("GIG Token", "GIG") {
        // Mint 1,000,000 GIG to deployer
        _mint(msg.sender, 1_000_000 * 10 ** _DECIMALS);
    }

    /**
     * @notice Mint tokens to any address (testnet only — no access control).
     */
    function mint(address to, uint256 amount) external {
        _mint(to, amount);
    }

    function decimals() public pure override returns (uint8) {
        return _DECIMALS;
    }
}
