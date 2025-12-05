"""
Deployment script for Student Reward System
This initializes all contracts and sets up the system
"""

from contracts.RewardSystem import RewardSystem
from contracts.CredentialNFT import CredentialNFT
from contracts.RewardToken import RewardToken
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(__file__)))


def deploy_contracts(owner_address):
    """Deploy all contracts and initialize system"""

    print("Deploying Student Reward System...")
    print(f"Owner Address: {owner_address}")
    print("-" * 50)

    # Deploy RewardToken
    print("1. Deploying RewardToken...")
    reward_token = RewardToken()
    reward_token.initialize(owner_address)
    print(f"   ✓ RewardToken deployed")
    print(f"   - Name: {reward_token.name}")
    print(f"   - Symbol: {reward_token.symbol}")

    # Deploy CredentialNFT
    print("\n2. Deploying CredentialNFT...")
    credential_nft = CredentialNFT()
    credential_nft.initialize(owner_address)
    print(f"   ✓ CredentialNFT deployed")
    print(f"   - Name: {credential_nft.name}")
    print(f"   - Symbol: {credential_nft.symbol}")

    # Deploy RewardSystem
    print("\n3. Deploying RewardSystem...")
    reward_system = RewardSystem(reward_token, credential_nft)
    reward_system.initialize(owner_address)
    print(f"   ✓ RewardSystem deployed")

    # Grant RewardSystem minting permissions
    print("\n4. Configuring permissions...")
    reward_token.add_minter(owner_address, "REWARD_SYSTEM")
    credential_nft.add_issuer(owner_address, "REWARD_SYSTEM")
    print(f"   ✓ RewardSystem authorized as minter")
    print(f"   ✓ RewardSystem authorized as issuer")

    print("\n" + "=" * 50)
    print("Deployment Complete!")
    print("=" * 50)

    return {
        "reward_token": reward_token,
        "credential_nft": credential_nft,
        "reward_system": reward_system
    }


def demo_usage(contracts, owner_address):
    """Demonstrate system usage"""
    reward_system = contracts["reward_system"]

    print("\n" + "=" * 50)
    print("Demo: Creating Sample Event")
    print("=" * 50)

    # Create a sample event
    event_id = reward_system.create_event(
        owner_address,
        "Introduction to Blockchain Workshop",
        "workshop_attendance",
        "A hands-on workshop covering blockchain fundamentals",
        50,  # 50 tokens reward
        True  # Issue certificate
    )

    print(f"\n✓ Created event ID: {event_id}")
    print(f"  Event: Introduction to Blockchain Workshop")
    print(f"  Reward: 50 SRT tokens")
    print(f"  Certificate: Yes")

    # Simulate student attendance
    student_address = "0xStudent123"
    print(f"\n✓ Recording attendance for student: {student_address}")

    result = reward_system.record_attendance(
        owner_address, event_id, student_address)

    print(f"  Tokens earned: {result['tokens_earned']}")
    print(f"  Certificate ID: {result['certificate_id']}")

    # Get student summary
    print(f"\n" + "=" * 50)
    print("Student Summary")
    print("=" * 50)

    summary = reward_system.get_student_summary(student_address)
    print(f"Address: {summary['address']}")
    print(f"Total Tokens: {summary['total_tokens']}")
    print(f"Credentials: {len(summary['credentials'])}")
    print(f"Events Participated: {summary['total_events']}")


if __name__ == "__main__":
    # Use a sample owner address
    owner_address = "0xOwner456"

    # Deploy contracts
    contracts = deploy_contracts(owner_address)

    # Run demo
    demo_usage(contracts, owner_address)

    print("\n" + "=" * 50)
    print("Deployment and demo completed successfully!")
    print("=" * 50)
