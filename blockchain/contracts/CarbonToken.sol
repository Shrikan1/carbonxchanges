// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Burnable.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/// @title CarbonToken
/// @notice ERC-1155 carbon credit token. Each tokenId represents ONE
/// project+vintage batch — matching our off-chain `credit_batches.id`
/// exactly, so tokens from different projects/vintages are never fungible
/// with each other, only within their own tokenId. This preserves
/// provenance the way real carbon registries require (see the design
/// discussion that led here: plain ERC-20 would lose this distinction).
///
/// Trust model:
/// - Only the contract owner (the platform's admin wallet) can mint, and
///   only ONE mint per tokenId is allowed — mirrors the backend's
///   attemptMint() logic, but enforced here too so the guarantee doesn't
///   depend solely on the backend behaving correctly.
/// - Burning is NOT owner-restricted — any token holder can burn their own
///   tokens via the inherited ERC1155Burnable.burn(), which is exactly how
///   retirement is supposed to work: nobody but the holder can retire their
///   own credits, not even the platform admin.
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

    /// @notice Mints a new batch. Can only be called once per tokenId —
    /// this is what stops a second, accidental (or malicious) mint from
    /// ever inflating a batch beyond what the agent actually verified.
    /// @param to The seller's wallet address (from our backend's User.wallet_address)
    /// @param tokenId Our own credit_batches.id — the ERC-1155 token ID
    /// @param amount The tradeable amount (already buffer-adjusted by the backend)
    /// @param projectId Our own projects.id, stored for on-chain provenance
    /// @param vintageYear The year the verified reduction/removal occurred
    /// @param tokenMetadataURI IPFS URI (ipfs://<CID>) pointing to this batch's metadata JSON
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

    // --- Required overrides ---
    // Solidity requires these because CarbonToken inherits from multiple
    // OpenZeppelin extensions that each modify the same base functions.
    // Without them the contract simply won't compile — this isn't optional
    // boilerplate, it's how Solidity resolves "diamond inheritance."

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