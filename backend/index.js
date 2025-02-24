const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

//Import Firebase Config.
const { initializeApp } = require("firebase/app");
const { getFirestore, collection, addDoc, getDocs, query, orderBy } = require("firebase/firestore");
const { firebaseConfig } = require("./firebaseConfig");  //Settings for Firebase.

//Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

//Initialize Express
const app = express();
const PORT = 3000;

//Middleware
app.use(cors());
app.use(bodyParser.json());

//Test Route
app.get('/', (req, res) => {
    res.send('Server is running!');
});

//Receive Data and Send to Firebase Firestore
app.post('/send', async (req, res) => {
    try {
        const { name, score } = req.body;

        // Validation check
        if (!name || typeof name !== 'string' || isNaN(score)) {
            return res.status(400).json({ success: false, error: "Invalid data format. 'name' must be a string and 'score' must be a number." });
        }

        console.log('Received:', { name, score });

        const docRef = await addDoc(collection(db, "messages"), {
            name: name,
            score: parseInt(score, 10),
            timestamp: new Date()
        });

        res.json({ success: true, id: docRef.id, name, score });
    } catch (error) {
        console.error('Error saving to Firebase:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

//Fetch Messages from Firestore
app.get('/messages', async (req, res) => {
    try {
        const q = query(collection(db, "messages"), orderBy("timestamp", "desc"));
        const snapshot = await getDocs(q);

        const messages = snapshot.docs.map(doc => ({
            id: doc.id,
            name: doc.data().name,
            score: doc.data().score,
            timestamp: doc.data().timestamp.toDate()
        }));

        res.json({ success: true, messages });
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

//Start Server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;