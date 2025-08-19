# 🔧 CryptoVault Sentinel - Troubleshooting Guide

## 📋 **Overview**

This troubleshooting guide helps you resolve common issues when developing, deploying, or using the CryptoVault Sentinel application. If you encounter a problem not covered here, please check the [GitHub Issues](https://github.com/your-repo/cryptovault-sentinel/issues) or create a new one.

## 🚨 **Quick Fixes**

### **Common Issues & Solutions**

| Issue | Quick Fix | Details |
|-------|-----------|---------|
| Build fails | `npm install && npm run build` | Clear cache and reinstall |
| Backend won't start | Check `.env` file | Verify environment variables |
| Firebase connection error | Check API keys | Verify Firebase configuration |
| CORS errors | Check backend CORS settings | Verify allowed origins |
| Real-time not working | Check Socket.IO connection | Verify WebSocket setup |

## 🐛 **Frontend Issues**

### **Build Errors**

#### **"Module not found" Errors**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Check for missing dependencies
npm ls
```

#### **TypeScript Compilation Errors**
```bash
# Check TypeScript version
npx tsc --version

# Run type checking
npx tsc --noEmit

# Fix common type issues
npm run type-check
```

#### **Build Performance Issues**
```bash
# Analyze bundle size
npm run build --analyze

# Check for large dependencies
npm run bundle-analyzer
```

### **Runtime Errors**

#### **React Hooks Errors**
```typescript
// Common issue: Hooks called conditionally
// ❌ Wrong
if (condition) {
  useEffect(() => {}, []);
}

// ✅ Correct
useEffect(() => {
  if (condition) {
    // effect logic
  }
}, [condition]);
```

#### **State Management Issues**
```typescript
// Common issue: State updates not reflecting
// ❌ Wrong
setUser({ ...user, name: 'New Name' });

// ✅ Correct
setUser(prevUser => ({ ...prevUser, name: 'New Name' }));
```

#### **Component Rendering Issues**
```typescript
// Common issue: Infinite re-renders
// ❌ Wrong
useEffect(() => {
  setData(newData);
}, [data]); // data in dependency array

// ✅ Correct
useEffect(() => {
  setData(newData);
}, []); // Empty dependency array
```

### **UI/UX Issues**

#### **Material-UI Theme Not Applied**
```typescript
// Check ThemeProvider setup
import { ThemeProvider } from '@mui/material/styles';
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark', // or 'light'
  },
});

// Wrap your app
<ThemeProvider theme={theme}>
  <App />
</ThemeProvider>
```

#### **Responsive Design Issues**
```typescript
// Check breakpoint usage
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

const theme = useTheme();
const isMobile = useMediaQuery(theme.breakpoints.down('md'));
```

#### **Dark/Light Mode Issues**
```typescript
// Check theme context
const { theme, toggleTheme } = useThemeContext();

// Verify localStorage persistence
useEffect(() => {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    setTheme(savedTheme);
  }
}, []);
```

## 🐍 **Backend Issues**

### **Startup Errors**

#### **Port Already in Use**
```bash
# Check what's using the port
netstat -ano | findstr :8000  # Windows
lsof -i :8000                 # macOS/Linux

# Kill the process
taskkill /PID <PID> /F        # Windows
kill -9 <PID>                 # macOS/Linux
```

#### **Environment Variable Issues**
```bash
# Check .env file exists
ls -la .env

# Verify variables are loaded
python -c "import os; print(os.getenv('FIREBASE_PROJECT_ID'))"

# Check for typos in variable names
grep -r "FIREBASE" .env
```

#### **Dependency Issues**
```bash
# Upgrade pip
pip install --upgrade pip

# Clear cache and reinstall
pip cache purge
pip install -r requirements.txt --force-reinstall

# Check for conflicts
pip check
```

### **Runtime Errors**

#### **Firebase Connection Errors**
```python
# Check service account key
import firebase_admin
from firebase_admin import credentials

try:
    cred = credentials.Certificate("path/to/serviceAccountKey.json")
    firebase_admin.initialize_app(cred)
except Exception as e:
    print(f"Firebase error: {e}")
```

#### **Database Query Errors**
```python
# Check Firestore rules
from firebase_admin import firestore

db = firestore.client()
try:
    doc = db.collection('users').document('user_id').get()
    if doc.exists:
        print(doc.to_dict())
except Exception as e:
    print(f"Query error: {e}")
```

#### **WebSocket Connection Issues**
```python
# Check Socket.IO setup
from socketio import AsyncServer

sio = AsyncServer(cors_allowed_origins="*")

@sio.event
async def connect(sid, environ):
    print(f"Client connected: {sid}")

