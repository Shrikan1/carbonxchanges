// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Burnable.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";


contract CarbonToken is ERC1155, ERC1155Burnable, ERC1155Supply, ERC1155URIStorage, Ownable {
    // On-chain provenance, queryable by anyone without needing our database
    mapping(uint256 => uint256) public tokenIdToProjectId;
    mapping(uint256 => uint256) public tokenIdToVintageYear;

    event CreditsMinted(
        uint256 indexed tokenId,
        uint256 indexed projectId,
        uint256 vintageYear,
        address indexed to,
        uint256 amount
    );

    constructor(address initialOwner) ERC1155("") Ownable(initialOwner) {}

   
    function mintCredits(
        address to,
        uint256 tokenId,
        uint256 amount,
        uint256 projectId,
        uint256 vintageYear,
        string memory tokenMetadataURI
    ) external onlyOwner {
        require(to != address(0), "Cannot mint to the zero address");
        require(amount > 0, "Amount must be positive");
        require(totalSupply(tokenId) == 0, "This tokenId has already been minted");

        tokenIdToProjectId[tokenId] = projectId;
        tokenIdToVintageYear[tokenId] = vintageYear;
        _setURI(tokenId, tokenMetadataURI);

        _mint(to, tokenId, amount, "");

        emit CreditsMinted(tokenId, projectId, vintageYear, to, amount);
    }

  

    function _update(address from, address to, uint256[] memory ids, uint256[] memory values)
        internal
        override(ERC1155, ERC1155Supply)
    {
        super._update(from, to, ids, values);
    }

    function uri(uint256 tokenId) public view override(ERC1155, ERC1155URIStorage) returns (string memory) {
        return super.uri(tokenId);
    }
}