"""
Student Reward Token (SRT) - ERC-20 Compatible Token
This contract manages the reward tokens for student achievements
"""


class RewardToken:
    def __init__(self):
        self.name = "Student Reward Token"
        self.symbol = "SRT"
        self.decimals = 18
        self.total_supply = 0
        self.balances = {}
        self.allowances = {}
        self.owner = None
        self.authorized_minters = set()

    def initialize(self, owner_address):
        """Initialize the contract with owner"""
        self.owner = owner_address
        self.authorized_minters.add(owner_address)

    def total_supply_of(self):
        """Get total supply of tokens"""
        return self.total_supply

    def balance_of(self, account):
        """Get balance of an account"""
        return self.balances.get(account, 0)

    def transfer(self, sender, recipient, amount):
        """Transfer tokens from sender to recipient"""
        if amount <= 0:
            raise ValueError("Amount must be positive")

        if self.balances.get(sender, 0) < amount:
            raise ValueError("Insufficient balance")

        self.balances[sender] = self.balances.get(sender, 0) - amount
        self.balances[recipient] = self.balances.get(recipient, 0) + amount

        return True

    def approve(self, owner, spender, amount):
        """Approve spender to spend tokens on behalf of owner"""
        if owner not in self.allowances:
            self.allowances[owner] = {}

        self.allowances[owner][spender] = amount
        return True

    def allowance(self, owner, spender):
        """Get allowance of spender for owner"""
        return self.allowances.get(owner, {}).get(spender, 0)

    def transfer_from(self, spender, sender, recipient, amount):
        """Transfer tokens on behalf of sender"""
        allowed = self.allowance(sender, spender)

        if amount > allowed:
            raise ValueError("Amount exceeds allowance")

        if self.balances.get(sender, 0) < amount:
            raise ValueError("Insufficient balance")

        self.balances[sender] = self.balances.get(sender, 0) - amount
        self.balances[recipient] = self.balances.get(recipient, 0) + amount
        self.allowances[sender][spender] = allowed - amount

        return True

    def mint(self, minter, recipient, amount):
        """Mint new tokens (only authorized minters)"""
        if minter not in self.authorized_minters:
            raise ValueError("Not authorized to mint")

        if amount <= 0:
            raise ValueError("Amount must be positive")

        self.balances[recipient] = self.balances.get(recipient, 0) + amount
        self.total_supply += amount

        return True

    def burn(self, account, amount):
        """Burn tokens from account"""
        if self.balances.get(account, 0) < amount:
            raise ValueError("Insufficient balance to burn")

        self.balances[account] = self.balances.get(account, 0) - amount
        self.total_supply -= amount

        return True

    def add_minter(self, caller, new_minter):
        """Add authorized minter (only owner)"""
        if caller != self.owner:
            raise ValueError("Only owner can add minters")

        self.authorized_minters.add(new_minter)
        return True

    def remove_minter(self, caller, minter):
        """Remove authorized minter (only owner)"""
        if caller != self.owner:
            raise ValueError("Only owner can remove minters")

        if minter == self.owner:
            raise ValueError("Cannot remove owner as minter")

        self.authorized_minters.discard(minter)
        return True

    def is_minter(self, address):
        """Check if address is authorized minter"""
        return address in self.authorized_minters
