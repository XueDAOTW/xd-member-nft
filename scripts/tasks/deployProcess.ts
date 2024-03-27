import { task } from "hardhat/config"
import { readFileSync, writeFileSync } from "../helpers/pathHelper"
import * as fs from "fs";
import * as path from "path";
import { parse } from 'csv-parse';
type CSVFormat = {
  name: string,
  address: string,
  nickname: string,
  background: string,
  telegram: string
};
  const csvFilePath = path.resolve(__dirname, '../../photo_overlap/airdrop.csv');

  const headers = ['name', 'address', 'nickname', 'background', 'telegram'];

  const fileContent = fs.readFileSync(csvFilePath, { encoding: 'utf-8' });


task("deploy:member", "Deploy member")
  .addFlag("verify", "Validate contract after deploy")
  .setAction(async ({ verify }, hre) => {
    const addressArray = [] as string[]
    parse(fileContent, {
      delimiter: ',',
      columns: headers,
    }, (error, result: CSVFormat[]) => {
      if (error) {
        console.error(error);
      }
      result.forEach((row) => {
        if (row.address == "address")
          return
        addressArray.push(row.address)
      });
    });
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
      addressArray,
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
