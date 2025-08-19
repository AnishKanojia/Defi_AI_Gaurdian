import { db } from '../firebase.ts';
import { collection, onSnapshot, orderBy, query, limit, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';

export interface MonitoredContract {
  id: string;
  address: string;
  name?: string;
  riskScore: number; // 0-100
  updatedAt: Date;
}

const CONTRACTS_COLLECTION = 'monitored_contracts';

export const subscribeToMonitoredContracts = (
  max: number,
  onUpdate: (contracts: MonitoredContract[]) => void,
) => {
  try {
    const q = query(
      collection(db, CONTRACTS_COLLECTION),
      orderBy('updatedAt', 'desc'),
      limit(max)
    );
    return onSnapshot(q, (snapshot) => {
      const items: MonitoredContract[] = snapshot.docs.map((d) => {
        const data: any = d.data();
        return {
          id: d.id,
          address: data.address || d.id,
          name: data.name,
          riskScore: typeof data.riskScore === 'number' ? data.riskScore : 0,
          updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : new Date(),
        };
      });
      onUpdate(items);
    });
  } catch (_) {
    onUpdate([]);
    return () => undefined;
  }
};

export const addMonitoredContract = async (data: { address: string; name?: string; riskScore?: number }) => {
  const now = serverTimestamp();
  await addDoc(collection(db, CONTRACTS_COLLECTION), {
    address: data.address,
    name: data.name || null,
    riskScore: typeof data.riskScore === 'number' ? data.riskScore : 0,
    updatedAt: now,
    createdAt: now,
  });
};

export const updateMonitoredContract = async (id: string, partial: Partial<MonitoredContract>) => {
  const ref = doc(db, CONTRACTS_COLLECTION, id);
  await updateDoc(ref, { ...partial, updatedAt: serverTimestamp() } as any);
};

export const deleteMonitoredContract = async (id: string) => {
  const ref = doc(db, CONTRACTS_COLLECTION, id);
  await deleteDoc(ref);
};


