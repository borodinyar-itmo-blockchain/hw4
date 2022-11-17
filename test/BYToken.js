const { time, loadFixture } = require("@nomicfoundation/hardhat-network-helpers");

const { expect } = require("chai");

const { ethers } = require("hardhat");

describe("BYToken", function () {
    const UNISWAP_V2_FACTORY = "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f";
    const UNISWAP_V2_ROUTER = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";

    const TUSD_WHALE_ADDRESS = "0x662353d1A53C88c85E546d7C4A72CE8fE1018e72"
    const TUSD_ADDRESS = "0x0000000000085d4780B73119b644AE5ecd22b376"

    async function deployTokenFixture() {
        const [bytOwner, addr2] = await ethers.getSigners();

        const tusdOwner = await ethers.getImpersonatedSigner(TUSD_WHALE_ADDRESS);

        await addr2.sendTransaction({
            to: tusdOwner.address,
            value: ethers.utils.parseEther("1"),
        });

        const BYTokenFactory = await ethers.getContractFactory("BYToken");
        const BYToken = await BYTokenFactory.connect(bytOwner).deploy(ethers.utils.parseEther("13"))
     
        const TUSD_Token = await ethers.getContractAt("IERC20", TUSD_ADDRESS);
        await TUSD_Token.connect(tusdOwner).transfer(bytOwner.address, ethers.utils.parseEther("12"));

        return {bytOwner, TUSD_Token, BYToken};
    }
    
    async function createUniswap(TUSD_Token, BYToken) {
        const factory = await ethers.getContractAt("IUniswapV2Factory", UNISWAP_V2_FACTORY);
        await factory.createPair(TUSD_Token.address, BYToken.address);
        const uniswapPair = await ethers.getContractAt("IUniswapV2Pair", await factory.getPair(TUSD_Token.address, BYToken.address));
        const uniswapRouter = await ethers.getContractAt("IUniswapV2Router01", UNISWAP_V2_ROUTER);
        return {uniswapPair, uniswapRouter};
    }

    async function getAndPrintBalance(Token, address, prefix) {
        const TokenBalance = await Token.balanceOf(address);
        console.log(prefix + TokenBalance);
        return TokenBalance
    }

    it("Swap TUSD and BYT", async function () {
        const {bytOwner, TUSD_Token, BYToken} = await loadFixture(deployTokenFixture);

        const {uniswapPair, uniswapRouter} = await createUniswap(TUSD_Token, BYToken)
        
        await TUSD_Token.connect(bytOwner).transfer(uniswapPair.address, ethers.utils.parseEther("12"));
        await BYToken.transfer(uniswapPair.address, ethers.utils.parseEther("12"));

        await uniswapPair.mint(bytOwner.address);

        const BYTokenBalanceBefore = await getAndPrintBalance(BYToken, bytOwner.address, "Balabce BYT before swap: ")
        const TUSD_TokenBalanceBefore = await getAndPrintBalance(TUSD_Token, bytOwner.address, "Balabce TUSD before swap: ")

        const reserveBefore = await uniswapPair.getReserves();

        await BYToken.approve(uniswapRouter.address, ethers.utils.parseEther("1"));

        await uniswapRouter.swapExactTokensForTokens(
            ethers.utils.parseEther("1"),
            0,
            [BYToken.address, TUSD_Token.address],
            bytOwner.address,
            (await time.latest()) + 1000 * 60 * 10 
        );

        const reserveAfter = await uniswapPair.getReserves();

        console.log("+".repeat(60));
        console.log("BYT swap to TUSD");
        console.log("Reserves changes: ", reserveBefore[0], " -> ", reserveAfter[0]);
        console.log("Reserves changes: ", reserveBefore[1], " -> ", reserveAfter[1]);
        console.log("+".repeat(60));

        const BYTokenBalanceAfter = await getAndPrintBalance(BYToken, bytOwner.address, "Balabce BYT after swap: ")
        const TUSD_TokenBalanceAfter = await getAndPrintBalance(TUSD_Token, bytOwner.address, "Balabce TUSD after swap: ")

        
        expect(BYTokenBalanceBefore).to.be.gt(0);
        expect(TUSD_TokenBalanceBefore).to.be.eq(0);
        
        expect(reserveAfter[0]).to.be.lt(reserveBefore[0]);
        expect(reserveAfter[1]).to.be.gt(reserveBefore[1]);

        expect(BYTokenBalanceAfter).to.be.eq(0);
        expect(TUSD_TokenBalanceAfter).to.be.gt(0);
    });
})