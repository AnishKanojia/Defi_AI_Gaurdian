from typing import List
from datetime import datetime
from pydantic import BaseModel

class SmartContract(BaseModel):
	address: str
	name: str
	type: str
	riskScore: float
	vulnerabilities: List[str]
	lastAudit: datetime
	tvl: float
	transactions24h: int
	status: str
