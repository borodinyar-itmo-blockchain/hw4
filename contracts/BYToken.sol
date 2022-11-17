// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract BYToken is ERC20 {
    constructor(uint256 initialSupply) public ERC20("MBorodinyar's Token", "BYT")  {
        _mint(msg.sender, initialSupply);
    }
}
