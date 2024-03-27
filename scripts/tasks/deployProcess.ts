import { task } from "hardhat/config"
import { readFileSync, writeFileSync } from "../helpers/pathHelper"

task("deploy:member", "Deploy member")
  .addFlag("verify", "Validate contract after deploy")
  .setAction(async ({ verify }, hre) => {
    await hre.run("compile")
    const [signer]: any = await hre.ethers.getSigners()
    const feeData = await hre.ethers.provider.getFeeData()
    const balance = await hre.ethers.provider.getBalance(signer.address)
    console.log(`balance: ${balance}`)
    console.log(`maxPriorityFeePerGas: ${feeData.maxPriorityFeePerGas}`)
    const XueDAOFactory = await hre.ethers.getContractFactory("contracts/membership.sol:XueDAO_Core_Contributor", )
    const tokenURI = "https://ipfs.io/ipfs/Qmb8PWSUMS5x6Q9RidFP8UfFvzeGtr4kdLTDiQN6wyd3e2"
    const XueDAODeployContract: any = await XueDAOFactory.connect(signer).deploy(tokenURI , {
      maxPriorityFeePerGas: feeData.maxPriorityFeePerGas,
      maxFeePerGas: feeData.maxFeePerGas,
      gasLimit: 6000000, // optional: for some weird infra network
    })

    console.log(`membership.sol deployed to ${XueDAODeployContract.address}`)
    const airdrop = await XueDAODeployContract.airdrop(
      [
        "0x099Bb36F9D41F6Eca738b9854A8F07BA02Bf3E48",
        "0x9DB36029198CD3Dc70DE207be6918558AB0b70ea",
        "0xF092Dc31b7410c16Ffd0c43068B430e38F725150",
        "0xAa83c234Eb8125CB2485bEE6aD98da0A4892405A",
        "0xdA048C2845E7696cEB805FAF116F036a046A73f1",
        "0xD49EeDbE1287C7C8d7a1906477de4184e7988dBD",
        "0xf12382CCa36Aa958f3fD3A24C3C3B33BB79c5079",
        "0xC824D8D6AdA95eA00B0258d080C31663DA1abAd1",
        "0x8C4bC2521E315E4fd7c29B3d0F00f74aDCAF4Bb9",
        "0x579C1aF91BD134Ed42a79393c058fCd9316555E3",
        "0x063c11FdC4fC65D9B87605202194423C0f49aC0A",
        "0xd6D2991e9388E21aF8afF27d7e552A99D4cb512B",
        "0x1CEB02e12b665006676D7Bb8A5Df0FFC9Df5c261",
        "0xb7E6904045640890bD6460E74CA8963b7304de57",
        "0x6FA842C57a92D0DC136a6A76dD13A564515A69cf",
        "0x70f11cF8f76035CaDfd1b60c0c265e1E8Fe52287",
        "0x0D2FDDee5b84540A9766c025ad26dCaFb9FeF380",
        "0x2A01CfA467cb049FDe8849873E976FB7A7FF9B0A",
        "0xFc910402a530F82755Bf3ea467825448406719b3",
        "0xf93773a8a0687e5866E44e862d5bb556a4a551f3",
        "0x538399e9AECF5d6Cb1Eadb4Aa2F48eCF1CF64Ec5",
        "0xd4c384eC8a9f9EbFc97458833FF0147a131f7057",
        "0xEbf29A4dc710040B12E68465331F70e42f053d7b",
        "0x09009fC07c9eAd873D18C358ac71D02E36e1D354",
      ]
    )
    console.log(`airdrop: ${airdrop.hash}`)
    const setBaseURI = await XueDAODeployContract.setBaseURI("https://ipfs.io/ipfs/QmUk3M3xbiAXppHjiJJGQLRFBA77AjYy6BtGHD4gPCtziN/")
    console.log(`setBaseURI: ${setBaseURI.hash}`)
    const newaddress = await XueDAODeployContract.transferOwnership("0xD49EeDbE1287C7C8d7a1906477de4184e7988dBD")
    console.log(`transferOwnership: ${newaddress.hash}`)

    const address = {
      main: XueDAODeployContract.address,
    }
    const addressData = JSON.stringify(address)
    writeFileSync(`scripts/address/${hre.network.name}/`, "XueDAO.json", addressData)

    await XueDAODeployContract.deployed()

    if (verify) {
      console.log("verifying contract...")
      await XueDAODeployContract.deployTransaction.wait(3)
      try {
        await hre.run("verify:verify", {
          address: XueDAODeployContract.address,
          constructorArguments: ["https://ipfs.io/ipfs/Qmb8PWSUMS5x6Q9RidFP8UfFvzeGtr4kdLTDiQN6wyd3e2"],
          contract: "contracts/membership.sol:XueDAO_Core_Contributor",
        })
      } catch (e) {
        console.log(e)
      }
    } 
  },
  )
