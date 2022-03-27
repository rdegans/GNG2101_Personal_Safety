const functions = require("firebase-functions");
const admin = require('firebase-admin');
admin.initializeApp();
const db = admin.firestore();

//////////////////////////////////////////////////////////


exports.emergencyCheck = functions.firestore.document('/test/{documentId}').onCreate((snapshot, context) => {
    //for each user
    db.collection("users").get().then(snapshot => { snapshot.forEach(doc => {
        
        //current time
        var currentTime = new Date();

        //last user check in time
        const lastCheckInNum = doc.data().lastCheckIn;
        var lastCheckIn = new Date(lastCheckInNum.toDate());
          lastCheckIn.setTime(lastCheckIn.getTime() - (4*60*60*1000));

        //user check in time
        const checkInTimeNum = doc.data().checkInTime;
        var checkInStartTime = new Date();
          checkInStartTime.setTime(currentTime.getTime());
          checkInStartTime.setHours(Math.floor(checkInTimeNum/100), checkInTimeNum%100, 0, 0);
        console.log(checkInStartTime.toTimeString());
        var checkInEndTime = new Date();
          checkInEndTime.setTime(checkInStartTime.getTime() + (3*60*60*1000));

        //console.log("Current Time = " + currentTime.toDateString());
        //console.log("Check in before = " + checkInStartTime.toTimeString() +checkInStartTime.toDateString() + " - " + checkInEndTime.toTimeString() + checkInEndTime.toDateString());

        
        //get active check-in period
        //edge case ex. 11-2 check in, if current time 00:01-1:59 mar 1, active check in 11 feb 28 - 2 mar 1
        if (checkInStartTime.getDate() < checkInEndTime.getDate() && currentTime.getHours() < checkInEndTime.getHours()){
          checkInStartTime.setTime(checkInStartTime.getTime() - (24*60*60*1000));
          checkInEndTime.setTime(checkInEndTime.getTime() - (24*60*60*1000));
        }

        //console.log("Check in after = " + checkInStartTime.toTimeString() +checkInStartTime.toDateString() + " - " + checkInEndTime.toTimeString() + checkInEndTime.toDateString());
        //if (currentTime > checkInEndTime && lastCheckIn < checkInStartTime){
          if (true){
          doc.ref.collection("emergencyContacts").get().then(snapshot2 => { snapshot2.forEach(doc2 => {
            console.log(doc2.data().emergencyContact);
            const writeResult1 = admin.firestore().collection('messages').add({
              to: doc2.data().emergencyContact, 
              body: "Emergency detected"
            });

        })});
        }
        });
      })

  console.log("done");
  return null;
 
})

exports.scheduledFunction = functions.pubsub.schedule('* * * * *').onRun((context) => {
 
});