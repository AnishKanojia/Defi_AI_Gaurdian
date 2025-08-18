import os
import logging
from typing import Any, Dict, List, Optional
from datetime import datetime

import firebase_admin
from firebase_admin import credentials, firestore

logger = logging.getLogger(__name__)

class FirebaseService:
	def __init__(self) -> None:
		self.app: Optional[firebase_admin.App] = None
		self.db: Optional[firestore.Client] = None
		self.project_id: Optional[str] = os.getenv('FIREBASE_PROJECT_ID')

	async def initialize(self) -> None:
		try:
			if self.app is not None and self.db is not None:
				return

			logger.info('Initializing Firebase Admin SDK...')
			service_account_path = os.getenv('GOOGLE_APPLICATION_CREDENTIALS')
			service_account_json = os.getenv('FIREBASE_SERVICE_ACCOUNT_JSON')

			cred: credentials.Base = None  # type: ignore
			if service_account_json:
				cred = credentials.Certificate(eval(service_account_json))
			elif service_account_path and os.path.exists(service_account_path):
				cred = credentials.Certificate(service_account_path)
			else:
				cred = credentials.ApplicationDefault()

			self.app = firebase_admin.initialize_app(cred, {
				'projectId': self.project_id
			}) if not firebase_admin._apps else firebase_admin.get_app()
			self.db = firestore.client()
			logger.info('Firebase initialized')
		except Exception as e:
			logger.error(f'Failed to initialize Firebase: {e}')
			raise

	def is_healthy(self) -> bool:
		return self.db is not None

	async def add_document(self, collection: str, data: Dict[str, Any]) -> str:
		if self.db is None:
			raise RuntimeError('Firebase not initialized')
		data['createdAt'] = data.get('createdAt') or datetime.utcnow()
		ref = self.db.collection(collection).add(data)
		return ref[1].id

	async def set_document(self, collection: str, doc_id: str, data: Dict[str, Any]) -> None:
		if self.db is None:
			raise RuntimeError('Firebase not initialized')
		data['updatedAt'] = datetime.utcnow()
		self.db.collection(collection).document(doc_id).set(data, merge=True)

	async def get_documents(self, collection: str, limit: int = 100) -> List[Dict[str, Any]]:
		if self.db is None:
			raise RuntimeError('Firebase not initialized')
		query = self.db.collection(collection).order_by('createdAt', direction=firestore.Query.DESCENDING).limit(limit)
		snapshots = query.stream()
		items: List[Dict[str, Any]] = []
		for snap in snapshots:
			item = snap.to_dict() or {}
			item['id'] = snap.id
			items.append(item)
		return items

	async def delete_document(self, collection: str, doc_id: str) -> None:
		if self.db is None:
			raise RuntimeError('Firebase not initialized')
		self.db.collection(collection).document(doc_id).delete()
