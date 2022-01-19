import { auth, provider, signInMethod } from './firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { getFirestore, setDoc, doc } from 'firebase/firestore';

//Handles sign in, sign out, and getting the user's data
class Authentication {
    //User object obtained firebase after signing in
    static user = null;

    static logIn() {
        if (!auth.currentUser) signInMethod(auth, provider).catch((error) => {
            console.error(error.code, error.message);
        })
    }

    static logOut() {
        console.log("SIGNING OUT");
        signOut(auth);
    }

    //Returns a promise that gives a user object
    static getUser() {
            return new Promise((resolve, reject) => {
                const unsubscribe = auth.onAuthStateChanged(user => {
                    unsubscribe();
                    resolve(user);
                }, reject);
            });
        }
}

onAuthStateChanged(auth, async (user) => {
    if (!user) {
        Authentication.logIn();
    } else {
        Authentication.user = user;
        setDoc(doc(getFirestore(), 'users', user.email), {});
    }
})

export default Authentication;
