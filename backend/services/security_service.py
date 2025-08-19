import hashlib
import random
import re
from typing import Any, Dict


def _seed_from_text(text: str) -> int:
    h = hashlib.sha256(text.encode()).hexdigest()
    return int(h[:8], 16)


def score_wallet_safety(address: str) -> Dict[str, Any]:
    """Heuristic wallet safety score (0-100) with factors.
    This is a lightweight placeholder suitable for demos. Replace with on-chain analytics later.
    """
    rnd = random.Random(_seed_from_text(address.lower()))
    score = max(0.0, min(100.0, 100 - rnd.random() * 40 - (5 if address.lower().startswith('0xdead') else 0)))
    factors = []
    if rnd.random() > 0.6:
        factors.append('Many low-value txs (bot-like)')
        score -= 10
    if rnd.random() > 0.7:
        factors.append('Interacted with risky contracts')
        score -= 15
    if rnd.random() > 0.7:
        factors.append('High failure rate')
        score -= 10
    score = round(max(0.0, min(100.0, score)), 1)
    level = 'low' if score >= 75 else 'medium' if score >= 50 else 'high' if score >= 25 else 'critical'
    return {
        'address': address,
        'score': score,
        'level': level,
        'factors': factors or ['No major issues detected'],
        'recommendations': (
            ['Rotate keys', 'Avoid unverified contracts'] if score < 50 else ['Enable 2FA on connected services']
        ),
    }


def predict_rug_pull(token_address: str) -> Dict[str, Any]:
    rnd = random.Random(_seed_from_text(token_address.lower()))
    risk = rnd.random() * 100
    flags = []
    if rnd.random() > 0.5:
        flags.append('Owner holds >50% supply')
        risk += 20
    if rnd.random() > 0.6:
        flags.append('Liquidity not locked')
        risk += 25
    if rnd.random() > 0.7:
        flags.append('Proxy upgradeable without delay')
        risk += 15
    risk = round(max(0.0, min(100.0, risk)), 1)
    level = 'low' if risk < 25 else 'medium' if risk < 50 else 'high' if risk < 75 else 'critical'
    return {
        'token': token_address,
        'risk_score': risk,
        'risk_level': level,
        'red_flags': flags or ['None apparent from heuristics'],
        'recommendations': ['Verify liquidity lock', 'Check renounced ownership', 'Audit contract']
    }


PHISHING_PATTERNS = [
    r'\b[a-z0-9-]*airdrop[a-z0-9-]*\b',
    r'\bclaim\b',
    r'\.xn--',  # punycode
    r'wallet(connect|restore)',
]


def check_phishing(url: str) -> Dict[str, Any]:
    lowered = url.lower()
    matches = [p for p in PHISHING_PATTERNS if re.search(p, lowered)]
    suspicious_tld = lowered.endswith(('.zip', '.mov'))
    score = 20
    if matches:
        score += 50
    if suspicious_tld:
        score += 30
    if '://' not in lowered:
        score += 10
    score = min(score, 100)
    level = 'safe' if score < 25 else 'warning' if score < 50 else 'suspicious' if score < 75 else 'malicious'
    return {
        'url': url,
        'score': score,
        'label': level,
        'matches': matches,
        'tips': ['Open only verified links', 'Check domain spelling', 'Avoid connecting wallet on unknown sites']
    }


