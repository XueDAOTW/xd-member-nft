// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";
import { Strings } from "@openzeppelin/contracts/utils/Strings.sol";

contract XueDAO_Core_Contributor is ERC721 , Ownable {
    using Strings for uint256;
    mapping(address => uint256) public addressToTokenId;
    // Base URI
    string public baseURI;
    uint256 public nextTokenId = 1;
    bool public revealed;
    string public not_revealedURI;
    string public baseExtension = ".json";

    constructor(string memory not_revealedURI_) ERC721("XueDAO Core Contributor", "XueDAO") Ownable(msg.sender) {
        not_revealedURI = not_revealedURI_;
    }

    function setBaseURI(string memory baseURI_) external onlyOwner {
        baseURI = baseURI_;
        revealed = true;
    }

    function switch_revealed() external onlyOwner{
        revealed = !revealed;
    }

    function airdrop (address[] memory addresses) public onlyOwner {
        for (uint i = 0; i < addresses.length; i++) {
            require(addressToTokenId[addresses[i]] == 0, "Already minted");
            _safeMint(addresses[i], nextTokenId);
            addressToTokenId[addresses[i]] = nextTokenId;
            nextTokenId++;
        }
    }

    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        require(ownerOf(tokenId) != address(0), "ERC721Metadata: URI query for nonexistent token");
        if (revealed == false){
            return not_revealedURI;
        }
        return string(abi.encodePacked(baseURI, tokenId.toString(), baseExtension));
    }
}
