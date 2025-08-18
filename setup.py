#!/usr/bin/env python3
"""
DeFi Guardian AI Setup Script
Automated installation and configuration for the DeFi Guardian AI platform
"""

import os
import sys
import subprocess
import json
import shutil
from pathlib import Path

def run_command(command, cwd=None):
    """Run a shell command and return the result"""
    try:
        result = subprocess.run(
            command,
            shell=True,
            cwd=cwd,
            capture_output=True,
            text=True,
            check=True
        )
        return result.stdout.strip()
    except subprocess.CalledProcessError as e:
        print(f"Error running command: {command}")
        print(f"Error: {e.stderr}")
        return None

def check_prerequisites():
    """Check if required software is installed"""
    print("🔍 Checking prerequisites...")
    
    # Check Node.js
    node_version = run_command("node --version")
    if not node_version:
        print("❌ Node.js is not installed. Please install Node.js 18+")
        return False
    print(f"✅ Node.js: {node_version}")
    
    # Check npm
    npm_version = run_command("npm --version")
    if not npm_version:
        print("❌ npm is not installed")
        return False
    print(f"✅ npm: {npm_version}")
    
    # Check Python
    python_version = run_command("python --version")
    if not python_version:
        print("❌ Python is not installed. Please install Python 3.9+")
        return False
    print(f"✅ Python: {python_version}")
    
    # Check pip
    pip_version = run_command("pip --version")
    if not pip_version:
        print("❌ pip is not installed")
        return False
    print(f"✅ pip: {pip_version}")
    
    return True

def install_frontend_dependencies():
    """Install frontend dependencies"""
    print("\n📦 Installing frontend dependencies...")
    
    if not os.path.exists("frontend"):
        print("❌ Frontend directory not found")
        return False
    
    result = run_command("npm install", cwd="frontend")
    if result is None:
        print("❌ Failed to install frontend dependencies")
        return False
    
    print("✅ Frontend dependencies installed successfully")
    return True

def install_backend_dependencies():
    """Install backend dependencies"""
    print("\n🐍 Installing backend dependencies...")
    
    if not os.path.exists("backend"):
        print("❌ Backend directory not found")
        return False
    
    result = run_command("pip install -r requirements.txt", cwd="backend")
    if result is None:
        print("❌ Failed to install backend dependencies")
        return False
    
    print("✅ Backend dependencies installed successfully")
    return True

def setup_firebase():
    """Setup Firebase configuration"""
    print("\n🔥 Setting up Firebase...")
    
    # Check if Firebase CLI is installed
    firebase_version = run_command("firebase --version")
    if not firebase_version:
        print("❌ Firebase CLI is not installed. Please install it with: npm install -g firebase-tools")
        return False
    
    print(f"✅ Firebase CLI: {firebase_version}")
    
    # Create firebase config if it doesn't exist
    if not os.path.exists("firebase/firebase.json"):
        print("📝 Creating Firebase configuration...")
        os.makedirs("firebase", exist_ok=True)
        
        # Copy firebase config files
        firebase_files = [
            "firebase.json",
            "firestore.rules",
            "storage.rules"
        ]
        
        for file in firebase_files:
            if os.path.exists(f"firebase/{file}"):
                print(f"✅ {file} already exists")
            else:
                print(f"❌ {file} not found in firebase directory")
    
    print("✅ Firebase setup completed")
    return True

def create_env_file():
    """Create environment file from template"""
    print("\n⚙️ Setting up environment configuration...")
    
    if os.path.exists(".env"):
        print("✅ .env file already exists")
        return True
    
    if os.path.exists("env.example"):
        shutil.copy("env.example", ".env")
        print("✅ Created .env file from template")
        print("⚠️  Please edit .env file with your configuration")
    else:
        print("❌ env.example file not found")
        return False
    
    return True

