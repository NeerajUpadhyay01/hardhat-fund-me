// import
// main function
// calling of main function

// function defaultFunc(hre) {
//      console.log("HI!")
//      hre.getNamedAccounts
//      hre.deployments
// }
// module.exports.default = defaultFunc

const { network } = require("hardhat")
const { networkConfig, developMentChains } = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")

// module.exports = async(hre) => {
//     const { getNamedAccounts, deployments} = hre
module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId

    // if chianId is X use address Y
    // if chianId is Z use address A

    // const ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"]
    let ethUsdPriceFeedAddress
    if (developMentChains.includes(network.name)) {
        const ethUsdAggregator = await deployments.get("MockV3Aggregator")
        ethUsdPriceFeedAddress = ethUsdAggregator.address
    } else {
        ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"]
    }

    // what happens when we want to change chains?
    // when going for localhost or hardhat network we want to use a mock
    const args = [ethUsdPriceFeedAddress]
    const fundMe = await deploy("FundMe", {
        from: deployer,
        args: args, // put price feed address
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    })

    if (
        !developMentChains.includes(network.name) &&
        process.env.ETHERSCAN_API_KEY
    ) {
        await verify(fundMe.address, args)
    }
    log("---------------------------------------------------------")

    // Moking --> moking is creating objects that simulate the behaviour of real objects.
}

module.exports.tags = ["all", "fundme"]
