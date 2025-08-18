# DeFi Guardian AI - Deployment Guide

This guide covers deploying the DeFi Guardian AI platform to production environments.

## 🚀 Quick Deployment

### 1. Prerequisites

- Node.js 18+ and npm
- Python 3.9+ and pip
- Firebase CLI (`npm install -g firebase-tools`)
- Docker (optional, for containerized deployment)
- A Firebase project
- BNB Chain RPC access

### 2. Automated Setup

```bash
# Clone the repository
git clone <repository-url>
cd defi-guardian-ai

# Run automated setup
python setup.py

# Or manually install dependencies
npm run install-all
```

### 3. Configuration

1. **Environment Variables**
   ```bash
   cp env.example .env
   # Edit .env with your configuration
   ```

2. **Firebase Setup**
   ```bash
   firebase login
   firebase init
   # Select your project and enable required services
   ```

3. **BNB Chain Configuration**
   - Add your RPC endpoints to `.env`
   - Configure WebSocket connections
   - Set up API keys for external services

## 🐳 Docker Deployment

### Docker Compose Setup

```yaml
# docker-compose.yml
version: '3.8'

services:
  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    environment:
      - REACT_APP_API_URL=http://localhost:8000
    depends_on:
      - backend

  backend:
    build: ./backend
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=${DATABASE_URL}
      - BNB_CHAIN_RPC_URL=${BNB_CHAIN_RPC_URL}
    volumes:
      - ./data:/app/data

  ai-service:
    build: ./ai-service
    environment:
      - MODEL_PATH=/app/models
    volumes:
      - ./ai-service/models:/app/models

  redis:
    image: redis:alpine
    ports:
      - "6379:6379"

  kafka:
    image: confluentinc/cp-kafka:latest
    environment:
      KAFKA_BROKER_ID: 1
      KAFKA_ZOOKEEPER_CONNECT: zookeeper:2181
      KAFKA_ADVERTISED_LISTENERS: PLAINTEXT://kafka:9092
      KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR: 1
    ports:
      - "9092:9092"
    depends_on:
      - zookeeper

  zookeeper:
    image: confluentinc/cp-zookeeper:latest
    environment:
      ZOOKEEPER_CLIENT_PORT: 2181
```

### Build and Run

```bash
# Build images
docker-compose build

# Start services
docker-compose up -d

# View logs
docker-compose logs -f
```

## ☁️ Cloud Deployment

### Firebase Hosting

```bash
# Build frontend
cd frontend
npm run build

# Deploy to Firebase
firebase deploy --only hosting
```

### Backend Deployment Options

#### 1. Google Cloud Run

```bash
# Build and deploy backend
gcloud builds submit --tag gcr.io/PROJECT_ID/defi-guardian-backend
gcloud run deploy defi-guardian-backend \
  --image gcr.io/PROJECT_ID/defi-guardian-backend \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

#### 2. Heroku

```bash
# Create Heroku app
heroku create defi-guardian-ai

# Set environment variables
heroku config:set DATABASE_URL=your_database_url
heroku config:set BNB_CHAIN_RPC_URL=your_rpc_url

# Deploy
git push heroku main
```

#### 3. AWS ECS

```bash
# Build and push to ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 123456789012.dkr.ecr.us-east-1.amazonaws.com
docker build -t defi-guardian-backend .
docker tag defi-guardian-backend:latest 123456789012.dkr.ecr.us-east-1.amazonaws.com/defi-guardian-backend:latest
docker push 123456789012.dkr.ecr.us-east-1.amazonaws.com/defi-guardian-backend:latest

# Deploy to ECS
aws ecs update-service --cluster defi-guardian --service backend --force-new-deployment
```

## 🔧 Production Configuration

### Environment Variables

```bash
# Production environment variables
NODE_ENV=production
DEBUG=false
LOG_LEVEL=WARNING

# Database
DATABASE_URL=your_production_database_url
REDIS_URL=your_redis_url

# Blockchain
BNB_CHAIN_RPC_URL=your_production_rpc_url
BNB_CHAIN_WS_URL=your_production_ws_url

# AI Models
AI_MODEL_PATH=/app/models
MODEL_CONFIDENCE_THRESHOLD=0.9
ANOMALY_DETECTION_SENSITIVITY=0.8

# Security
JWT_SECRET=your_secure_jwt_secret
ENCRYPTION_KEY=your_encryption_key

