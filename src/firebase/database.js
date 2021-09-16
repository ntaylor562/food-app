import { db } from './firebase';
import Authentication from './auth';
import { collection, doc, getDoc, setDoc, addDoc, updateDoc, onSnapshot, deleteDoc, query, where, orderBy} from 'firebase/firestore';

//Handles database functionality
//Allows creating, reading, updating, and removing of items
//Handles the 'all options' data that provides data for autocomplete
class Database {
	//The food item listener
	static snap = null;

	//JS Object containing all autocomplete options
	static allOptions = undefined;

	//Adds item to user's list
	static addItem(userEmail, foodItem) {
		this.addOption(foodItem);

		addDoc(collection(db, 'food-items'), {
			dateAdded: new Date(),
			...foodItem,
			user: userEmail,
			show: true
		})
			.catch((error) => console.error(error));
	}

	//Subscribes func to the firestore listener
	static async allFoodItemsListener(func) {
		const q = query(collection(db, 'food-items'), where('user', '==', (await Authentication.getUser()).email), where('show', '==', true), orderBy('expirationDate', 'asc'));
		this.snap = onSnapshot(q, func)
	}

	//Unsubscribes the food item listener
	static unsub() {
		this.snap();
	}

	//If the user doesn't have a document representing options, one is created
	static async initializeOptions() {
		if (!(await getDoc(doc(db, 'all-options', (await Authentication.getUser()).email))).exists())
			await setDoc(doc(db, 'all-options', (await Authentication.getUser()).email), {});

		return (await getDoc(doc(db, 'all-options', (await Authentication.getUser()).email))).data();
    }

	//Gets all autocomplete options for the current user
	static async getAllOptions() {
		if (this.allOptions === undefined) this.allOptions = await this.initializeOptions();

		return this.allOptions;
	}

	//Adds an option to the user's autocomplete options
	static async addOption(foodItem) {
		if (this.allOptions === undefined) this.allOptions = (await getDoc(doc(db, 'all-options', (await Authentication.getUser()).email))).data();

		if (!(foodItem.itemName in this.allOptions)) this.allOptions[foodItem.itemName] = foodItem.quantity;
		else this.allOptions[foodItem.itemName] += foodItem.quantity;

		await updateDoc(doc(db, 'all-options', (await Authentication.getUser()).email), this.allOptions)
    }

	//Updates a food item
	static updateItem(itemID, foodItem) {
		updateDoc(doc(db, 'food-items', itemID), foodItem)
			.catch((error) => console.error(error));
	}

	//Hides a food item
	static hideItem(itemID) {
		updateDoc(doc(db, 'food-items', itemID), { show: false })
    }

	//Removes an item
	static removeItem(itemID) {
		deleteDoc(doc(db, "food-items", itemID));
	}
}

export default Database;
