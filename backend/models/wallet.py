from typing import List
from datetime import datetime
from pydantic import BaseModel

class Wallet(BaseModel):
	address: str
	balance: float
	riskScore: float
	suspiciousActivities: List[str]
	transactionCount: int
	lastActivity: datetime
	tags: List[str]
