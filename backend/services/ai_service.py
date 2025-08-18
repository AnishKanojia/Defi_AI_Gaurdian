import asyncio
import logging
import random
import statistics
from datetime import datetime, timedelta
from typing import Dict, List, Any

logger = logging.getLogger(__name__)

class AIService:
	def __init__(self):
		self.is_initialized = False
		self.confidence_threshold = 0.8
		self.anomaly_sensitivity = 0.7
		
	async def initialize(self):
		logger.info("Initializing lightweight AI Service (no external ML deps)...")
		self.is_initialized = True
		logger.info("AI Service initialized")

	def is_healthy(self) -> bool:
		return self.is_initialized

	async def cleanup(self):
		logger.info("AI Service cleanup completed")

	async def analyze_contract_source(self, source_code: str) -> Dict[str, Any]:
		"""Heuristic pre-deployment analyzer for Solidity source code.
		Returns risk score, detected patterns, and recommendations.
		"""
		if not self.is_initialized:
			raise Exception("AI Service not initialized")

		code = source_code or ""
		lines = [l.strip() for l in code.splitlines() if l.strip()]
		length = len(lines)

		patterns: List[str] = []
		recommendations: List[str] = []
		risk = 0.0

		# Simple checks
		if any("tx.origin" in l for l in lines):
			patterns.append("Insecure authorization using tx.origin")
			risk += 20
			recommendations.append("Use msg.sender for auth instead of tx.origin")

		if any("delegatecall" in l for l in lines):
			patterns.append("delegatecall usage")
			risk += 25
			recommendations.append("Validate delegatecall target and limit privileges")

		if any("selfdestruct" in l or "suicide" in l for l in lines):
			patterns.append("Self-destruct capability")
			risk += 15
			recommendations.append("Restrict selfdestruct via multi-sig or remove")

		if any("reentrancyGuard" in l.lower() or "nonreentrant" in l.lower() for l in lines):
			patterns.append("Reentrancy guard present")
		else:
			patterns.append("Reentrancy guard missing")
			risk += 15
			recommendations.append("Protect external functions with nonReentrant")

		if any(l.startswith("function ") and "external" in l and "payable" in l for l in lines):
			patterns.append("External payable function(s)")
			risk += 10

		if any("onlyOwner" in l for l in lines):
			patterns.append("Owner-only restriction present")
		else:
			patterns.append("Access control checks might be missing")
			risk += 10
			recommendations.append("Add role-based access control (Ownable/AccessControl)")

		if any("oracle" in l.lower() for l in lines):
			patterns.append("Oracle interaction detected")
			risk += 10

		if length > 800:
			patterns.append("High code complexity (many lines)")
			risk += 10

		risk = max(0.0, min(100.0, risk))
		level = self._risk_level(risk)
		confidence = 0.7 + min(0.2, risk / 500)

		return {
			"risk_score": round(risk, 1),
			"risk_level": level,
			"confidence": round(confidence, 2),
			"detected_patterns": patterns,
			"recommendations": recommendations,
			"stats": {"lines": length}
		}

	async def detect_anomalies(self, transaction_data: Dict[str, Any]) -> Dict[str, Any]:
		if not self.is_initialized:
			raise Exception("AI Service not initialized")
		# Simple heuristic-based anomaly detection
		value = float(transaction_data.get('value', 0) or 0)
		gas_price = float(transaction_data.get('gasPrice', 0) or 0)
		gas_used = float(transaction_data.get('gasUsed', 0) or 0)
		is_contract = bool(transaction_data.get('contractInteraction', False))
		
		anomaly_score = 0.0
		reasons: List[str] = []
		if value > 1000:
			anomaly_score += 0.4
			reasons.append('High value transfer')
		if gas_price > 50:
			anomaly_score += 0.3
			reasons.append('High gas price')
		if gas_used > 300000:
			anomaly_score += 0.2
			reasons.append('High gas used')
		if is_contract:
			anomaly_score += 0.2
			reasons.append('Contract interaction')
		
		anomaly_score = min(anomaly_score, 1.0)
		is_anomaly = anomaly_score >= self.anomaly_sensitivity
		confidence = max(0.5, anomaly_score)
		
		return {
			'is_anomaly': is_anomaly,
			'anomaly_score': round(anomaly_score, 3),
			'confidence': round(confidence, 3),
			'features_analyzed': ['value', 'gasPrice', 'gasUsed', 'contractInteraction'],
			'explanation': ' / '.join(reasons) if reasons else 'No anomalous signals found.'
		}

	async def calculate_risk_score(self, entity_data: Dict[str, Any], entity_type: str = 'transaction') -> Dict[str, Any]:
		if not self.is_initialized:
			raise Exception("AI Service not initialized")
		# Simple weighted rules per entity
		score = 0.0
		factors: List[str] = []
		if entity_type == 'transaction':
			value = float(entity_data.get('value', 0) or 0)
			gas_price = float(entity_data.get('gasPrice', 0) or 0)
			is_contract = bool(entity_data.get('contractInteraction', False))
			if value > 1000:
				score += 35; factors.append('High value')
			if gas_price > 50:
				score += 25; factors.append('High gas price')
			if is_contract:
				score += 15; factors.append('Contract interaction')
		elif entity_type == 'contract':
			tvl = float(entity_data.get('tvl', 0) or 0)
			transactions24h = float(entity_data.get('transactions24h', 0) or 0)
			upgradeable = bool(entity_data.get('upgradeable', False))
			if upgradeable: score += 25; factors.append('Upgradeable proxy')
			if transactions24h > 2000: score += 20; factors.append('Surge in tx count')
			if tvl > 1e8: score += 30; factors.append('High TVL exposure')
		elif entity_type == 'wallet':
			balance = float(entity_data.get('balance', 0) or 0)
			failed = float(entity_data.get('failedTransactions', 0) or 0)
			if balance > 1e6: score += 25; factors.append('Whale wallet')
			if failed > 5: score += 20; factors.append('Unusual failure rate')
		
		score = max(0.0, min(100.0, score))
		confidence = 0.8 if factors else 0.6
		
		return {
			'risk_score': round(score, 1),
			'confidence': round(confidence, 2),
			'risk_level': self._risk_level(score),
			'factors': factors,
			'recommendations': self._recommendations(score)
		}

	async def detect_vulnerabilities(self, contract_data: Dict[str, Any]) -> Dict[str, Any]:
		if not self.is_initialized:
			raise Exception("AI Service not initialized")
		# Heuristic vulnerability hints
		vulns: List[str] = []
		if bool(contract_data.get('upgradeable', False)):
			vulns.append('Access Control')
		if float(contract_data.get('externalCalls', 0) or 0) > 5:
			vulns.append('Reentrancy')
		if float(contract_data.get('complexityScore', 0) or 0) > 0.8:
			vulns.append('Logic Errors')
		
		confidence = 0.75 if vulns else 0.6
		return {
			'has_vulnerabilities': bool(vulns),
			'confidence': round(confidence, 2),
			'vulnerabilities': vulns,
			'risk_level': self._vuln_level(vulns),
			'recommendations': self._vuln_recos(vulns)
		}

	async def get_risk_metrics(self) -> Dict[str, Any]:
		return {
			'total_risk_score': round(random.uniform(20, 80), 1),
			'high_risk_contracts': random.randint(5, 50),
			'suspicious_transactions': random.randint(10, 100),
			'active_alerts': random.randint(5, 25),
			'vulnerabilities_detected': random.randint(0, 15),
			'last_updated': datetime.utcnow().isoformat(),
			'trend': random.choice(['increasing', 'decreasing'])
		}

	async def get_risk_trends(self, hours: int = 24) -> Dict[str, Any]:
		timestamps = []
		scores = []
		current = datetime.utcnow()
		for i in range(hours):
			timestamps.append((current - timedelta(hours=i)).isoformat())
			scores.append(random.uniform(20, 80))
		scores.reverse(); timestamps.reverse()
		vol = statistics.pstdev(scores) if len(scores) > 1 else 0.0
		return {
			'timestamps': timestamps,
			'risk_scores': [round(s, 1) for s in scores],
			'trend_direction': 'increasing' if scores[-1] > scores[0] else 'decreasing',
			'volatility': round(vol, 2)
		}

	async def get_vulnerability_stats(self) -> Dict[str, Any]:
		return {
			'total_vulnerabilities': random.randint(50, 200),
			'by_type': {
				'reentrancy': random.randint(10, 40),
				'overflow': random.randint(5, 25),
				'access_control': random.randint(8, 30),
				'logic_errors': random.randint(3, 20),
				'other': random.randint(2, 15)
			},
			'severity_distribution': {
				'critical': random.randint(5, 15),
				'high': random.randint(10, 25),
				'medium': random.randint(15, 35),
				'low': random.randint(10, 30)
			}
		}

	async def get_insights(self) -> List[Dict[str, Any]]:
		return [
			{
				'id': 1,
				'type': 'warning',
				'title': 'Unusual Gas Price Spike',
				'description': 'Gas prices increased significantly in the last hour.',
				'confidence': 85,
				'impact': 'medium',
				'recommendation': 'Monitor and delay non-critical txs.',
				'timestamp': datetime.utcnow().isoformat()
			},
			{
				'id': 2,
				'type': 'error',
				'title': 'Clustered Contract Interactions',
				'description': 'Multiple wallets interacting with a new contract.',
				'confidence': 90,
				'impact': 'high',
				'recommendation': 'Investigate contract and flag wallets.',
				'timestamp': (datetime.utcnow() - timedelta(minutes=30)).isoformat()
			}
		]

	def _risk_level(self, score: float) -> str:
		if score < 25: return 'low'
		if score < 50: return 'medium'
		if score < 75: return 'high'
		return 'critical'

	def _recommendations(self, score: float) -> List[str]:
		if score < 25: return ['Appears safe', 'Continue monitoring']
		if score < 50: return ['Exercise caution', 'Review details']
		if score < 75: return ['High risk', 'Consider delaying']
		return ['Critical risk', 'Immediate action required']

	def _vuln_level(self, vulns: List[str]) -> str:
		if not vulns: return 'low'
		if len(vulns) == 1: return 'medium'
		if len(vulns) == 2: return 'high'
		return 'critical'

	def _vuln_recos(self, vulns: List[str]) -> List[str]:
		recos: List[str] = []
		if 'Reentrancy' in vulns: recos.append('Add reentrancy guards')
		if 'Logic Errors' in vulns: recos.append('Code review & tests')
		if 'Access Control' in vulns: recos.append('Harden roles/permissions')
		return recos
