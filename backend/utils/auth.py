import logging
from typing import Any, Dict

from firebase_admin import auth

logger = logging.getLogger(__name__)

def verify_token(id_token: str) -> Dict[str, Any]:
	"""Verify Firebase ID token and return decoded claims."""
	try:
		decoded = auth.verify_id_token(id_token)
		return decoded
	except Exception as e:
		logger.error(f'Failed to verify token: {e}')
		raise