# Monitoring
MONITORING_INTERVAL=1000
ALERT_COOLDOWN=60000
MAX_CONCURRENT_REQUESTS=200
```

### Security Considerations

1. **API Security**
   - Use HTTPS in production
   - Implement rate limiting
   - Add API key authentication
   - Enable CORS properly

2. **Database Security**
   - Use connection pooling
   - Enable SSL connections
   - Implement proper access controls
   - Regular backups

3. **AI Model Security**
   - Validate input data
   - Implement model versioning
   - Monitor model performance
   - Secure model storage

### Performance Optimization

1. **Frontend**
   ```bash
   # Enable production optimizations
   npm run build
   npm run analyze  # Bundle analysis
   ```

2. **Backend**
   ```python
   # Enable async processing
   # Use connection pooling
   # Implement caching
   # Monitor performance metrics
   ```

3. **Database**
   ```bash
   # Optimize queries
   # Add indexes
   # Use read replicas
   # Implement caching
   ```

## 📊 Monitoring and Logging

### Application Monitoring

```python
# Add monitoring to backend
import logging
from prometheus_client import Counter, Histogram

# Metrics
request_count = Counter('http_requests_total', 'Total HTTP requests')
request_duration = Histogram('http_request_duration_seconds', 'HTTP request duration')

# Logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('app.log'),
        logging.StreamHandler()
    ]
)
```

### Health Checks

```python
# Health check endpoint
@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "services": {
            "database": await check_database_health(),
            "blockchain": await check_blockchain_health(),
            "ai_models": await check_ai_models_health()
        }
    }
```

### Alerting

```python
# Alert configuration
ALERT_CONFIG = {
    "email": {
        "enabled": True,
        "recipients": ["admin@example.com"],
        "smtp_server": "smtp.gmail.com",
        "smtp_port": 587
    },
    "slack": {
        "enabled": True,
        "webhook_url": "your_slack_webhook_url"
    },
    "discord": {
        "enabled": False,
        "webhook_url": "your_discord_webhook_url"
    }
}
```

## 🔄 CI/CD Pipeline

### GitHub Actions

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Run tests
        run: |
          npm test
          python -m pytest

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Firebase
        run: |
          npm install -g firebase-tools
          firebase deploy --token ${{ secrets.FIREBASE_TOKEN }}
      - name: Deploy Backend
        run: |
          # Deploy backend to cloud provider
```

## 🚨 Troubleshooting

### Common Issues

1. **Frontend Build Failures**
   ```bash
   # Clear cache and reinstall
   rm -rf node_modules package-lock.json
   npm install
   npm run build
   ```

2. **Backend Import Errors**
   ```bash
   # Check Python environment
   python -m pip install --upgrade pip
   pip install -r requirements.txt
   ```

3. **Database Connection Issues**
   ```bash
   # Test database connection
   python -c "import firebase_admin; print('Firebase connection OK')"
   ```

4. **AI Model Loading Issues**
   ```bash
   # Check model files
   ls -la ai-service/models/
   # Re-train models if needed
   python ai-service/train_models.py
   ```

### Performance Issues

1. **High Memory Usage**
   - Monitor memory usage
   - Optimize data structures
   - Implement garbage collection

2. **Slow Response Times**
   - Add caching layers
   - Optimize database queries
   - Use async processing

3. **AI Model Performance**
   - Monitor model accuracy
   - Retrain models regularly
   - Use model versioning

## 📈 Scaling

### Horizontal Scaling

```yaml
# Kubernetes deployment
apiVersion: apps/v1
kind: Deployment
metadata:
  name: defi-guardian-backend
spec:
  replicas: 3
  selector:
    matchLabels:
      app: defi-guardian-backend
  template:
    metadata:
      labels:
        app: defi-guardian-backend
    spec:
      containers:
      - name: backend
        image: defi-guardian-backend:latest
        ports:
        - containerPort: 8000
        resources:
          requests:
            memory: "512Mi"
            cpu: "250m"
          limits:
            memory: "1Gi"
            cpu: "500m"
```

### Load Balancing

```yaml
# Nginx configuration
upstream backend {
    server backend1:8000;
    server backend2:8000;
    server backend3:8000;
}

server {
    listen 80;
    server_name api.defiguardian.ai;
    
    location / {
        proxy_pass http://backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## 🔐 Security Checklist

- [ ] HTTPS enabled
- [ ] Environment variables secured
- [ ] API rate limiting implemented
- [ ] Input validation added
- [ ] SQL injection prevention
- [ ] XSS protection enabled
- [ ] CORS properly configured
- [ ] Authentication implemented
- [ ] Authorization checks added
- [ ] Logging and monitoring active
- [ ] Regular security updates
- [ ] Backup strategy in place

## 📞 Support

For deployment issues or questions:

1. Check the troubleshooting section
2. Review logs and error messages
3. Consult the API documentation
4. Open an issue on GitHub
5. Contact the development team

---

**Happy Deploying! 🚀**
