import { HardhatUserConfig } from "hardhat/config"
import { NetworkUserConfig } from "hardhat/types"
// hardhat plugin
import "@nomiclabs/hardhat-ethers"
import "@nomicfoundation/hardhat-toolbox"

import { config as dotenvConfig } from "dotenv"
import { resolve } from "path"
import { loadTasks } from "./scripts/helpers/hardhatConfigHelpers"

dotenvConfig({ path: resolve(__dirname, "./.env") })

const taskFolder = ["tasks"]
loadTasks(taskFolder)

const chainIds = {
  ganache: 1337,
  goerli: 5,
  sepolia: 11155111,
  hardhat: 31337,
  mainnet: 1,
  quorum: 570,
  opbnb: 204,
  "opbnb-testnet": 5611,
  zircuit: 48899,
  "scroll-sepolia-testnet": 534351,
  "op-sepolia": 11155420,
  "linea-goerli": 59140,
  base: 8453,
  "base-sepolia": 84532,
}

// Ensure that we have all the environment variables we need.
const pk: string | undefined = process.env.PRIVATE_KEY
if (!pk) {
  throw new Error("Please set your pk in a .env file")
}

const infuraApiKey: string | undefined = process.env.INFURA_API_KEY
if (!infuraApiKey) {
  throw new Error("Please set your INFURA_API_KEY in a .env file")
}

function getChainConfig (chain: keyof typeof chainIds): NetworkUserConfig {
  let jsonRpcUrl: string
  switch (chain) {
    case "quorum":
      jsonRpcUrl = process.env.NETWORK_URL || ""
      break
    case "opbnb":
      jsonRpcUrl = "https://opbnb-mainnet-rpc.bnbchain.org"
      break
    case "opbnb-testnet":
      jsonRpcUrl = "https://opbnb-testnet-rpc.bnbchain.org"
      break
    case "zircuit":
      jsonRpcUrl = "https://zircuit1.p2pify.com"
      break
    case "scroll-sepolia-testnet":
      jsonRpcUrl = "https://scroll-sepolia.blockpi.network/v1/rpc/public"
      break
    case "op-sepolia":
      jsonRpcUrl = "https://sepolia.optimism.io"
      break
    case "linea-goerli":
      jsonRpcUrl = "https://rpc.goerli.linea.build"
      break
    case "base":
      jsonRpcUrl = "https://mainnet.base.org"
      break
    case "base-sepolia":
      jsonRpcUrl = "https://sepolia.base.org"
      break
    default:
      jsonRpcUrl = `https://${chain}.infura.io/v3/${infuraApiKey}`
  }
  return {
    accounts: [`0x${pk}`],
    chainId: chainIds[chain],
    url: jsonRpcUrl,
  }
}

const config: HardhatUserConfig = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      // TODO: SHOULD BE REMOVED! 
      allowUnlimitedContractSize: false,
      chainId: chainIds.hardhat,
    },
    local: {
      url: "http://127.0.0.1:8545",
    },
    goerli: getChainConfig("goerli"),
    sepolia: getChainConfig("sepolia"),
    mainnet: getChainConfig("mainnet"),
    quorum: getChainConfig("quorum"),
    opbnb: getChainConfig("opbnb"),
    "opbnb-testnet": getChainConfig("opbnb-testnet"),
    zircuit: getChainConfig("zircuit"),
    "scroll-sepolia-testnet": getChainConfig("scroll-sepolia-testnet"),
    "op-sepolia": getChainConfig("op-sepolia"),
    "linea-goerli": getChainConfig("linea-goerli"),
    base: getChainConfig("base"),
    "base-sepolia": getChainConfig("base-sepolia"),
  },
  paths: {
    artifacts: "./artifacts",
    cache: "./cache",
    sources: "./contracts",
    tests: "./test",
  },
  solidity: {
    compilers: [
      {
        version: "0.8.20",
      },
    ],
    settings: {
      metadata: {
        // Not including the metadata hash
        // https://github.com/paulrberg/hardhat-template/issues/31
        bytecodeHash: "none",
      },
      // Disable the optimizer when debugging
      // https://hardhat.org/hardhat-network/#solidity-optimizer-support
      optimizer: {
        enabled: true,
        runs: 200,
        details: {
          yulDetails: true,
        },
      },
    },
  },
  etherscan: {
    apiKey: {
      goerli: process.env.ETHERSCAN_API_KEY || "",
      sepolia: process.env.ETHERSCAN_API_KEY || "",
      mainnet: process.env.ETHERSCAN_API_KEY || "",
      opbnb: process.env.BSCSCAN_API_KEY || "",
      "opbnb-testnet": process.env.BSCSCAN_API_KEY || "",
      quorum: "NO_API_KEY",
      zircuit: process.env.ZIRCUIT_API_KEY || "",
      "scroll-sepolia-testnet": process.env.SCROLL_API_KEY || "",
      "op-sepolia": process.env.OPSEPOLIA_API_KEY || "",
      "linea-goerli": process.env.LINEA_API_KEY || "",
      base: process.env.BASE_API_KEY || "",
      "base-sepolia": process.env.BASE_API_KEY || "",
    },
    // https://docs.bscscan.com/v/opbnb-testnet/
    customChains: [{
      network: "quorum",
      chainId: chainIds.quorum,
      urls: {
        apiURL: `${process.env.BLOCKSCOUT_URL}/api`,
        browserURL: process.env.BLOCKSCOUT_URL as string,
      },
    },{
      network: "opbnb",
      chainId: chainIds.opbnb,
      urls: {
        apiURL: "https://api-opbnb.bscscan.com/api",
        browserURL: "https://opbnb.bscscan.com",
      },
    },{
      network: "opbnb-testnet",
      chainId: chainIds["opbnb-testnet"],
      urls: {
        apiURL: "https://api-opbnb-testnet.bscscan.com/api",
        browserURL: "https://opbnb-testnet.bscscan.com/",
      },
    },{
      network: "zircuit",
      chainId: chainIds["zircuit"],
      urls: {
        apiURL: 'https://explorer.zircuit.com/api/contractVerifyHardhat',
        browserURL: 'https://explorer.zircuit.com',
      }
    },{
      network: "scroll-sepolia-testnet",
      chainId: chainIds["scroll-sepolia-testnet"],
      urls: {
        apiURL: "https://api-sepolia.scrollscan.com/api",
        browserURL: "https://sepolia.scrollscan.com"
      }
    },{
      network: "op-sepolia",
      chainId: chainIds["op-sepolia"],
      urls: {
        apiURL: "https://api-sepolia-optimistic.etherscan.io/api",
        browserURL: "https://sepolia-optimism.etherscan.io"
      }
    },{
      network: "linea-goerli",
      chainId: chainIds["linea-goerli"],
      urls: {
        apiURL: "https://api-testnet.lineascan.build/api",
        browserURL: "https://goerli.lineascan.build"
      }
    },{
      network: "base",
      chainId: chainIds["base"],
      urls: {
        apiURL: "https://api.basescan.org/api",
        browserURL: "https://basescan.org/",
      },
    },{
      network: "base-sepolia",
      chainId: chainIds["base-sepolia"],
      urls: {
        apiURL: "https://api-sepolia.basescan.org/api",
        browserURL: "https://sepolia-explorer.base.org"
      }
    }
    ],
  },

  gasReporter: {
    currency: "USD",
    gasPrice: 100,
    enabled: process.env.REPORT_GAS as string === "true",
    excludeContracts: [],
    src: "./contracts",
  },
  typechain: {
    outDir: "typechain",
    target: "ethers-v5",
  },
}

export default config