@sio.event
async def disconnect(sid):
    print(f"Client disconnected: {sid}")
```

### **Performance Issues**

#### **Slow API Responses**
```python
# Add caching
from functools import lru_cache

@lru_cache(maxsize=128)
def expensive_operation(param):
    # operation logic
    pass

# Use async operations
async def async_operation():
    # async logic
    pass
```

#### **High Memory Usage**
```python
# Monitor memory usage
import psutil
import os

process = psutil.Process(os.getpid())
print(f"Memory usage: {process.memory_info().rss / 1024 / 1024} MB")

# Use generators for large datasets
def data_generator():
    for item in large_dataset:
        yield item
```

## 🔐 **Authentication Issues**

### **Firebase Auth Problems**

#### **Sign-in Not Working**
```typescript
// Check Firebase config
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  // ... other config
};

// Verify config is loaded
console.log('Firebase config:', firebaseConfig);
```

#### **Token Expiration**
```typescript
// Check token refresh
import { onAuthStateChanged } from 'firebase/auth';

onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in
    user.getIdToken(true); // Force refresh
  }
});
```

#### **Permission Denied**
```typescript
// Check Firestore rules
// Verify user is authenticated
if (!user) {
  throw new Error('User not authenticated');
}

// Check document ownership
if (doc.data().userId !== user.uid) {
  throw new Error('Access denied');
}
```

### **Session Management Issues**

#### **User Logged Out Unexpectedly**
```typescript
// Check auth persistence
import { setPersistence, browserLocalPersistence } from 'firebase/auth';

setPersistence(auth, browserLocalPersistence);

// Monitor auth state changes
useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, (user) => {
    if (user) {
      setUser(user);
    } else {
      setUser(null);
    }
  });

  return unsubscribe;
}, []);
```

## 🌐 **Network & API Issues**

### **CORS Errors**

#### **Frontend CORS Issues**
```typescript
// Check API base URL
const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:8000';

// Verify URL format
console.log('API Base:', API_BASE);
```

#### **Backend CORS Configuration**
```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://yourdomain.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### **API Endpoint Issues**

#### **404 Not Found**
```python
# Check route registration
@app.get("/api/test")
async def test_endpoint():
    return {"message": "API is working"}

# Verify URL patterns
print("Registered routes:", [route.path for route in app.routes])
```

#### **500 Internal Server Error**
```python
# Add error handling
from fastapi import HTTPException

@app.get("/api/data/{item_id}")
async def get_item(item_id: str):
    try:
        # Your logic here
        return {"id": item_id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
```

## 🔄 **Real-time Issues**

### **WebSocket Connection Problems**

#### **Connection Not Established**
```typescript
// Check Socket.IO connection
import { io } from 'socket.io-client';

const socket = io(process.env.REACT_APP_API_BASE || 'http://localhost:8000');

socket.on('connect', () => {
  console.log('Connected to server');
});

socket.on('disconnect', () => {
  console.log('Disconnected from server');
});
```

#### **Events Not Received**
```typescript
// Check event listeners
socket.on('new_alert', (data) => {
  console.log('Received alert:', data);
});

// Verify event emission
socket.emit('join_room', { userId: user.uid });
```

### **Backend WebSocket Issues**

#### **Client Not Receiving Events**
```python
# Check room management
@sio.event
async def join_room(sid, data):
    user_id = data.get('userId')
    if user_id:
        await sio.enter_room(sid, f"user_{user_id}")
        print(f"User {user_id} joined room")

# Emit to specific room
await sio.emit('new_alert', alert_data, room=f"user_{user_id}")
```

## 📱 **Mobile & Responsive Issues**

### **Mobile Layout Problems**

#### **Components Not Responsive**
```typescript
// Use Material-UI breakpoints
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

const theme = useTheme();
const isMobile = useMediaQuery(theme.breakpoints.down('md'));

return (
  <Box sx={{ 
    flexDirection: isMobile ? 'column' : 'row',
    padding: isMobile ? 2 : 4 
  }}>
    {/* Content */}
  </Box>
);
```

#### **Touch Interactions Not Working**
```typescript
// Ensure touch-friendly sizing
<Button
  sx={{
    minHeight: 44, // Touch-friendly minimum
    minWidth: 44,
    padding: 2
  }}
>
  Click Me
</Button>
```

## 🗄️ **Database Issues**

### **Firestore Problems**

#### **Query Performance Issues**
```typescript
// Use indexes for complex queries
// Add composite indexes in Firebase Console
// Example: userId + createdAt + type

// Limit results
const query = query(
  collection(db, 'alerts'),
  where('userId', '==', user.uid),
  orderBy('createdAt', 'desc'),
  limit(50)
);
```

