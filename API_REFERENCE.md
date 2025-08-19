# 🔌 CryptoVault Sentinel - API Reference

## 📋 **Overview**

This document provides a comprehensive reference for all API endpoints, data models, and integration details for the CryptoVault Sentinel application.

## 🌐 **Base URLs**

### **Development**
- **Frontend**: `http://localhost:3000`
- **Backend**: `http://localhost:8000`
- **WebSocket**: `ws://localhost:8000`

### **Production**
- **Frontend**: `https://yourdomain.com`
- **Backend**: `https://your-backend.railway.app`
- **WebSocket**: `wss://your-backend.railway.app`

## 🔐 **Authentication**

### **Firebase Authentication**
All API endpoints require valid Firebase authentication tokens.

```typescript
// Get current user token
const token = await user.getIdToken();

// Include in request headers
const headers = {
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json'
};
```

### **Token Validation**
```python
# Backend token validation
from firebase_admin import auth

async def verify_token(token: str):
    try:
        decoded_token = auth.verify_id_token(token)
        return decoded_token
    except Exception as e:
        raise HTTPException(status_code=401, detail="Invalid token")
```

## 📊 **Data Models**

### **User**
```typescript
interface User {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  createdAt: Timestamp;
  lastLoginAt: Timestamp;
}
```

### **User Settings**
```typescript
interface UserSettings {
  theme: 'light' | 'dark' | 'system';
  language: 'en' | 'es' | 'fr';
  currency: 'USD' | 'EUR' | 'BTC' | 'INR';
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  privacy: {
    profileVisible: boolean;
  };
  twoFactorEnabled: boolean;
}
```

### **Alert**
```typescript
interface Alert {
  id: string;
  userId: string;
  type: 'risk' | 'exploit' | 'anomaly' | 'security';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  contractAddress?: string;
  transactionHash?: string;
  createdAt: Timestamp;
  readAt?: Timestamp;
  dismissedAt?: Timestamp;
}
```

### **Monitored Contract**
```typescript
interface MonitoredContract {
  id: string;
  userId: string;
  address: string;
  name: string;
  chain: 'ethereum' | 'bsc' | 'polygon';
  riskScore: number;
  lastScanned: Timestamp;
  alerts: Alert[];
}
```

### **Risk Assessment**
```typescript
interface RiskAssessment {
  contractAddress: string;
  riskScore: number;
  riskFactors: {
    codeQuality: number;
    securityVulnerabilities: number;
    liquidityRisk: number;
    ownershipRisk: number;
    auditStatus: number;
  };
  recommendations: string[];
  lastUpdated: Timestamp;
}
```

## 🔌 **REST API Endpoints**

### **Authentication Endpoints**

#### **POST /api/auth/signin**
User sign-in with email and password.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "uid": "user123",
    "email": "user@example.com",
    "displayName": "John Doe"
  },
  "token": "firebase_jwt_token"
}
```

#### **POST /api/auth/signup**
User registration.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "displayName": "John Doe"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "uid": "user123",
    "email": "user@example.com",
    "displayName": "John Doe"
  }
}
```

#### **POST /api/auth/signout**
User sign-out.

**Response:**
```json
{
  "success": true,
  "message": "User signed out successfully"
}
```

#### **GET /api/auth/user**
Get current authenticated user.

**Response:**
```json
{
  "success": true,
  "user": {
    "uid": "user123",
    "email": "user@example.com",
    "displayName": "John Doe",
    "photoURL": "https://example.com/photo.jpg",
    "createdAt": "2024-01-01T00:00:00Z",
    "lastLoginAt": "2024-01-01T12:00:00Z"
  }
}
```

### **Settings Endpoints**

#### **GET /api/settings**
Get user settings.

**Response:**
```json
{
  "success": true,
  "settings": {
    "theme": "dark",
    "language": "en",
    "currency": "USD",
    "notifications": {
      "email": true,
      "push": false,
      "sms": false
    },
    "privacy": {
      "profileVisible": true
    },
    "twoFactorEnabled": false
  }
}
```

#### **PUT /api/settings**
Update user settings.

**Request Body:**
```json
{
  "theme": "light",
  "language": "es",
  "currency": "EUR"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Settings updated successfully",
  "settings": {
    "theme": "light",
    "language": "es",
    "currency": "EUR"
  }
}
```

#### **GET /api/settings/theme**
Get current theme preference.

**Response:**
```json
{
  "success": true,
  "theme": "dark"
}
```

