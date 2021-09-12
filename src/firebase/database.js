import { db } from './firebase';
import Authentication from './auth';
import { collection, doc, addDoc, updateDoc, onSnapshot, deleteDoc, query, where, orderBy} from 'firebase/firestore';

class Database {
	static snap = null;

	static addItem(userEmail, foodItem) {
		addDoc(collection(db, 'food-items'), {
			dateAdded: new Date(),
			...foodItem,
			user: userEmail
		}).then((docref) => console.log("added", docref.id)).catch((error) => console.log(error));
	}

	static async allFoodItemsListener(func) {
		const q = query(collection(db, 'food-items'), where('user', '==', (await Authentication.getUser()).email), orderBy('expirationDate', 'asc'));
		this.snap = onSnapshot(q, func)
	}

	static unsub() {
		this.snap();
    }

	static updateItem(itemID, foodItem) {
		updateDoc(doc(db, 'food-items', itemID), { ...foodItem })
			.then((docref) => console.log("updated", itemID))
			.catch((error) => console.log(error));
	}

	static removeItem(itemID) {
		deleteDoc(doc(db, "food-items", itemID));
	}
}

export default Database;
