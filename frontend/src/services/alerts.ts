import { db } from '../firebase.ts';
import {
	collection,
	addDoc,
	onSnapshot,
	orderBy,
	query,
	limit,
	serverTimestamp,
	updateDoc,
	doc
} from 'firebase/firestore';
import { Alert } from '../types/Alert';

const ALERTS_COLLECTION = 'alerts';

export const subscribeToAlerts = (max: number, onUpdate: (alerts: Alert[]) => void) => {
	try {
		const q = query(
			collection(db, ALERTS_COLLECTION),
			orderBy('timestamp', 'desc'),
			limit(max)
		);
		return onSnapshot(q, (snapshot) => {
			const items: Alert[] = snapshot.docs.map((d) => {
				const data: any = d.data();
				return {
					id: d.id,
					type: data.type || 'info',
					severity: data.severity || 'low',
					title: data.title || 'Alert',
					message: data.message || '',
					timestamp: data.timestamp?.toDate ? data.timestamp.toDate() : new Date(),
					source: data.source || 'system',
					metadata: data.metadata,
					acknowledged: !!data.acknowledged,
					resolved: !!data.resolved,
				};
			});
			onUpdate(items);
		});
	} catch (e) {
		// Fallback: return an unsubscribe no-op
		onUpdate([]);
		return () => undefined;
	}
};

export const addAlert = async (alert: Alert) => {
	try {
		await addDoc(collection(db, ALERTS_COLLECTION), {
			type: alert.type,
			severity: alert.severity,
			title: alert.title,
			message: alert.message,
			source: alert.source,
			metadata: alert.metadata || {},
			timestamp: serverTimestamp(),
			acknowledged: alert.acknowledged,
			resolved: alert.resolved,
		});
	} catch (_) {
		// ignore in dev
	}
};

export const acknowledgeAlert = async (id: string) => {
	try { await updateDoc(doc(db, ALERTS_COLLECTION, id), { acknowledged: true }); } catch (_) {}
};

export const resolveAlert = async (id: string) => {
	try { await updateDoc(doc(db, ALERTS_COLLECTION, id), { resolved: true }); } catch (_) {}
};
