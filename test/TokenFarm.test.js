const web3 = require("web3");

const DappToken = artifacts.require("DappToken");
const DaiToken = artifacts.require("DaiToken");
const TokenFarm = artifacts.require("TokenFarm");

require("chai")
  .use(require("chai-as-promised"))
  .should();

function tokens(n) {
  return web3.utils.toWei(n, "ether");
}

contract("TokenFarm", ([owner, investor]) => {
  // check that the smart contracts were deployed properly
  let daiToken, dappToken, tokenFarm;

  before(async () => {
    daiToken = await DaiToken.new();
    dappToken = await DappToken.new();
    tokenFarm = await TokenFarm.new(dappToken.address, daiToken.address);

    // Transfer all Dapp tokens to Tokenfarm
    await dappToken.transfer(tokenFarm.address, tokens("1000000"));

    // Send tokens to investor
    await daiToken.transfer(investor, tokens("1000"), {
      from: owner,
    });
  });

  describe("Mock Dai deployment", async () => {
    it("has a name ", async () => {
      const name = await daiToken.name();
      assert.equal(name, "Mock DAI Token");
    });
  });
  describe("Dapp Token deployment", async () => {
    it("has a name ", async () => {
      const name = await dappToken.name();
      assert.equal(name, "DApp Token");
    });
  });
  describe("Token Farm deployment", async () => {
    it("has a name ", async () => {
      const name = await tokenFarm.name();
      assert.equal(name, "DApp Token Farm");
    });

    it("contract has tokens ", async () => {
      const balance = await dappToken.balanceOf(tokenFarm.address);
      assert.equal(balance.toString(), tokens("1000000"));
    });
  });
  describe(" Farming Tokens", async () => {
    it("rewards investors for staking mDai tokens  ", async () => {
      let result;

      result = await daiToken.balanceOf(investor);
      assert.equal(
        result.toString(),
        tokens("1000"),
        "investor Mock Dai wallet balance correct before staking "
      );

      // Approve and stake tokens
      await daiToken.approve(tokenFarm.address, tokens("100"), {
        from: investor,
      });
      await tokenFarm.stakeTokens(tokens("100"), { from: investor });

      // Check balance of investor is 0 after staking
      result = await daiToken.balanceOf(investor);
      assert.equal(
        result.toString(),
        tokens("900"),
        "investor Mock Dai wallet balance correct after staking "
      );

      // check balance of tokenFarm after
      result = await daiToken.balanceOf(tokenFarm.address);
      assert.equal(
        result.toString(),
        tokens("100"),
        "Token Farm Mock Dai wallet balance correct after staking "
      );

      // Make sure the staking Balance is correct
      result = await tokenFarm.stakingBalance(investor);
      assert.equal(
        result.toString(),
        tokens("100"),
        "Investor staking balance correct after staking "
      );

      // check that the investor `isStaking`
      result = await tokenFarm.isStaking(investor);
      assert.equal(
        result.toString(),
        "true",
        "investor staking status correct after staking  "
      );

      // issue tokens
      await tokenFarm.issueTokens({ from: owner });
      result = await dappToken.balanceOf(investor);
      assert.equal(
        result.toString(),
        tokens("100"),
        "investor is issued Dapp Tokens equal to their staked balance"
      );

      // ensure that only the owner can call the function
      await tokenFarm.issueTokens({ from: investor }).should.be.rejected;

      //// UNSTAKE ///
      await tokenFarm.unstakeTokens({ from: investor });

      result = await daiToken.balanceOf(investor);
      assert.equal(
        result.toString(),
        tokens("1000"),
        "unstaked investor balance correct"
      );

      result = await daiToken.balanceOf(tokenFarm.address);
      assert.equal(
        result.toString(),
        tokens("0"),
        "unstaked tokenFarm balance correct"
      );

      result = await tokenFarm.stakingBalance(investor);
      assert.equal(
        result.toString(),
        tokens("0"),
        "unstaked staking balance correct"
      );

      result = await tokenFarm.isStaking(investor);
      assert.equal(
        result.toString(),
        "false",
        "unstaked isStaking is correct "
      );
    });
  });
});
