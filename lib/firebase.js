import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBRhVkWiHidyRtnsTGyXHAATYAcw92Eg8Y",
  authDomain: "menu-cr.firebaseapp.com",
  projectId: "menu-cr",
  storageBucket: "menu-cr.appspot.com",  // اصلاح شد!
  messagingSenderId: "868249672608",
  appId: "1:868249672608:web:e499eae5102743116b22c5",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
