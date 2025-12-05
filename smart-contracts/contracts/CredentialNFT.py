"""
Student Credential NFT - Soulbound Token (Non-transferable)
This contract manages blockchain-verified certificates and badges
"""

import json
from datetime import datetime


class CredentialNFT:
    def __init__(self):
        self.name = "Student Credential"
        self.symbol = "CRED"
        self.owner = None
        self.authorized_issuers = set()
        self.token_counter = 0
        self.token_owners = {}
        self.token_metadata = {}
        self.owner_tokens = {}

    def initialize(self, owner_address):
        """Initialize the contract with owner"""
        self.owner = owner_address
        self.authorized_issuers.add(owner_address)

    def mint(self, issuer, recipient, credential_type, title, description, metadata=None):
        """Mint a new credential NFT (soulbound - non-transferable)"""
        if issuer not in self.authorized_issuers:
            raise ValueError("Not authorized to issue credentials")

        self.token_counter += 1
        token_id = self.token_counter

        # Store token ownership
        self.token_owners[token_id] = recipient

        # Store token metadata
        self.token_metadata[token_id] = {
            "id": token_id,
            "type": credential_type,
            "title": title,
            "description": description,
            "issuer": issuer,
            "recipient": recipient,
            "issued_at": datetime.now().isoformat(),
            "metadata": metadata or {},
            "soulbound": True
        }

        # Add to owner's token list
        if recipient not in self.owner_tokens:
            self.owner_tokens[recipient] = []
        self.owner_tokens[recipient].append(token_id)

        return token_id

    def owner_of(self, token_id):
        """Get owner of a token"""
        if token_id not in self.token_owners:
            raise ValueError("Token does not exist")
        return self.token_owners[token_id]

    def token_uri(self, token_id):
        """Get metadata URI for a token"""
        if token_id not in self.token_metadata:
            raise ValueError("Token does not exist")

        metadata = self.token_metadata[token_id]
        return json.dumps(metadata)

    def tokens_of_owner(self, owner):
        """Get all tokens owned by an address"""
        return self.owner_tokens.get(owner, [])

    def get_credential(self, token_id):
        """Get full credential details"""
        if token_id not in self.token_metadata:
            raise ValueError("Token does not exist")
        return self.token_metadata[token_id]

    def verify_credential(self, token_id, recipient):
        """Verify that a credential belongs to recipient"""
        if token_id not in self.token_owners:
            return False
        return self.token_owners[token_id] == recipient

    def revoke_credential(self, issuer, token_id):
        """Revoke a credential (mark as revoked, but don't delete)"""
        if token_id not in self.token_metadata:
            raise ValueError("Token does not exist")

        credential = self.token_metadata[token_id]

        # Only issuer or owner can revoke
        if issuer != credential["issuer"] and issuer != self.owner:
            raise ValueError("Not authorized to revoke this credential")

        self.token_metadata[token_id]["revoked"] = True
        self.token_metadata[token_id]["revoked_at"] = datetime.now(
        ).isoformat()

        return True

    def is_revoked(self, token_id):
        """Check if credential is revoked"""
        if token_id not in self.token_metadata:
            raise ValueError("Token does not exist")
        return self.token_metadata[token_id].get("revoked", False)

    def add_issuer(self, caller, new_issuer):
        """Add authorized issuer (only owner)"""
        if caller != self.owner:
            raise ValueError("Only owner can add issuers")

        self.authorized_issuers.add(new_issuer)
        return True

    def remove_issuer(self, caller, issuer):
        """Remove authorized issuer (only owner)"""
        if caller != self.owner:
            raise ValueError("Only owner can remove issuers")

        if issuer == self.owner:
            raise ValueError("Cannot remove owner as issuer")

        self.authorized_issuers.discard(issuer)
        return True

    def is_issuer(self, address):
        """Check if address is authorized issuer"""
        return address in self.authorized_issuers

    def total_supply(self):
        """Get total number of credentials issued"""
        return self.token_counter

    def get_credentials_by_type(self, owner, credential_type):
        """Get all credentials of a specific type for an owner"""
        tokens = self.tokens_of_owner(owner)
        filtered = []

        for token_id in tokens:
            metadata = self.token_metadata[token_id]
            if metadata["type"] == credential_type and not metadata.get("revoked", False):
                filtered.append(metadata)

        return filtered
