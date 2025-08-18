from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException, Depends, Body
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import socketio
import asyncio
import json
import os
from datetime import datetime, timedelta
from typing import List, Dict, Any
import logging
from dotenv import load_dotenv

# Import custom modules
from models.alert import Alert, AlertCreate, AlertUpdate
from models.transaction import Transaction, TransactionCreate
from models.contract import SmartContract, ContractCreate
from models.wallet import Wallet, WalletCreate
from services.blockchain_monitor import BlockchainMonitor
from services.ai_service import AIService
from services.alert_service import AlertService
from services.firebase_service import FirebaseService
from utils.auth import verify_token

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="DeFi Guardian AI API",
    description="AI-powered security monitoring and anomaly detection platform for BNB Chain",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Socket.IO
sio = socketio.AsyncServer(
    async_mode='asgi',
    cors_allowed_origins=["http://localhost:3000", "http://127.0.0.1:3000"]
)
socket_app = socketio.ASGIApp(sio, app)

# Initialize services
blockchain_monitor = BlockchainMonitor()
ai_service = AIService()
alert_service = AlertService()
firebase_service = FirebaseService()

# Security
security = HTTPBearer()

# WebSocket connection manager
class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def send_personal_message(self, message: str, websocket: WebSocket):
        await websocket.send_text(message)

    async def broadcast(self, message: str):
        for connection in self.active_connections:
            try:
                await connection.send_text(message)
            except:
                # Remove disconnected clients
                self.active_connections.remove(connection)

manager = ConnectionManager()

# Dependency for authentication
async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        user = verify_token(credentials.credentials)
        return user
    except Exception as e:
        raise HTTPException(status_code=401, detail="Invalid authentication credentials")

# Socket.IO events
@sio.event
async def connect(sid, environ):
    logger.info(f"Client connected: {sid}")
    await sio.emit('status', {'message': 'Connected to DeFi Guardian AI'}, room=sid)

@sio.event
async def disconnect(sid):
    logger.info(f"Client disconnected: {sid}")

@sio.event
async def join_monitoring(sid, data):
    """Join real-time monitoring room"""
    await sio.enter_room(sid, 'monitoring')
    await sio.emit('joined_monitoring', {'message': 'Joined monitoring room'}, room=sid)

# API Routes

@app.get("/")
async def root():
    return {
        "message": "DeFi Guardian AI API",
        "version": "1.0.0",
        "status": "operational"
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "services": {
            "blockchain_monitor": blockchain_monitor.is_healthy(),
            "ai_service": ai_service.is_healthy(),
            "alert_service": alert_service.is_healthy(),
            "firebase_service": firebase_service.is_healthy()
        }
    }

# Dashboard endpoints
@app.get("/api/dashboard/stats")
async def get_dashboard_stats():
    """Get dashboard statistics"""
    try:
        stats = await blockchain_monitor.get_dashboard_stats()
        return JSONResponse(content=stats)
    except Exception as e:
        logger.error(f"Error getting dashboard stats: {e}")
        raise HTTPException(status_code=500, detail="Failed to get dashboard statistics")

@app.get("/api/dashboard/risk-metrics")
async def get_risk_metrics():
    """Get current risk metrics"""
    try:
        metrics = await ai_service.get_risk_metrics()
        return JSONResponse(content=metrics)
    except Exception as e:
        logger.error(f"Error getting risk metrics: {e}")
        raise HTTPException(status_code=500, detail="Failed to get risk metrics")

# Smart contract analyzer
@app.post("/api/analyze/contract")
async def analyze_contract(payload: Dict[str, Any] = Body(...)):
    try:
        source = payload.get("source", "")
        if not isinstance(source, str) or not source.strip():
            raise HTTPException(status_code=400, detail="'source' must be a non-empty string of Solidity code")
        result = await ai_service.analyze_contract_source(source)
        return JSONResponse(content=result)
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error analyzing contract: {e}")
        raise HTTPException(status_code=500, detail="Failed to analyze contract")

# Monitoring endpoints
@app.get("/api/monitoring/transactions")
async def get_recent_transactions(limit: int = 50):
    """Get recent transactions"""
    try:
        transactions = await blockchain_monitor.get_recent_transactions(limit)
        return JSONResponse(content=transactions)
    except Exception as e:
        logger.error(f"Error getting transactions: {e}")
        raise HTTPException(status_code=500, detail="Failed to get transactions")

@app.get("/api/monitoring/contracts")
async def get_monitored_contracts():
    """Get monitored smart contracts"""
    try:
        contracts = await blockchain_monitor.get_monitored_contracts()
        return JSONResponse(content=contracts)
    except Exception as e:
        logger.error(f"Error getting contracts: {e}")
        raise HTTPException(status_code=500, detail="Failed to get contracts")

@app.get("/api/monitoring/wallets")
async def get_monitored_wallets():
    """Get monitored wallets"""
    try:
        wallets = await blockchain_monitor.get_monitored_wallets()
        return JSONResponse(content=wallets)
    except Exception as e:
        logger.error(f"Error getting wallets: {e}")
        raise HTTPException(status_code=500, detail="Failed to get wallets")

