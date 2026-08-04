const { expect } = require('chai');
const { ethers } = require('hardhat');
const { loadFixture } = require('@nomicfoundation/hardhat-toolbox/network-helpers');

describe('CarbonToken', function () {
  // Deploys a fresh contract before each test group that needs it —
  // loadFixture caches this so repeated tests stay fast without state
  // leaking between them.
  async function deployFixture() {
    const [owner, seller, buyer, other] = await ethers.getSigners();

    const CarbonToken = await ethers.getContractFactory('CarbonToken');
    const carbonToken = await CarbonToken.deploy(owner.address);
    await carbonToken.waitForDeployment();

    return { carbonToken, owner, seller, buyer, other };
  }

  describe('Deployment', function () {
    it('sets the deployer as owner', async function () {
      const { carbonToken, owner } = await loadFixture(deployFixture);
      expect(await carbonToken.owner()).to.equal(owner.address);
    });
  });

  describe('Minting', function () {
    it('lets the owner mint credits to a seller', async function () {
      const { carbonToken, seller } = await loadFixture(deployFixture);

      await carbonToken.mintCredits(seller.address, 1, 1000, 42, 2026, 'ipfs://fake-cid');

      expect(await carbonToken.balanceOf(seller.address, 1)).to.equal(1000);
      expect(await carbonToken['totalSupply(uint256)'](1)).to.equal(1000);
    });

    it('records project ID and vintage year for the tokenId', async function () {
      const { carbonToken, seller } = await loadFixture(deployFixture);

      await carbonToken.mintCredits(seller.address, 5, 500, 42, 2027, 'ipfs://fake-cid');

      expect(await carbonToken.tokenIdToProjectId(5)).to.equal(42);
      expect(await carbonToken.tokenIdToVintageYear(5)).to.equal(2027);
    });

    it('sets the correct metadata URI', async function () {
      const { carbonToken, seller } = await loadFixture(deployFixture);

      await carbonToken.mintCredits(seller.address, 1, 1000, 42, 2026, 'ipfs://fake-cid');

      expect(await carbonToken.uri(1)).to.equal('ipfs://fake-cid');
    });

    it('emits a CreditsMinted event', async function () {
      const { carbonToken, seller } = await loadFixture(deployFixture);

      await expect(carbonToken.mintCredits(seller.address, 1, 1000, 42, 2026, 'ipfs://fake-cid'))
        .to.emit(carbonToken, 'CreditsMinted')
        .withArgs(1, 42, 2026, seller.address, 1000);
    });

    it('rejects minting from a non-owner wallet', async function () {
      const { carbonToken, seller, other } = await loadFixture(deployFixture);

      await expect(
        carbonToken.connect(other).mintCredits(seller.address, 1, 1000, 42, 2026, 'ipfs://fake-cid')
      ).to.be.revertedWithCustomError(carbonToken, 'OwnableUnauthorizedAccount');
    });

    it('rejects a second mint on the same tokenId — this is the core trust guarantee', async function () {
      const { carbonToken, seller } = await loadFixture(deployFixture);

      await carbonToken.mintCredits(seller.address, 1, 1000, 42, 2026, 'ipfs://fake-cid');

      await expect(
        carbonToken.mintCredits(seller.address, 1, 500, 42, 2026, 'ipfs://fake-cid-2')
      ).to.be.revertedWith('This tokenId has already been minted');
    });

    it('rejects minting to the zero address', async function () {
      const { carbonToken } = await loadFixture(deployFixture);

      await expect(
        carbonToken.mintCredits(ethers.ZeroAddress, 1, 1000, 42, 2026, 'ipfs://fake-cid')
      ).to.be.revertedWith('Cannot mint to the zero address');
    });

    it('rejects a zero amount', async function () {
      const { carbonToken, seller } = await loadFixture(deployFixture);

      await expect(
        carbonToken.mintCredits(seller.address, 1, 0, 42, 2026, 'ipfs://fake-cid')
      ).to.be.revertedWith('Amount must be positive');
    });
  });

  describe('Burning (retirement)', function () {
    it('lets a holder burn their own tokens', async function () {
      const { carbonToken, seller } = await loadFixture(deployFixture);
      await carbonToken.mintCredits(seller.address, 1, 1000, 42, 2026, 'ipfs://fake-cid');

      await carbonToken.connect(seller).burn(seller.address, 1, 300);

      expect(await carbonToken.balanceOf(seller.address, 1)).to.equal(700);
      expect(await carbonToken['totalSupply(uint256)'](1)).to.equal(700);
    });

    it('prevents burning tokens you do not own or have approval for — nobody, including the owner, can force-burn someone else\'s tokens', async function () {
      const { carbonToken, seller, other } = await loadFixture(deployFixture);
      await carbonToken.mintCredits(seller.address, 1, 1000, 42, 2026, 'ipfs://fake-cid');

      await expect(
        carbonToken.connect(other).burn(seller.address, 1, 100)
      ).to.be.revertedWithCustomError(carbonToken, 'ERC1155MissingApprovalForAll');
    });

    it('does not let the contract owner burn a seller\'s tokens either', async function () {
      const { carbonToken, owner, seller } = await loadFixture(deployFixture);
      await carbonToken.mintCredits(seller.address, 1, 1000, 42, 2026, 'ipfs://fake-cid');

      // owner has no special burn privilege — same check as any other non-holder
      await expect(
        carbonToken.connect(owner).burn(seller.address, 1, 100)
      ).to.be.revertedWithCustomError(carbonToken, 'ERC1155MissingApprovalForAll');
    });
  });

  describe('Transfers (purchases)', function () {
    it('lets a seller transfer credits to a buyer', async function () {
      const { carbonToken, seller, buyer } = await loadFixture(deployFixture);
      await carbonToken.mintCredits(seller.address, 1, 1000, 42, 2026, 'ipfs://fake-cid');

      await carbonToken.connect(seller).safeTransferFrom(seller.address, buyer.address, 1, 400, '0x');

      expect(await carbonToken.balanceOf(seller.address, 1)).to.equal(600);
      expect(await carbonToken.balanceOf(buyer.address, 1)).to.equal(400);
    });
  });

  describe('Multiple batches (ERC-1155 non-fungibility across tokenIds)', function () {
    it('keeps different project/vintage batches completely separate', async function () {
      const { carbonToken, seller, buyer } = await loadFixture(deployFixture);

      await carbonToken.mintCredits(seller.address, 1, 1000, 42, 2026, 'ipfs://project-42-2026');
      await carbonToken.mintCredits(seller.address, 2, 500, 43, 2027, 'ipfs://project-43-2027');

      expect(await carbonToken.balanceOf(seller.address, 1)).to.equal(1000);
      expect(await carbonToken.balanceOf(seller.address, 2)).to.equal(500);
      expect(await carbonToken.tokenIdToProjectId(1)).to.equal(42);
      expect(await carbonToken.tokenIdToProjectId(2)).to.equal(43);

      // Burning tokenId 1 must not touch tokenId 2's balance
      await carbonToken.connect(seller).burn(seller.address, 1, 1000);
      expect(await carbonToken.balanceOf(seller.address, 1)).to.equal(0);
      expect(await carbonToken.balanceOf(seller.address, 2)).to.equal(500);
    });
  });
});