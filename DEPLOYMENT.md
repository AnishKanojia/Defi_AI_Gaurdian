# 🚀 CryptoVault Sentinel - Deployment Guide

## 📋 **Overview**

This guide provides step-by-step instructions for deploying the CryptoVault Sentinel application to production environments. The application consists of a React frontend and a FastAPI backend, with Firebase as the database and authentication service.

## 🎯 **Deployment Options**

### **Recommended Setup**
- **Frontend**: Vercel (Free tier available)
- **Backend**: Railway (Free tier available)
- **Database**: Firebase (Free tier available)
- **Domain**: Custom domain with SSL

### **Alternative Options**
- **Frontend**: Netlify, GitHub Pages, AWS S3
- **Backend**: Heroku, DigitalOcean, AWS EC2
- **Database**: MongoDB Atlas, PostgreSQL, AWS RDS

## 🔧 **Prerequisites**

### **Required Accounts**
- [GitHub](https://github.com) - Source code repository
- [Firebase](https://firebase.google.com) - Database and authentication
- [Vercel](https://vercel.com) - Frontend hosting
- [Railway](https://railway.app) - Backend hosting

### **Required Tools**
- Git (latest version)
- Node.js 18+ (for local development)
- Python 3.11+ (for local development)
- Firebase CLI (for configuration)

## 🚀 **Step 1: Firebase Setup**

### **1.1 Create Firebase Project**
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click "Create a project"
3. Enter project name: `cryptovault-sentinel`
4. Enable Google Analytics (optional)
5. Click "Create project"

### **1.2 Enable Authentication**
1. In Firebase Console, go to "Authentication"
2. Click "Get started"
3. Enable "Email/Password" provider
4. Enable "Google" provider
5. Add your domain to authorized domains

### **1.3 Create Firestore Database**
1. Go to "Firestore Database"
2. Click "Create database"
3. Choose "Start in test mode" (we'll secure it later)
4. Select location closest to your users
5. Click "Done"

### **1.4 Configure Security Rules**
1. Go to "Firestore Database" → "Rules"
2. Replace with secure rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // User settings
    match /user_settings/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Alerts
    match /alerts/{alertId} {
      allow read, write: if request.auth != null && 
        resource.data.userId == request.auth.uid;
    }
    
    // Monitored contracts
    match /monitored_contracts/{contractId} {
      allow read, write: if request.auth != null && 
        resource.data.userId == request.auth.uid;
    }
  }
}
```

### **1.5 Get Firebase Configuration**
1. Go to "Project settings" (gear icon)
2. Scroll to "Your apps" section
3. Click "Add app" → "Web"
4. Register app with name: `cryptovault-sentinel-web`
5. Copy the configuration object

### **1.6 Generate Service Account Key**
1. Go to "Project settings" → "Service accounts"
2. Click "Generate new private key"
3. Download the JSON file
4. **Keep this file secure - never commit it to Git**

## 🚀 **Step 2: Frontend Deployment (Vercel)**

### **2.1 Prepare Frontend Code**
1. Ensure your code is in a GitHub repository
2. Create `.env.local` file in frontend directory:

```env
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
REACT_APP_API_BASE=https://your-backend-url.railway.app
```

### **2.2 Deploy to Vercel**
1. Go to [Vercel](https://vercel.com)
2. Sign in with GitHub
3. Click "New Project"
4. Import your GitHub repository
5. Configure build settings:
   - **Framework Preset**: Create React App
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`
   - **Install Command**: `npm install`
6. Add environment variables from `.env.local`
7. Click "Deploy"

### **2.3 Configure Custom Domain (Optional)**
1. In Vercel dashboard, go to "Settings" → "Domains"
2. Add your custom domain
3. Follow DNS configuration instructions
4. Enable SSL (automatic with Vercel)

## 🚀 **Step 3: Backend Deployment (Railway)**

### **3.1 Prepare Backend Code**
1. Ensure your backend code is in the same GitHub repository
2. Create `.env` file in backend directory:

```env
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_PRIVATE_KEY_ID=your_private_key_id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour_Private_Key_Here\n-----END PRIVATE KEY-----"
FIREBASE_CLIENT_EMAIL=your_client_email
FIREBASE_CLIENT_ID=your_client_id
FIREBASE_AUTH_URI=https://accounts.google.com/o/oauth2/auth
FIREBASE_TOKEN_URI=https://oauth2.googleapis.com/token
FIREBASE_AUTH_PROVIDER_X509_CERT_URL=https://www.googleapis.com/oauth2/v1/certs
FIREBASE_CLIENT_X509_CERT_URL=your_cert_url
BSC_RPC_URL=https://bsc-dataseed.binance.org/
ETH_RPC_URL=https://mainnet.infura.io/v3/your_key
```

### **3.2 Deploy to Railway**
1. Go to [Railway](https://railway.app)
2. Sign in with GitHub
3. Click "New Project"
4. Select "Deploy from GitHub repo"
5. Choose your repository
6. Configure deployment:
   - **Root Directory**: `backend`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
7. Add environment variables from `.env`
8. Click "Deploy"

### **3.3 Get Backend URL**
1. After deployment, go to "Settings"
2. Copy the generated domain
3. Update your frontend environment variable `REACT_APP_API_BASE`

## 🔒 **Step 4: Security Configuration**

### **4.1 Update Firebase Security Rules**
1. Go to Firebase Console → Firestore → Rules
2. Update rules to be more restrictive:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // User settings
    match /user_settings/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Alerts
    match /alerts/{alertId} {
      allow read, write: if request.auth != null && 
        resource.data.userId == request.auth.uid;
      allow create: if request.auth != null;
    }
    
    // Monitored contracts
    match /monitored_contracts/{contractId} {
      allow read, write: if request.auth != null && 
        resource.data.userId == request.auth.uid;
      allow create: if request.auth != null;
    }
    
    // Public data (read-only)
    match /public_data/{document=**} {
      allow read: if true;
    }
  }
}
```

### **4.2 Configure CORS**
1. In your backend code, ensure CORS is properly configured
2. Update allowed origins to include your frontend domain

### **4.3 Environment Variable Security**
1. Never commit `.env` files to Git
2. Use environment variables in production
3. Rotate API keys regularly
4. Use least-privilege access

## 📱 **Step 5: Mobile Optimization**

### **5.1 PWA Configuration**
1. Update `public/manifest.json` with your app details
2. Configure service worker for offline functionality
3. Test on mobile devices

### **5.2 Responsive Design**
1. Test all pages on mobile devices
2. Ensure touch-friendly interactions
3. Optimize loading times

## 🔍 **Step 6: Testing & Validation**

### **6.1 Functionality Testing**
1. **Authentication**: Test sign-in/sign-up flows
2. **Dashboard**: Verify all features work
3. **Real-time**: Test WebSocket connections
4. **Mobile**: Test on various devices

### **6.2 Performance Testing**
1. **Page Load**: Use Lighthouse for performance scores
2. **API Response**: Test backend response times
3. **Database**: Monitor Firestore usage

### **6.3 Security Testing**
1. **Authentication**: Test unauthorized access
2. **Data Access**: Verify user isolation
3. **Input Validation**: Test malicious inputs

## 📊 **Step 7: Monitoring & Analytics**

### **7.1 Firebase Analytics**
1. Enable Google Analytics in Firebase
2. Track user engagement and errors
3. Monitor performance metrics

### **7.2 Application Monitoring**
1. Set up error logging
2. Monitor API response times
3. Track user sessions

### **7.3 Database Monitoring**
1. Monitor Firestore usage
2. Set up billing alerts
3. Track query performance

## 🚀 **Step 8: Production Checklist**

### **Before Going Live**
- [ ] All environment variables configured
- [ ] Firebase security rules updated
- [ ] CORS properly configured
- [ ] SSL certificates enabled
- [ ] Custom domain configured
- [ ] Error monitoring set up
- [ ] Performance optimized
- [ ] Mobile tested
- [ ] Security tested

### **Post-Deployment**
- [ ] Monitor error logs
- [ ] Check performance metrics
- [ ] Verify real-time features
- [ ] Test user flows
- [ ] Monitor costs

## 🔧 **Troubleshooting**

### **Common Issues**

#### **Frontend Build Errors**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

#### **Backend Deployment Issues**
```bash
# Check requirements.txt
pip install -r requirements.txt --upgrade

# Test locally
uvicorn app.main:app --reload
```

#### **Firebase Connection Issues**
1. Verify API keys are correct
2. Check Firebase project settings
3. Ensure service account key is valid
4. Verify security rules

#### **CORS Errors**
1. Check backend CORS configuration
2. Verify frontend URL is in allowed origins
3. Check browser console for specific errors

### **Performance Issues**
1. **Slow Loading**: Optimize images and bundle size
2. **High Latency**: Check backend response times
3. **Database Slow**: Optimize Firestore queries

## 📚 **Additional Resources**

### **Documentation**
- [Firebase Documentation](https://firebase.google.com/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [Railway Documentation](https://docs.railway.app)
- [Material-UI Deployment](https://mui.com/material-ui/getting-started/installation/)

### **Tools**
- [Lighthouse](https://developers.google.com/web/tools/lighthouse) - Performance testing
- [GTmetrix](https://gtmetrix.com) - Website speed testing
- [WebPageTest](https://www.webpagetest.org) - Detailed performance analysis

### **Support**
- [Firebase Support](https://firebase.google.com/support)
- [Vercel Support](https://vercel.com/support)
- [Railway Support](https://docs.railway.app/develop/help)

---

## 🎉 **Congratulations!**

Your CryptoVault Sentinel application is now deployed and ready for production use. Remember to:

1. **Monitor** your application regularly
2. **Update** dependencies and security patches
3. **Backup** your data and configurations
4. **Scale** as your user base grows
5. **Maintain** security best practices

For ongoing maintenance and updates, refer to the [Project Documentation](./PROJECT_DOCUMENTATION.md) and [Contributing Guidelines](./CONTRIBUTING.md).
