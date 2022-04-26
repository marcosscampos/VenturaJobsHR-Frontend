const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

const db = admin.firestore();

exports.createUserAndSetRole = functions.https.onCall(async (data, context) => {
  console.log(data)

  try {
    return await admin.auth().createUser({
      email: data.email,
      password: data.password
    }).then(async user => {
      const claims = {
        role: data.role
      }

      let _ = await admin.auth().setCustomUserClaims(user.uid, claims)

      await db
        .collection('roles')
        .doc(user.uid)
        .set({
          email: user.email,
          role: data.role
        })
    }).then(() => {
      return {
        result: 'Success'
      }
    })

  } catch (error) {
    console.log('🤡', error)
  }
})
