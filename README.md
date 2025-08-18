# DeFi Guardian AI 🛡️

An AI-powered, real-time security monitoring and anomaly detection platform for BNB Chain.

## 🎯 Problem Statement
Billions are lost in DeFi on BNB Chain due to smart contract exploits and fraud, eroding trust and causing financial losses.

## 🚀 Solution
DeFi Guardian AI provides real-time security monitoring and anomaly detection to protect users and protocols on BNB Chain.

## 🔥 Key Features

### 🤖 AI Applications
- **Smart Contract Vulnerability Prediction**: AI analyzes code to predict vulnerabilities pre-deployment and monitors deployed contracts for exploitation patterns
- **Real-time Anomaly & Fraud Detection**: AI identifies unusual transaction patterns, suspicious wallet activities, and abnormal liquidity pool behavior
- **Predictive Risk Scoring**: AI generates dynamic risk scores for DeFi protocols based on on-chain metrics and other data
- **Explainable AI (XAI)**: Provides clear reasons why an alert was triggered, enhancing transparency

### 📊 Real-time Monitoring
- Live transaction monitoring on BNB Chain
- Smart contract interaction analysis
- Liquidity pool behavior tracking
- Wallet activity profiling

### 🔔 Alert System
- Real-time notifications for suspicious activities
- Risk score updates
- Vulnerability alerts
- Fraud detection warnings

## 🛠️ Tech Stack

### Frontend
- React.js with TypeScript
- Material-UI for modern UI components
- Chart.js for data visualization
- Web3.js for blockchain interaction

### Backend
- Python FastAPI
- TensorFlow/PyTorch for AI models
- Scikit-learn for machine learning
- Kafka for real-time data streaming
- Firebase Firestore for database
- Firebase Authentication

### AI/ML
- Smart contract vulnerability detection
- Anomaly detection algorithms
- Risk scoring models
- Natural Language Processing for XAI

### Infrastructure
- Firebase Hosting
- Firebase Functions
- Real-time database
- Cloud Storage

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Python 3.9+
- Firebase CLI
- BNB Chain RPC access

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd defi-guardian-ai
```

2. **Install Frontend Dependencies**
```bash
cd frontend
npm install
```

3. **Install Backend Dependencies**
```bash
cd backend
pip install -r requirements.txt
```

4. **Setup Firebase**
```bash
firebase login
firebase init
```

5. **Configure Environment Variables**
```bash
cp .env.example .env
# Edit .env with your configuration
```

6. **Start Development Servers**
```bash
# Terminal 1 - Frontend
cd frontend
npm start

# Terminal 2 - Backend
cd backend
uvicorn main:app --reload

# Terminal 3 - AI Service
cd ai-service
python main.py
```

## 📁 Project Structure

```
defi-guardian-ai/
├── frontend/                 # React frontend application
├── backend/                  # FastAPI backend service
├── ai-service/              # AI/ML models and services
├── blockchain-monitor/      # BNB Chain monitoring service
├── firebase/               # Firebase configuration
├── docs/                   # Documentation
└── README.md
```

## 🔧 Configuration

### Environment Variables
- `BNB_CHAIN_RPC_URL`: BNB Chain RPC endpoint
- `FIREBASE_CONFIG`: Firebase configuration
- `AI_MODEL_PATH`: Path to trained AI models
- `KAFKA_BROKERS`: Kafka broker addresses

## 📊 Features in Detail

### 1. Smart Contract Vulnerability Prediction
- Static code analysis
- Pattern recognition for common vulnerabilities
- Historical exploit data correlation
- Real-time monitoring of deployed contracts

### 2. Anomaly Detection
- Transaction pattern analysis
- Wallet behavior profiling
- Liquidity pool monitoring
- Gas price anomaly detection

### 3. Risk Scoring
- Multi-factor risk assessment
- Protocol health metrics
- Market condition analysis
- Historical performance correlation

### 4. Explainable AI
- Clear alert explanations
- Risk factor breakdown
- Confidence scores
- Actionable recommendations

## 🎯 Hackathon Goals

- [x] Real-time BNB Chain monitoring
- [x] AI-powered vulnerability detection
- [x] Anomaly detection system
- [x] Risk scoring algorithm
- [x] Explainable AI implementation
- [x] Firebase integration
- [x] Modern React frontend
- [x] FastAPI backend
- [x] Real-time alerts
- [x] Data visualization

## 🤝 Contributing

This is a hackathon project. Feel free to contribute and improve the codebase!

## 📄 License

MIT License - see LICENSE file for details

## 🙏 Acknowledgments

- BNB Chain community
- OpenZeppelin for security best practices
- TensorFlow and PyTorch communities
- Firebase team for excellent documentation
