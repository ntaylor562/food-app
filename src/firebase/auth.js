import { auth, provider, signInMethod, persistence } from './firebase';
import { getRedirectResult, onAuthStateChanged, signOut } from 'firebase/auth';
import { getFirestore, collection, setDoc, doc } from 'firebase/firestore';

//Handles sign in, sign out, and getting the user's data
class Authentication {
    static user = null;

    static signIn() {
        if (!auth.currentUser) signInMethod(auth, provider).then(()=>console.log("signed in")).catch((error) => {
            console.error(error.code, error.message);
        })
    }

    static signOut() {
        signOut(auth);
    }

    static getUser() {
            return new Promise((resolve, reject) => {
                const unsubscribe = auth.onAuthStateChanged(user => {
                    unsubscribe();
                    resolve(user);
                }, reject);
            });
        }
}

onAuthStateChanged(auth, (user) => {
    if (!user) {
        Authentication.signIn();
    } else {
        Authentication.user = user;
        setDoc(doc(getFirestore(), 'users', Authentication.user.email), {})
    }
})

export default Authentication;
