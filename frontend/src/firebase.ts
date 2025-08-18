import { initializeApp } from 'firebase/app';
import { getAnalytics, isSupported as analyticsIsSupported } from 'firebase/analytics';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Your Firebase web app configuration
const firebaseConfig = {
	apiKey: 'AIzaSyA5uXxpqQTSKuZuNJIv64muGtgyWNe8BzQ',
	authDomain: 'crypto-9edb2.firebaseapp.com',
	projectId: 'crypto-9edb2',
	storageBucket: 'crypto-9edb2.firebasestorage.app',
	messagingSenderId: '1076776178506',
	appId: '1:1076776178506:web:f3378a307095d0d31427b3',
	measurementId: 'G-WS3V3FWCQY',
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Initialize Analytics only in supported browser environments
export let analytics: ReturnType<typeof getAnalytics> | undefined;
if (typeof window !== 'undefined') {
	analyticsIsSupported()
		.then((supported) => {
			if (supported) {
				analytics = getAnalytics(app);
			}
		})
		.catch(() => undefined);
}

// Core SDKs
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app);