def create_directories():
    """Create necessary directories"""
    print("\n📁 Creating directories...")
    
    directories = [
        "backend/models",
        "backend/services",
        "backend/utils",
        "ai-service/models",
        "logs",
        "data"
    ]
    
    for directory in directories:
        os.makedirs(directory, exist_ok=True)
        print(f"✅ Created {directory}")
    
    return True

def generate_sample_data():
    """Generate sample data for development"""
    print("\n📊 Generating sample data...")
    
    # Create sample configuration
    sample_config = {
        "app_name": "DeFi Guardian AI",
        "version": "1.0.0",
        "environment": "development",
        "features": {
            "ai_monitoring": True,
            "real_time_alerts": True,
            "risk_scoring": True,
            "vulnerability_detection": True
        }
    }
    
    with open("config.json", "w") as f:
        json.dump(sample_config, f, indent=2)
    
    print("✅ Generated sample configuration")
    return True

def run_tests():
    """Run basic tests to verify installation"""
    print("\n🧪 Running basic tests...")
    
    # Test frontend build
    print("Testing frontend build...")
    result = run_command("npm run build", cwd="frontend")
    if result is None:
        print("❌ Frontend build test failed")
        return False
    print("✅ Frontend build test passed")
    
    # Test backend imports
    print("Testing backend imports...")
    result = run_command("python -c 'import fastapi; import web3; import firebase_admin'", cwd="backend")
    if result is None:
        print("❌ Backend import test failed")
        return False
    print("✅ Backend import test passed")
    
    return True

def print_next_steps():
    """Print next steps for the user"""
    print("\n" + "="*60)
    print("🎉 DeFi Guardian AI Setup Completed!")
    print("="*60)
    print("\n📋 Next Steps:")
    print("1. Edit .env file with your configuration:")
    print("   - Add your Firebase project credentials")
    print("   - Configure BNB Chain RPC endpoints")
    print("   - Set up API keys for external services")
    print("\n2. Initialize Firebase project:")
    print("   firebase login")
    print("   firebase init")
    print("\n3. Start the development servers:")
    print("   npm run dev")
    print("\n4. Access the application:")
    print("   Frontend: http://localhost:3000")
    print("   Backend API: http://localhost:8000")
    print("   API Docs: http://localhost:8000/docs")
    print("\n📚 Documentation:")
    print("   - README.md: Project overview and setup")
    print("   - API documentation: http://localhost:8000/docs")
    print("\n🔧 Development:")
    print("   - Frontend: React + TypeScript + Material-UI")
    print("   - Backend: FastAPI + Python")
    print("   - AI: TensorFlow + Scikit-learn")
    print("   - Database: Firebase Firestore")
    print("\n🚀 Happy coding!")

def main():
    """Main setup function"""
    print("🚀 DeFi Guardian AI Setup Script")
    print("="*40)
    
    # Check prerequisites
    if not check_prerequisites():
        print("\n❌ Prerequisites check failed. Please install required software.")
        sys.exit(1)
    
    # Create directories
    if not create_directories():
        print("\n❌ Failed to create directories.")
        sys.exit(1)
    
    # Install dependencies
    if not install_frontend_dependencies():
        print("\n❌ Failed to install frontend dependencies.")
        sys.exit(1)
    
    if not install_backend_dependencies():
        print("\n❌ Failed to install backend dependencies.")
        sys.exit(1)
    
    # Setup Firebase
    if not setup_firebase():
        print("\n❌ Failed to setup Firebase.")
        sys.exit(1)
    
    # Create environment file
    if not create_env_file():
        print("\n❌ Failed to create environment file.")
        sys.exit(1)
    
    # Generate sample data
    if not generate_sample_data():
        print("\n❌ Failed to generate sample data.")
        sys.exit(1)
    
    # Run tests
    if not run_tests():
        print("\n❌ Tests failed.")
        sys.exit(1)
    
    # Print next steps
    print_next_steps()

if __name__ == "__main__":
    main()
