// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";

contract BBTestToken is ERC20, ERC20Burnable, Ownable, ERC20Permit {
    // Setter if needed
    uint8 private _decimals = 18;

    // Not specified in the task
    //uint256 public maxSupply = 0;

    constructor(
        string memory name,
        string memory symbol,
        address initialOwner,
        uint256 initialMint
    )
    ERC20(name, symbol)
    Ownable(initialOwner)
    ERC20Permit(name)
    {
        if (initialMint > 0) {
            _mint(initialOwner, initialMint);
        }
    }

    function decimals() public view virtual override returns (uint8) {
        return _decimals;
    }

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }

    function transferFromWithPermit(
        address owner,
        address to,
        uint256 amount,
        uint256 deadline,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) public returns (bool) {
        permit(owner, msg.sender, amount, deadline, v, r, s);

        return transferFrom(owner, to, amount);
    }
}
