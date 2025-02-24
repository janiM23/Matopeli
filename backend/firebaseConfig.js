import { initializeApp } from "firebase/app";

const firebaseConfig = {
    apiKey: "AIzaSyClPtuG1e-rokowN-szUByPRqPC8wD-oak",
    authDomain: "matopeli-98a5f.firebaseapp.com",
    projectId: "matopeli-98a5f",
    storageBucket: "matopeli-98a5f.appspot.com",
    messagingSenderId: "825738674413",
    appId: "1:825738674413:web:a80640ef2bf87956e4cce4"
};

const app = initializeApp(firebaseConfig);

export { firebaseConfig };  //Export only the config, not the app
export default app;