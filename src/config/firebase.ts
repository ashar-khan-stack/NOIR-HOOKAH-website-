export {
  app,
  auth,
  db,
  storage,
  analytics,
  firebaseConfig,
} from '../firebase/firebaseConfig';
import { db } from '../firebase/firebaseConfig';
import { doc, getDocFromServer } from 'firebase/firestore';

export async function testFirestoreConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('[NOIR Firebase] Firestore client is in offline mode.');
    }
    return false;
  }
}
