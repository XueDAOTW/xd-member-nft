import fs from "fs"
import path from "path"

export function loadContract (chain: string, contractName: string, abiLocate?: string) {
  const locate = abiLocate ? `${abiLocate}/` : "/"
  const abiPath = path.resolve(__dirname, `../artifacts/contracts/${locate}${contractName}.sol/${contractName}.json`)
  const addressPath = path.resolve(__dirname, `../scripts/address/${chain}/${contractName}.json`)

  const abi = JSON.parse(fs.readFileSync(abiPath, "utf8"))
  const address = JSON.parse(fs.readFileSync(addressPath, "utf8"))

  return { abi, address }
}
