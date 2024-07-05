const { ethers, getNamedAccounts, network } = require("hardhat")
const { developMentChains } = require("../../helper-hardhat-config")
const { assert } = require("chai")

developMentChains.includes(network.name)
    ? describe.skip
    : describe("FundMe", function () {
          let deployer
          let fundMe
          const sendValue = ethers.parseEther("1")
          beforeEach(async function () {
              deployer = (await getNamedAccounts()).deployer
              fundMe = await ethers.getContract("FundMe", deployer)
          })

          it("allows people to fund and withdraw", async function () {
              await fundMe.fund({ value: sendValue })
              await fundMe.withdraw()
              const endingBalance = await ethers.provider.getBalance(fundMe)
              assert.equal(endingBalance.toString(), "0")
          })
      })