### **Contract Monitoring Endpoints**

#### **GET /api/contracts**
Get user's monitored contracts.

**Query Parameters:**
- `chain` (optional): Filter by blockchain
- `limit` (optional): Number of results (default: 50)
- `offset` (optional): Pagination offset

**Response:**
```json
{
  "success": true,
  "contracts": [
    {
      "id": "contract123",
      "address": "0x1234...",
      "name": "Uniswap V3",
      "chain": "ethereum",
      "riskScore": 85,
      "lastScanned": "2024-01-01T12:00:00Z"
    }
  ],
  "total": 1,
  "limit": 50,
  "offset": 0
}
```

#### **POST /api/contracts**
Add contract to monitoring.

**Request Body:**
```json
{
  "address": "0x1234...",
  "name": "Uniswap V3",
  "chain": "ethereum"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Contract added to monitoring",
  "contract": {
    "id": "contract123",
    "address": "0x1234...",
    "name": "Uniswap V3",
    "chain": "ethereum",
    "riskScore": 0,
    "lastScanned": "2024-01-01T12:00:00Z"
  }
}
```

#### **GET /api/contracts/{id}**
Get specific contract details.

**Response:**
```json
{
  "success": true,
  "contract": {
    "id": "contract123",
    "address": "0x1234...",
    "name": "Uniswap V3",
    "chain": "ethereum",
    "riskScore": 85,
    "lastScanned": "2024-01-01T12:00:00Z",
    "alerts": []
  }
}
```

#### **DELETE /api/contracts/{id}**
Remove contract from monitoring.

**Response:**
```json
{
  "success": true,
  "message": "Contract removed from monitoring"
}
```

#### **GET /api/contracts/{id}/risk**
Get contract risk assessment.

**Response:**
```json
{
  "success": true,
  "riskAssessment": {
    "contractAddress": "0x1234...",
    "riskScore": 85,
    "riskFactors": {
      "codeQuality": 90,
      "securityVulnerabilities": 70,
      "liquidityRisk": 80,
      "ownershipRisk": 95,
      "auditStatus": 85
    },
    "recommendations": [
      "High ownership concentration risk",
      "Consider diversifying holdings"
    ],
    "lastUpdated": "2024-01-01T12:00:00Z"
  }
}
```

### **Alert Endpoints**

#### **GET /api/alerts**
Get user alerts.

**Query Parameters:**
- `type` (optional): Filter by alert type
- `severity` (optional): Filter by severity
- `status` (optional): Filter by status (read/unread)
- `limit` (optional): Number of results (default: 50)
- `offset` (optional): Pagination offset

**Response:**
```json
{
  "success": true,
  "alerts": [
    {
      "id": "alert123",
      "type": "risk",
      "severity": "high",
      "title": "High Risk Contract Detected",
      "description": "Contract 0x1234... shows high risk indicators",
      "contractAddress": "0x1234...",
      "createdAt": "2024-01-01T12:00:00Z",
      "readAt": null
    }
  ],
  "total": 1,
  "limit": 50,
  "offset": 0
}
```

#### **PUT /api/alerts/{id}/read**
Mark alert as read.

**Response:**
```json
{
  "success": true,
  "message": "Alert marked as read",
  "alert": {
    "id": "alert123",
    "readAt": "2024-01-01T12:00:00Z"
  }
}
```

#### **PUT /api/alerts/{id}/dismiss**
Dismiss alert.

**Response:**
```json
{
  "success": true,
  "message": "Alert dismissed",
  "alert": {
    "id": "alert123",
    "dismissedAt": "2024-01-01T12:00:00Z"
  }
}
```

#### **POST /api/alerts/subscribe**
Subscribe to alert types.

**Request Body:**
```json
{
  "types": ["risk", "exploit"],
  "severities": ["high", "critical"],
  "email": true,
  "push": false
}
```

**Response:**
```json
{
  "success": true,
  "message": "Alert preferences updated"
}
```

### **Blockchain Endpoints**

#### **GET /api/blockchain/status**
Get blockchain network status.

**Response:**
```json
{
  "success": true,
  "status": {
    "ethereum": {
      "connected": true,
      "latestBlock": 18000000,
      "gasPrice": "20000000000",
      "networkId": 1
    },
    "bsc": {
      "connected": true,
      "latestBlock": 30000000,
      "gasPrice": "5000000000",
      "networkId": 56
    }
  }
}
```

#### **GET /api/blockchain/transactions**
Get recent transactions.