#### **Data Not Persisting**
```typescript
// Check write permissions
try {
  await addDoc(collection(db, 'alerts'), alertData);
  console.log('Document written successfully');
} catch (error) {
  console.error('Error writing document:', error);
}
```

#### **Offline Persistence Issues**
```typescript
// Enable offline persistence
import { enableIndexedDbPersistence } from 'firebase/firestore';

enableIndexedDbPersistence(db).catch((err) => {
  if (err.code === 'failed-precondition') {
    console.log('Multiple tabs open, persistence can only be enabled in one tab at a time.');
  } else if (err.code === 'unimplemented') {
    console.log('The current browser doesn\'t support persistence.');
  }
});
```

## 🚀 **Deployment Issues**

### **Vercel Deployment Problems**

#### **Build Fails on Vercel**
```bash
# Check build logs
# Common issues:
# 1. Environment variables not set
# 2. Node.js version mismatch
# 3. Build command incorrect

# Set environment variables in Vercel dashboard
# Use .env.local for local development
```

#### **Environment Variables Not Working**
```bash
# Vercel environment variables
# Must be prefixed with REACT_APP_ for Create React App
REACT_APP_API_BASE=https://your-backend.railway.app
REACT_APP_FIREBASE_API_KEY=your_key

# Check in Vercel dashboard → Settings → Environment Variables
```

### **Railway Deployment Issues**

#### **Backend Won't Start**
```bash
# Check Railway logs
# Common issues:
# 1. Port configuration
# 2. Environment variables
# 3. Dependencies not installed

# Verify start command
uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

#### **Environment Variables Missing**
```bash
# Set in Railway dashboard
# Project → Variables tab
# Add all required environment variables
```

## 🔍 **Debugging Tools**

### **Frontend Debugging**

#### **React Developer Tools**
```bash
# Install browser extension
# Chrome: React Developer Tools
# Firefox: React Developer Tools

# Use in console
window.__REACT_DEVTOOLS_GLOBAL_HOOK__
```

#### **Redux DevTools (if using Redux)**
```typescript
// Install package
npm install redux-devtools-extension

// Configure store
import { composeWithDevTools } from 'redux-devtools-extension';

const store = createStore(
  rootReducer,
  composeWithDevTools()
);
```

### **Backend Debugging**

#### **FastAPI Debug Mode**
```python
# Enable debug mode
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, debug=True)

# Use logging
import logging
logging.basicConfig(level=logging.DEBUG)
```

#### **Database Query Logging**
```python
# Enable Firestore logging
import logging
logging.getLogger('google.cloud.firestore').setLevel(logging.DEBUG)
```

## 📞 **Getting Help**

### **When to Create an Issue**

Create a GitHub issue when:
- ❌ The troubleshooting steps don't work
- ❌ You encounter a new error
- ❌ The documentation is unclear
- ❌ You have a feature request

### **Issue Template**

```markdown
## Environment
- OS: [e.g., Windows 10, macOS 11]
- Node.js: [e.g., 18.0.0]
- Python: [e.g., 3.11.0]
- Browser: [e.g., Chrome 90]

## Issue Description
Clear description of the problem

## Steps to Reproduce
1. Step 1
2. Step 2
3. See error

## Expected Behavior
What should happen

## Actual Behavior
What actually happens

## Error Messages
Copy error messages/logs

## Screenshots
Add screenshots if applicable

## Additional Context
Any other relevant information
```

### **Community Resources**

- **GitHub Issues**: [Project Issues](https://github.com/your-repo/cryptovault-sentinel/issues)
- **GitHub Discussions**: [Community Forum](https://github.com/your-repo/cryptovault-sentinel/discussions)
- **Documentation**: [Project Docs](./PROJECT_DOCUMENTATION.md)
- **Deployment Guide**: [Deployment](./DEPLOYMENT.md)

## 🎯 **Prevention Tips**

### **Best Practices**

1. **Environment Variables**: Always use `.env` files for local development
2. **Error Handling**: Implement proper error boundaries and try-catch blocks
3. **Logging**: Add comprehensive logging for debugging
4. **Testing**: Write tests to catch issues early
5. **Code Review**: Review code before merging
6. **Documentation**: Keep documentation up to date

### **Regular Maintenance**

- Update dependencies regularly
- Monitor error logs
- Check performance metrics
- Review security settings
- Backup important data

---

## 🎉 **Still Stuck?**

If none of these solutions work:

1. **Search existing issues** for similar problems
2. **Create a detailed issue** with all the information
3. **Join our community** for real-time help
4. **Check external resources** (Stack Overflow, etc.)

**Remember**: Most issues can be resolved with patience and systematic debugging. Don't hesitate to ask for help! 🚀
