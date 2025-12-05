"""
Reward System - Main contract for managing rewards and credentials
Integrates RewardToken and CredentialNFT contracts
"""

from datetime import datetime


class RewardSystem:
    def __init__(self, reward_token, credential_nft):
        self.reward_token = reward_token
        self.credential_nft = credential_nft
        self.owner = None
        self.admins = set()
        self.event_organizers = set()

        # Event tracking
        self.events = {}
        self.event_counter = 0
        self.student_event_history = {}

        # Reward configurations
        self.reward_configs = {
            "workshop_attendance": 10,
            "competition_participation": 25,
            "competition_win": 100,
            "club_contribution": 15,
            "volunteer_work": 20,
            "hackathon_participation": 50,
            "hackathon_win": 200
        }

    def initialize(self, owner_address):
        """Initialize the system"""
        self.owner = owner_address
        self.admins.add(owner_address)

    def create_event(self, organizer, event_name, event_type, description, reward_amount, issue_certificate=False):
        """Create a new event"""
        if organizer not in self.event_organizers and organizer not in self.admins:
            raise ValueError("Not authorized to create events")

        self.event_counter += 1
        event_id = self.event_counter

        self.events[event_id] = {
            "id": event_id,
            "name": event_name,
            "type": event_type,
            "description": description,
            "organizer": organizer,
            "reward_amount": reward_amount,
            "issue_certificate": issue_certificate,
            "created_at": datetime.now().isoformat(),
            "participants": [],
            "active": True
        }

        return event_id

    def record_attendance(self, organizer, event_id, student_address):
        """Record student attendance and issue rewards"""
        if event_id not in self.events:
            raise ValueError("Event does not exist")

        event = self.events[event_id]

        if organizer != event["organizer"] and organizer not in self.admins:
            raise ValueError(
                "Not authorized to record attendance for this event")

        if not event["active"]:
            raise ValueError("Event is not active")

        if student_address in event["participants"]:
            raise ValueError("Student already recorded for this event")

        # Add participant
        event["participants"].append(student_address)

        # Issue reward tokens
        if event["reward_amount"] > 0:
            self.reward_token.mint(
                organizer, student_address, event["reward_amount"])

        # Issue certificate if configured
        certificate_id = None
        if event["issue_certificate"]:
            certificate_id = self.credential_nft.mint(
                organizer,
                student_address,
                event["type"],
                f"{event['name']} - Certificate of Participation",
                f"Awarded for participation in {event['name']}",
                {
                    "event_id": event_id,
                    "event_name": event["name"],
                    "event_type": event["type"]
                }
            )

        # Record in student history
        if student_address not in self.student_event_history:
            self.student_event_history[student_address] = []

        self.student_event_history[student_address].append({
            "event_id": event_id,
            "event_name": event["name"],
            "event_type": event["type"],
            "tokens_earned": event["reward_amount"],
            "certificate_id": certificate_id,
            "timestamp": datetime.now().isoformat()
        })

        return {
            "tokens_earned": event["reward_amount"],
            "certificate_id": certificate_id
        }

    def issue_direct_reward(self, issuer, student_address, amount, reason):
        """Issue direct token reward to student"""
        if issuer not in self.admins:
            raise ValueError("Only admins can issue direct rewards")

        self.reward_token.mint(issuer, student_address, amount)

        # Record in history
        if student_address not in self.student_event_history:
            self.student_event_history[student_address] = []

        self.student_event_history[student_address].append({
            "event_id": None,
            "event_name": "Direct Reward",
            "event_type": "direct_reward",
            "tokens_earned": amount,
            "reason": reason,
            "certificate_id": None,
            "timestamp": datetime.now().isoformat()
        })

        return True

    def issue_credential(self, issuer, student_address, credential_type, title, description, metadata=None):
        """Issue a credential/badge to student"""
        if issuer not in self.admins and not self.credential_nft.is_issuer(issuer):
            raise ValueError("Not authorized to issue credentials")

        token_id = self.credential_nft.mint(
            issuer,
            student_address,
            credential_type,
            title,
            description,
            metadata
        )

        return token_id

    def get_student_summary(self, student_address):
        """Get complete summary of student's rewards and credentials"""
        return {
            "address": student_address,
            "total_tokens": self.reward_token.balance_of(student_address),
            "credentials": self.credential_nft.tokens_of_owner(student_address),
            "event_history": self.student_event_history.get(student_address, []),
            "total_events": len(self.student_event_history.get(student_address, []))
        }

    def get_leaderboard(self, limit=10):
        """Get top students by token balance"""
        balances = []
        for address, balance in self.reward_token.balances.items():
            balances.append({
                "address": address,
                "tokens": balance,
                "events_participated": len(self.student_event_history.get(address, []))
            })

        balances.sort(key=lambda x: x["tokens"], reverse=True)
        return balances[:limit]

    def get_event(self, event_id):
        """Get event details"""
        if event_id not in self.events:
            raise ValueError("Event does not exist")
        return self.events[event_id]

    def get_active_events(self):
        """Get all active events"""
        return [event for event in self.events.values() if event["active"]]

    def close_event(self, caller, event_id):
        """Close an event"""
        if event_id not in self.events:
            raise ValueError("Event does not exist")

        event = self.events[event_id]

        if caller != event["organizer"] and caller not in self.admins:
            raise ValueError("Not authorized to close this event")

        event["active"] = False
        event["closed_at"] = datetime.now().isoformat()

        return True

    def add_admin(self, caller, new_admin):
        """Add admin role"""
        if caller != self.owner:
            raise ValueError("Only owner can add admins")

        self.admins.add(new_admin)
        return True

    def add_event_organizer(self, caller, organizer):
        """Add event organizer role"""
        if caller not in self.admins:
            raise ValueError("Only admins can add organizers")

        self.event_organizers.add(organizer)
        return True

    def update_reward_config(self, caller, event_type, amount):
        """Update reward configuration for event type"""
        if caller not in self.admins:
            raise ValueError("Only admins can update reward configs")

        self.reward_configs[event_type] = amount
        return True
