// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract CredentialNFT is ERC721, AccessControl {
    using Counters for Counters.Counter;
    
    bytes32 public constant ISSUER_ROLE = keccak256("ISSUER_ROLE");
    
    Counters.Counter private _tokenIdCounter;
    
    struct Credential {
        string credentialType;
        string title;
        string description;
        address issuer;
        uint256 issuedAt;
        bool revoked;
        string metadataURI;
    }
    
    mapping(uint256 => Credential) public credentials;
    mapping(address => uint256[]) private _ownerCredentials;
    
    event CredentialIssued(
        uint256 indexed tokenId,
        address indexed recipient,
        string credentialType,
        string title
    );
    
    event CredentialRevoked(uint256 indexed tokenId);
    
    constructor() ERC721("Student Credential", "CRED") {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ISSUER_ROLE, msg.sender);
    }
    
    function issueCredential(
        address recipient,
        string memory credentialType,
        string memory title,
        string memory description,
        string memory metadataURI
    ) public onlyRole(ISSUER_ROLE) returns (uint256) {
        _tokenIdCounter.increment();
        uint256 tokenId = _tokenIdCounter.current();
        
        _safeMint(recipient, tokenId);
        
        credentials[tokenId] = Credential({
            credentialType: credentialType,
            title: title,
            description: description,
            issuer: msg.sender,
            issuedAt: block.timestamp,
            revoked: false,
            metadataURI: metadataURI
        });
        
        _ownerCredentials[recipient].push(tokenId);
        
        emit CredentialIssued(tokenId, recipient, credentialType, title);
        
        return tokenId;
    }
    
    function revokeCredential(uint256 tokenId) 
        public 
        onlyRole(ISSUER_ROLE) 
    {
        require(_exists(tokenId), "Credential does not exist");
        require(!credentials[tokenId].revoked, "Already revoked");
        
        credentials[tokenId].revoked = true;
        emit CredentialRevoked(tokenId);
    }
    
    function getCredential(uint256 tokenId) 
        public 
        view 
        returns (Credential memory) 
    {
        require(_exists(tokenId), "Credential does not exist");
        return credentials[tokenId];
    }
    
    function getOwnerCredentials(address owner) 
        public 
        view 
        returns (uint256[] memory) 
    {
        return _ownerCredentials[owner];
    }
    
    function verifyCredential(uint256 tokenId, address owner) 
        public 
        view 
        returns (bool) 
    {
        return _exists(tokenId) && ownerOf(tokenId) == owner && !credentials[tokenId].revoked;
    }
    
    function tokenURI(uint256 tokenId) 
        public 
        view 
        override 
        returns (string memory) 
    {
        require(_exists(tokenId), "Credential does not exist");
        return credentials[tokenId].metadataURI;
    }
    
    // Override transfer functions to make tokens soulbound (non-transferable)
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId,
        uint256 batchSize
    ) internal virtual override {
        require(from == address(0), "Soulbound: Transfer not allowed");
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }
    
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, AccessControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}