import logging
from typing import Any, Dict, List, Optional
from datetime import datetime

from firebase_admin import firestore

logger = logging.getLogger(__name__)

class AlertService:
	def __init__(self) -> None:
		self.db: Optional[firestore.Client] = None
		self.collection_name = 'alerts'

	async def initialize(self) -> None:
		from firebase_admin import firestore as _firestore
		self.db = _firestore.client()

	def is_healthy(self) -> bool:
		return self.db is not None

	async def get_alerts(self, severity: Optional[str] = None, type: Optional[str] = None, limit: int = 100) -> List[Dict[str, Any]]:
		if self.db is None:
			raise RuntimeError('AlertService not initialized')
		query = self.db.collection(self.collection_name).order_by('timestamp', direction=firestore.Query.DESCENDING).limit(limit)
		if severity:
			query = query.where('severity', '==', severity)
		if type:
			query = query.where('type', '==', type)
		snaps = query.stream()
		items: List[Dict[str, Any]] = []
		for s in snaps:
			data = s.to_dict() or {}
			data['id'] = s.id
			items.append(data)
		return items

	async def create_alert(self, alert_create) -> Any:
		if self.db is None:
			raise RuntimeError('AlertService not initialized')
		data = alert_create.dict()
		ref = self.db.collection(self.collection_name).add(data)
		doc = ref[1].get()
		result = doc.to_dict() or {}
		result['id'] = doc.id
		return result

	async def update_alert(self, alert_id: str, alert_update) -> Any:
		if self.db is None:
			raise RuntimeError('AlertService not initialized')
		data = {k: v for k, v in alert_update.dict().items() if v is not None}
		data['updatedAt'] = datetime.utcnow()
		doc_ref = self.db.collection(self.collection_name).document(alert_id)
		doc_ref.set(data, merge=True)
		doc = doc_ref.get()
		result = doc.to_dict() or {}
		result['id'] = doc.id
		return result

	async def delete_alert(self, alert_id: str) -> None:
		if self.db is None:
			raise RuntimeError('AlertService not initialized')
		self.db.collection(self.collection_name).document(alert_id).delete()