**Query Parameters:**
- `chain` (required): Blockchain network
- `address` (optional): Filter by address
- `limit` (optional): Number of results (default: 20)

**Response:**
```json
{
  "success": true,
  "transactions": [
    {
      "hash": "0x1234...",
      "from": "0xabcd...",
      "to": "0x5678...",
      "value": "1000000000000000000",
      "gasPrice": "20000000000",
      "blockNumber": 18000000,
      "timestamp": "2024-01-01T12:00:00Z"
    }
  ]
}
```

#### **POST /api/blockchain/scan**
Scan contract for vulnerabilities.

**Request Body:**
```json
{
  "address": "0x1234...",
  "chain": "ethereum"
}
```

**Response:**
```json
{
  "success": true,
  "scan": {
    "contractAddress": "0x1234...",
    "scanId": "scan123",
    "status": "completed",
    "vulnerabilities": [
      {
        "type": "reentrancy",
        "severity": "high",
        "description": "Potential reentrancy vulnerability detected",
        "line": 45
      }
    ],
    "completedAt": "2024-01-01T12:00:00Z"
  }
}
```

### **AI Services Endpoints**

#### **POST /api/ai/wallet-safety**
Analyze wallet safety.

**Request Body:**
```json
{
  "address": "0x1234...",
  "chain": "ethereum"
}
```

**Response:**
```json
{
  "success": true,
  "analysis": {
    "address": "0x1234...",
    "safetyScore": 85,
    "riskFactors": [
      "High transaction volume",
      "Multiple contract interactions"
    ],
    "recommendations": [
      "Monitor for unusual activity",
      "Review contract interactions"
    ],
    "analyzedAt": "2024-01-01T12:00:00Z"
  }
}
```

#### **POST /api/ai/rug-pull-prediction**
Predict rug pull probability.

**Request Body:**
```json
{
  "contractAddress": "0x1234...",
  "chain": "ethereum"
}
```

**Response:**
```json
{
  "success": true,
  "prediction": {
    "contractAddress": "0x1234...",
    "rugPullProbability": 0.15,
    "riskFactors": [
      "Low liquidity",
      "High ownership concentration"
    ],
    "confidence": 0.85,
    "analyzedAt": "2024-01-01T12:00:00Z"
  }
}
```

#### **POST /api/ai/phishing-detection**
Detect phishing attempts.

**Request Body:**
```json
{
  "url": "https://example.com",
  "contractAddress": "0x1234..."
}
```

**Response:**
```json
{
  "success": true,
  "detection": {
    "url": "https://example.com",
    "contractAddress": "0x1234...",
    "isPhishing": false,
    "confidence": 0.95,
    "riskFactors": [],
    "analyzedAt": "2024-01-01T12:00:00Z"
  }
}
```

## 🔄 **WebSocket API**

### **Connection**
```typescript
import { io } from 'socket.io-client';

const socket = io(API_BASE, {
  auth: {
    token: userToken
  }
});
```

### **Events**

#### **Client to Server**

##### **join_room**
Join user-specific room for personalized notifications.

```typescript
socket.emit('join_room', { userId: user.uid });
```

##### **leave_room**
Leave user-specific room.

```typescript
socket.emit('leave_room', { userId: user.uid });
```

##### **subscribe_contract**
Subscribe to contract events.

```typescript
socket.emit('subscribe_contract', {
  contractAddress: '0x1234...',
  chain: 'ethereum'
});
```

##### **unsubscribe_contract**
Unsubscribe from contract events.

```typescript
socket.emit('unsubscribe_contract', {
  contractAddress: '0x1234...',
  chain: 'ethereum'
});
```

#### **Server to Client**

##### **new_alert**
New security alert notification.

```typescript
socket.on('new_alert', (alert) => {
  console.log('New alert:', alert);
  // Handle new alert
});
```

##### **contract_update**
Contract risk score update.

```typescript
socket.on('contract_update', (update) => {
  console.log('Contract update:', update);
  // Handle contract update
});
```

##### **transaction_detected**
New transaction detected.

```typescript
socket.on('transaction_detected', (transaction) => {
  console.log('Transaction detected:', transaction);
  // Handle transaction
});
```

##### **vulnerability_found**
Security vulnerability detected.

```typescript
socket.on('vulnerability_found', (vulnerability) => {
  console.log('Vulnerability found:', vulnerability);
  // Handle vulnerability
});
```

## 📊 **Error Handling**

