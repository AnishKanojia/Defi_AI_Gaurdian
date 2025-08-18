from typing import Optional
from datetime import datetime
from pydantic import BaseModel

class TransactionBase(BaseModel):
	hash: str
	from_address: str
	to_address: Optional[str] = None
	value: float = 0.0
	gasPrice: float = 0.0
	gasUsed: float = 0.0
	blockNumber: int = 0
	timestamp: datetime = datetime.utcnow()
	status: str = 'pending'
	riskScore: float = 0.0

class TransactionCreate(TransactionBase):
	pass

class Transaction(TransactionBase):
	id: str
