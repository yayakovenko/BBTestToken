import {
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox-viem/network-helpers";
import { expect } from "chai";
import hre from "hardhat";
import { getAddress } from "viem";
import { hardhat } from 'viem/chains';


describe("BBTestToken", function () {
  async function deploy() {
    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await hre.viem.getWalletClients();
    const name = 'BBTestToken';
    const symbol = 'BBTT';
    const decimals = 18;
    const initialMint = BigInt(1000 * 1e18).toString();
    const initialOwner = owner.account.address;

    const token = await hre.viem.deployContract("BBTestToken", [
      name, symbol, initialOwner, initialMint
    ]);

    const publicClient = await hre.viem.getPublicClient();

    return {
      token,
      name,
      symbol,
      decimals,
      initialMint,
      initialOwner,
      publicClient,
      otherAccount,
    };
  }

  describe("Deployment", function () {
    it("Should set all metadata", async function () {
      const {token, name, symbol, decimals} = await loadFixture(deploy);

      expect(await token.read.name()).to.equal(name);
      expect(await token.read.symbol()).to.equal(symbol);
      expect(await token.read.decimals()).to.equal(decimals);
    });

    it("Should set the right owner", async function () {
      const {token, initialOwner} = await loadFixture(deploy);

      expect(await token.read.owner()).to.equal(
          getAddress(initialOwner)
      );
    });

    it("Should mint right initial tokens count to owner", async function () {
      const {token, initialOwner, initialMint} = await loadFixture(deploy);

      expect(await token.read.balanceOf([initialOwner])).to.equal(BigInt(initialMint));
    });

    it("Should mint right amount to other account", async function () {
      const {token, otherAccount} = await loadFixture(deploy);
      await token.write.mint([otherAccount.account.address, 1])

      expect(await token.read.balanceOf([otherAccount.account.address])).to.equal(BigInt(1));
    });

    it("Should revert from not owner", async function () {
      const { token, otherAccount } = await loadFixture(deploy);

      const contract = await hre.viem.getContractAt(
          "BBTestToken",
          token.address,
          { client: { wallet: otherAccount } }
      );

      await expect(contract.write.mint([otherAccount.account.address, 1])).to.be.rejectedWith(
          "OwnableUnauthorizedAccount"
      );
    });
  });
});