### **Error Response Format**
```json
{
  "success": false,
  "error": {
    "code": "AUTHENTICATION_FAILED",
    "message": "Invalid authentication token",
    "details": "Token expired or invalid"
  },
  "timestamp": "2024-01-01T12:00:00Z"
}
```

### **Common Error Codes**

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `AUTHENTICATION_FAILED` | 401 | Invalid or expired token |
| `PERMISSION_DENIED` | 403 | Insufficient permissions |
| `NOT_FOUND` | 404 | Resource not found |
| `VALIDATION_ERROR` | 422 | Invalid request data |
| `INTERNAL_ERROR` | 500 | Server internal error |
| `SERVICE_UNAVAILABLE` | 503 | Service temporarily unavailable |

### **Rate Limiting**
- **Standard endpoints**: 100 requests per minute
- **AI endpoints**: 20 requests per minute
- **WebSocket connections**: 10 per user

## 🔒 **Security Considerations**

### **Authentication**
- All endpoints require valid Firebase JWT tokens
- Tokens are validated on every request
- Automatic token refresh handled by Firebase SDK

### **Authorization**
- Users can only access their own data
- Contract monitoring limited to user's contracts
- Alert access restricted to user's alerts

### **Data Validation**
- All input data validated using Pydantic models
- SQL injection protection through parameterized queries
- XSS protection through input sanitization

### **CORS Configuration**
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://yourdomain.com"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"]
)
```

## 📱 **Mobile API Considerations**

### **Response Optimization**
- Pagination for large datasets
- Field selection for reduced payload
- Compression enabled for all responses

### **Offline Support**
- Firestore offline persistence
- Local caching of frequently accessed data
- Sync when connection restored

## 🧪 **Testing Endpoints**

### **Health Check**
```http
GET /api/health
```

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T12:00:00Z",
  "version": "1.0.0"
}
```

### **Test Authentication**
```http
GET /api/test/auth
```

**Response:**
```json
{
  "success": true,
  "message": "Authentication working",
  "user": {
    "uid": "test123",
    "email": "test@example.com"
  }
}
```

## 📚 **SDK Examples**

### **JavaScript/TypeScript**
```typescript
class CryptoVaultAPI {
  private baseUrl: string;
  private token: string;

  constructor(baseUrl: string, token: string) {
    this.baseUrl = baseUrl;
    this.token = token;
  }

  async getContracts() {
    const response = await fetch(`${this.baseUrl}/api/contracts`, {
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': 'application/json'
      }
    });
    return response.json();
  }

  async addContract(contract: any) {
    const response = await fetch(`${this.baseUrl}/api/contracts`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(contract)
    });
    return response.json();
  }
}
```

### **Python**
```python
import requests
import json

class CryptoVaultAPI:
    def __init__(self, base_url: str, token: str):
        self.base_url = base_url
        self.token = token
        self.headers = {
            'Authorization': f'Bearer {token}',
            'Content-Type': 'application/json'
        }

    def get_contracts(self):
        response = requests.get(
            f'{self.base_url}/api/contracts',
            headers=self.headers
        )
        return response.json()

    def add_contract(self, contract: dict):
        response = requests.post(
            f'{self.base_url}/api/contracts',
            headers=self.headers,
            json=contract
        )
        return response.json()
```

## 📈 **Performance Metrics**

### **Response Times**
- **Simple queries**: < 100ms
- **Complex queries**: < 500ms
- **AI analysis**: < 2s
- **Real-time events**: < 100ms

### **Throughput**
- **API requests**: 1000+ requests/second
- **WebSocket connections**: 1000+ concurrent
- **Database operations**: 500+ operations/second

## 🔄 **Versioning**

### **API Versioning Strategy**
- **Current version**: v1
- **Version in URL**: `/api/v1/endpoint`
- **Backward compatibility**: Maintained for 6 months
- **Deprecation notice**: 3 months advance warning

### **Version Migration**
```typescript
// Check API version
const response = await fetch('/api/version');
const { version, deprecated, migrationGuide } = await response.json();

if (deprecated) {
  console.warn(`API version ${version} is deprecated. See: ${migrationGuide}`);
}
```

---

## 📞 **Support**

For API support and questions:
- **Documentation**: [Project Docs](./PROJECT_DOCUMENTATION.md)
- **Issues**: [GitHub Issues](https://github.com/your-repo/cryptovault-sentinel/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-repo/cryptovault-sentinel/discussions)

**API Status**: [Status Page](https://status.yourdomain.com)
