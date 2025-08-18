from typing import Optional, Dict, Any
from datetime import datetime
from pydantic import BaseModel, Field

class AlertBase(BaseModel):
	type: str
	severity: str
	title: str
	message: str
	source: str = 'system'
	metadata: Optional[Dict[str, Any]] = None

class AlertCreate(AlertBase):
	timestamp: datetime = Field(default_factory=datetime.utcnow)
	acknowledged: bool = False
	resolved: bool = False

class AlertUpdate(BaseModel):
	title: Optional[str] = None
	message: Optional[str] = None
	severity: Optional[str] = None
	acknowledged: Optional[bool] = None
	resolved: Optional[bool] = None

class Alert(AlertBase):
	id: str
	timestamp: datetime
	acknowledged: bool
	resolved: bool

	class Config:
		from_attributes = True
