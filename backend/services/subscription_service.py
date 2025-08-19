from typing import Dict, Set, List


class SubscriptionService:
    """In-memory subscription map protocol -> set(addresses).
    Replace with persistent storage (Firestore) for production.
    """
    def __init__(self) -> None:
        self.protocol_to_addresses: Dict[str, Set[str]] = {}

    def subscribe(self, address: str, protocol: str) -> None:
        protocol = protocol.lower().strip()
        if not protocol:
            return
        s = self.protocol_to_addresses.setdefault(protocol, set())
        s.add(address.lower())

    def unsubscribe(self, address: str, protocol: str) -> None:
        protocol = protocol.lower().strip()
        s = self.protocol_to_addresses.get(protocol)
        if s and address.lower() in s:
            s.remove(address.lower())

    def list_for_address(self, address: str) -> List[str]:
        addr = address.lower()
        return [p for p, addrs in self.protocol_to_addresses.items() if addr in addrs]

    def list_addresses_for(self, protocol: str) -> List[str]:
        protocol = protocol.lower().strip()
        return list(self.protocol_to_addresses.get(protocol, set()))


