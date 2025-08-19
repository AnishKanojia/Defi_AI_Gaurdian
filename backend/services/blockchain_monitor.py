import logging
import os
from typing import Any, Dict, List, Optional
from datetime import datetime

from web3 import Web3, AsyncWeb3
from web3.providers.async_rpc import AsyncHTTPProvider
from web3.providers.async_websocket import AsyncWebsocketProvider
from web3.types import TxData

logger = logging.getLogger(__name__)

class BlockchainMonitor:
	def __init__(self) -> None:
		self.running: bool = False
		self.w3: Optional[Web3] = None
		self.aw3: Optional[AsyncWeb3] = None
		self.network_symbol: str = os.getenv('NETWORK_SYMBOL', 'BNB')
		self.rpc_url: str = os.getenv('BSC_RPC_URL') or os.getenv('BNB_RPC_URL') or os.getenv('WEB3_RPC_URL') or ''
		self.ws_url: str = os.getenv('BSC_WSS_URL') or os.getenv('BNB_WSS_URL') or os.getenv('WEB3_WSS_URL') or ''
		self.risk_alert_threshold: float = float(os.getenv('RISK_ALERT_THRESHOLD', '70'))
		self._tasks: List[asyncio.Task] = []
		self._emit = None  # type: ignore

	async def initialize(self) -> None:
		try:
			if not self.rpc_url:
				logger.warning('No RPC URL configured (BSC_RPC_URL / BNB_RPC_URL / WEB3_RPC_URL). Using mock data fallback.')
				return
			self.w3 = Web3(Web3.HTTPProvider(self.rpc_url, request_kwargs={'timeout': 20}))
			if not self.w3.is_connected():
				logger.error('Web3 failed to connect. Check RPC URL. Falling back to mock data.')
				self.w3 = None
			else:
				logger.info('Connected to chain via Web3: %s', self.rpc_url)
			# Async providers
			if self.ws_url:
				try:
					self.aw3 = AsyncWeb3(AsyncWebsocketProvider(self.ws_url))
					connected = await self.aw3.is_connected()  # type: ignore
					logger.info('Connected to chain via WebSocket: %s (ok=%s)', self.ws_url, connected)
				except Exception as e:
					logger.error('Failed to init AsyncWeb3 websocket: %s', e)
					self.aw3 = None
		except Exception as e:
			logger.error('Error initializing Web3: %s', e)
			self.w3 = None

	def is_healthy(self) -> bool:
		return True

	async def start(self) -> None:
		self.running = True
		logger.info('Blockchain monitoring started')
		# launch background consumers if websocket available
		if self.aw3 is not None:
			self._tasks.append(asyncio.create_task(self._stream_new_blocks()))
			self._tasks.append(asyncio.create_task(self._stream_pending()))

	async def stop(self) -> None:
		self.running = False
		logger.info('Blockchain monitoring stopped')
		for t in self._tasks:
			try:
				t.cancel()
			except Exception:
				pass
		self._tasks = []

	async def get_status(self) -> Dict[str, Any]:
		return {'running': self.running, 'timestamp': datetime.utcnow().isoformat(), 'web3': bool(self.w3)}

	async def get_dashboard_stats(self) -> Dict[str, Any]:
		"""Return live stats from chain if available, otherwise a safe fallback."""
		if not self.w3:
			return {
				'totalTransactions': 0,
				'transactionsPerSecond': 0.0,
				'averageGasPrice': 0.0,
				'activeContracts': 0,
				'totalValueLocked': 0.0,
				'riskScore': 42.5,
			}

		w3 = self.w3
		assert w3 is not None
		latest = w3.eth.block_number
		last_block = w3.eth.get_block(latest, full_transactions=True)
		# Look back N blocks to estimate TPS
		lookback = max(1, min(20, latest))
		earlier = w3.eth.get_block(latest - lookback, full_transactions=True)
		tx_count = 0
		for i in range(latest - lookback + 1, latest + 1):
			try:
				b = w3.eth.get_block(i, full_transactions=True)
				tx_count += len(b.transactions)
			except Exception:
				pass
		seconds = max(1, (last_block.timestamp - earlier.timestamp))
		avg_tps = tx_count / seconds
		avg_gas_price_gwei = float(w3.from_wei(w3.eth.gas_price, 'gwei'))

		return {
			'totalTransactions': int(w3.eth.get_block_transaction_count(latest)),
			'transactionsPerSecond': round(avg_tps, 2),
			'averageGasPrice': round(avg_gas_price_gwei, 2),
			'activeContracts': 0,
			'totalValueLocked': 0.0,
			'riskScore': 42.5,
		}

	def _tx_to_dict(self, tx: TxData, block_ts: int, receipt_status: Optional[int]) -> Dict[str, Any]:
		w3 = self.w3
		assert w3 is not None
		value_eth = float(w3.from_wei(tx['value'], 'ether'))
		gas_price_gwei = float(w3.from_wei(tx.get('gasPrice', 0), 'gwei'))
		status = 'confirmed' if receipt_status == 1 else ('failed' if receipt_status == 0 else 'pending')
		# Simple heuristic risk score
		risk = 0.0
		if value_eth > 100.0:
			risk += 30
		if gas_price_gwei > 50:
			risk += 20
		if tx.get('to') is None:
			risk += 10  # contract creation
		return {
			'hash': tx['hash'].hex(),
			'from': tx['from'],
			'to': tx.get('to'),
			'value': round(value_eth, 6),
			'gasPrice': round(gas_price_gwei, 4),
			'gasUsed': None,  # can be filled if receipt fetched
			'blockNumber': tx['blockNumber'],
			'timestamp': datetime.utcfromtimestamp(block_ts).isoformat(),
			'status': status,
			'riskScore': round(min(100.0, risk), 1),
		}

	def set_alert_emitter(self, emitter) -> None:
		"""Inject async emitter like `sio.emit` from FastAPI app."""
		self._emit = emitter

	async def _maybe_emit_alert(self, tx: Dict[str, Any]) -> None:
		if self._emit is None:
			return
		try:
			risk = float(tx.get('riskScore') or 0)
			if risk < self.risk_alert_threshold:
				return
			alert = {
				'id': tx['hash'],
				'type': 'warning' if risk < 85 else 'error',
				'severity': 'high' if risk < 85 else 'critical',
				'title': 'High-risk transaction',
				'message': f"Value {tx['value']} {self.network_symbol} at gas {tx['gasPrice']} gwei",
				'timestamp': datetime.utcnow().isoformat(),
				'source': 'monitoring',
				'metadata': {
					'transactionHash': tx['hash'],
					'walletAddress': tx['from'],
					'riskScore': risk,
					'explanation': 'Heuristic threshold exceeded',
				},
				'acknowledged': False,
				'resolved': False,
			}
			await self._emit('alert', alert)
		except Exception as e:
			logger.error('Failed emitting alert: %s', e)

	async def _stream_new_blocks(self) -> None:
		if self.aw3 is None:
			return
		filt = await self.aw3.eth.filter('latest')  # type: ignore
		logger.info('Subscribed to new blocks (filter)')
		while self.running:
			try:
				for bhash in await filt.get_new_entries():  # type: ignore
					block = await self.aw3.eth.get_block(bhash, full_transactions=True)  # type: ignore
					for tx in block.transactions:
						tx_dict = self._tx_to_dict(tx, int(block.timestamp), None)
						await self._maybe_emit_alert(tx_dict)
			except asyncio.CancelledError:
				break
			except Exception as e:
				logger.error('Block stream error: %s', e)
				await asyncio.sleep(1)
		await filt.uninstall()  # type: ignore

	async def _stream_pending(self) -> None:
		if self.aw3 is None:
			return
		filt = await self.aw3.eth.filter('pending')  # type: ignore
		logger.info('Subscribed to pending transactions (filter)')
		while self.running:
			try:
				for thash in await filt.get_new_entries():  # type: ignore
					try:
						tx = await self.aw3.eth.get_transaction(thash)  # type: ignore
						ts = int(datetime.utcnow().timestamp())
						tx_dict = self._tx_to_dict(tx, ts, None)
						await self._maybe_emit_alert(tx_dict)
					except Exception:
						pass
			except asyncio.CancelledError:
				break
			except Exception as e:
				logger.error('Pending stream error: %s', e)
				await asyncio.sleep(1)
		await filt.uninstall()  # type: ignore

	async def get_recent_transactions(self, limit: int = 50) -> List[Dict[str, Any]]:
		"""Fetch recent transactions from the latest blocks via Web3. Falls back to empty."""
		if not self.w3:
			return []
		w3 = self.w3
		assert w3 is not None
		results: List[Dict[str, Any]] = []
		try:
			latest = w3.eth.block_number
			bnum = latest
			while bnum >= 0 and len(results) < limit:
				block = w3.eth.get_block(bnum, full_transactions=True)
				for tx in reversed(block.transactions):
					if len(results) >= limit:
						break
					# receipt is optional due to performance
					receipt_status: Optional[int] = None
					try:
						receipt = w3.eth.get_transaction_receipt(tx['hash'])
						receipt_status = int(receipt.status)
					except Exception:
						pass
					results.append(self._tx_to_dict(tx, int(block.timestamp), receipt_status))
				bnum -= 1
		except Exception as e:
			logger.error('Error fetching recent transactions: %s', e)
			return []
		return results

	async def get_monitored_contracts(self) -> List[Dict[str, Any]]:
		# In a full implementation, read from DB or config. Keeping placeholder for now.
		return []

	async def get_monitored_wallets(self) -> List[Dict[str, Any]]:
		return []
