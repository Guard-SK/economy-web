const functions = require("firebase-functions")
const admin = require("firebase-admin")
admin.initializeApp()
const cors = require('cors'); // Import the cors library
const db = admin.firestore()
const corsHandler = cors({ origin: true });
exports.recalculate = functions.https.onRequest(async (req, res) => {
    corsHandler(req, res, async () => {
  try {
    const eventsSnapshot = await db.collection("events").get()
    const usersSnapshot = await db.collection("users").get()

    usersSnapshot.forEach(async (userSnapshot) => {
      const uid = userSnapshot.id
      const userData = userSnapshot.data()
      const username = userData.name + " " + userData.surname
      const usernameset = userData.name + " " + userData.surname + "set"
      const costsofficial = [0]
      const costsunofficial = [0]

      eventsSnapshot.forEach((eventSnapshot) => {
        const eventData = eventSnapshot.data()
        if (eventData[username] === "✅") {
          if (eventData[usernameset] !== false) {
            if (eventData.typeoffond === "official") {
              costsofficial.push(parseFloat(eventData[usernameset]))
            } else {
              costsunofficial.push(parseFloat(eventData[usernameset]))
            }
          } else {
            const arr = Object.values(eventData)
            const count = arr.filter((value) => value === "✅").length - eventData.eventnumberset
            const eventcost = eventData.costofevent - eventData.eventcostset
            const cpp = eventcost / count
            if (eventData.typeoffond === "official") {
              costsofficial.push(cpp)
            } else {
              costsunofficial.push(cpp)
            }
          }
        }
      })

      const sum = costsofficial.reduce((accumulator, currentValue) => accumulator + currentValue, 0)
      const sum2 = costsunofficial.reduce((accumulator, currentValue) => accumulator + currentValue, 0)
      const baloff = sum + userData.positivebalanceofficial
      const balunoff = sum2 + userData.positivebalanceunofficial

      await db.collection("users").doc(uid).set(
          {
            balanceofficial: parseFloat(baloff.toFixed(2)),
            balanceunofficial: parseFloat(balunoff.toFixed(2)),
          },
          {merge: true},
      )
    })

    return res.status(200).send("Recalculation complete.")
  } catch (error) {
    console.error(error)
    return res.status(500).send("An error occurred during recalculation.")
  }
})
});

exports.createUser = functions.https.onRequest(async (req, res) => {
  corsHandler(req, res, async () => {
  try {
    const data = req.body; // Get the data from the request body

    const uid = data.uid;
      const user1 = 'user';

      await db.collection('users').doc(uid).set({
          name: data.name,
          surname: data.surname,
          email: data.email,
          role: user1,
          positivebalanceofficial: 0,
          positivebalanceunofficial: 0,
          balanceofficial: 0,
          balanceunofficial: 0,
      });

      const promises = [];
      const attendaceRef = db.collection('events');
      const attendaceSnap = await attendaceRef.get();

      attendaceSnap.forEach(doc4 => {
          const refatt2 = db.collection('events').doc(doc4.id);
          var eventname = data.name + ' ' + data.surname;
          var name2 = eventname + 'visible';
          var name3 = eventname + 'set';
          let obj1 = { eventname1: "❌" };
          obj1[eventname] = obj1['eventname1'];
          delete obj1['eventname1'];
          let obj2 = { eventname1: true };
          obj2[name2] = obj2['eventname1'];
          delete obj2['eventname1'];
          let obj3 = { eventname1: false };
          obj3[name3] = obj3['eventname1'];
          delete obj3['eventname1'];
          promises.push(refatt2.set(obj1, { merge: true }));
          promises.push(refatt2.set(obj2, { merge: true }));
          promises.push(refatt2.set(obj3, { merge: true }));
      });

      await Promise.all(promises);
      res.status(200).json({ message: 'User created successfully.' + uid });
    
  } catch (e) {
    console.error("Error adding document: ", e);
    res.status(500).json({ error: 'An error occurred.' });
  }
  })
})