# Alert endpoints
@app.get("/api/alerts")
async def get_alerts(
    severity: str = None,
    type: str = None,
    limit: int = 100,
    user = Depends(security)
):
    """Get alerts with optional filtering"""
    try:
        alerts = await alert_service.get_alerts(severity=severity, type=type, limit=limit)
        return JSONResponse(content=alerts)
    except Exception as e:
        logger.error(f"Error getting alerts: {e}")
        raise HTTPException(status_code=500, detail="Failed to get alerts")

@app.post("/api/alerts")
async def create_alert(alert: AlertCreate, user = Depends(security)):
    """Create a new alert"""
    try:
        new_alert = await alert_service.create_alert(alert)
        # Broadcast to connected clients
        await sio.emit('alert', new_alert.dict())
        return JSONResponse(content=new_alert.dict(), status_code=201)
    except Exception as e:
        logger.error(f"Error creating alert: {e}")
        raise HTTPException(status_code=500, detail="Failed to create alert")

@app.put("/api/alerts/{alert_id}")
async def update_alert(alert_id: str, alert_update: AlertUpdate, user = Depends(security)):
    """Update an alert"""
    try:
        updated_alert = await alert_service.update_alert(alert_id, alert_update)
        return JSONResponse(content=updated_alert.dict())
    except Exception as e:
        logger.error(f"Error updating alert: {e}")
        raise HTTPException(status_code=500, detail="Failed to update alert")

@app.delete("/api/alerts/{alert_id}")
async def delete_alert(alert_id: str, user = Depends(security)):
    """Delete an alert"""
    try:
        await alert_service.delete_alert(alert_id)
        return {"message": "Alert deleted successfully"}
    except Exception as e:
        logger.error(f"Error deleting alert: {e}")
        raise HTTPException(status_code=500, detail="Failed to delete alert")

# Analytics endpoints
@app.get("/api/analytics/risk-trends")
async def get_risk_trends(hours: int = 24):
    """Get risk trends over time"""
    try:
        trends = await ai_service.get_risk_trends(hours)
        return JSONResponse(content=trends)
    except Exception as e:
        logger.error(f"Error getting risk trends: {e}")
        raise HTTPException(status_code=500, detail="Failed to get risk trends")

@app.get("/api/analytics/vulnerabilities")
async def get_vulnerability_stats():
    """Get vulnerability statistics"""
    try:
        stats = await ai_service.get_vulnerability_stats()
        return JSONResponse(content=stats)
    except Exception as e:
        logger.error(f"Error getting vulnerability stats: {e}")
        raise HTTPException(status_code=500, detail="Failed to get vulnerability statistics")

@app.get("/api/analytics/insights")
async def get_ai_insights():
    """Get AI-generated insights"""
    try:
        insights = await ai_service.get_insights()
        return JSONResponse(content=insights)
    except Exception as e:
        logger.error(f"Error getting AI insights: {e}")
        raise HTTPException(status_code=500, detail="Failed to get AI insights")

# Blockchain monitoring endpoints
@app.post("/api/monitoring/start")
async def start_monitoring(user = Depends(security)):
    """Start blockchain monitoring"""
    try:
        await blockchain_monitor.start()
        return {"message": "Monitoring started successfully"}
    except Exception as e:
        logger.error(f"Error starting monitoring: {e}")
        raise HTTPException(status_code=500, detail="Failed to start monitoring")

@app.post("/api/monitoring/stop")
async def stop_monitoring(user = Depends(security)):
    """Stop blockchain monitoring"""
    try:
        await blockchain_monitor.stop()
        return {"message": "Monitoring stopped successfully"}
    except Exception as e:
        logger.error(f"Error stopping monitoring: {e}")
        raise HTTPException(status_code=500, detail="Failed to stop monitoring")

@app.get("/api/monitoring/status")
async def get_monitoring_status():
    """Get monitoring status"""
    try:
        status = await blockchain_monitor.get_status()
        return JSONResponse(content=status)
    except Exception as e:
        logger.error(f"Error getting monitoring status: {e}")
        raise HTTPException(status_code=500, detail="Failed to get monitoring status")

# WebSocket endpoint for real-time updates
@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            # Handle incoming messages if needed
            await manager.send_personal_message(f"Message received: {data}", websocket)
    except WebSocketDisconnect:
        manager.disconnect(websocket)

# Background tasks
@app.on_event("startup")
async def startup_event():
    """Initialize services on startup"""
    logger.info("Starting DeFi Guardian AI backend...")
    try:
        await firebase_service.initialize()
        await blockchain_monitor.initialize()
        await ai_service.initialize()
        await alert_service.initialize()
        logger.info("All services initialized successfully")
    except Exception as e:
        logger.error(f"Error during startup: {e}")

@app.on_event("shutdown")
async def shutdown_event():
    """Cleanup on shutdown"""
    logger.info("Shutting down DeFi Guardian AI backend...")
    try:
        await blockchain_monitor.cleanup()
        await ai_service.cleanup()
        await alert_service.cleanup()
        logger.info("All services cleaned up successfully")
    except Exception as e:
        logger.error(f"Error during shutdown: {e}")

# Error handlers
@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    logger.error(f"Global exception handler: {exc}")
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error"}
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
