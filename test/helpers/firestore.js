import '../../.env.js'

import Firebase from 'firebase/app'
import 'firebase/firestore'

const config = {
  apiKey: process.env.apiKey,
  authDomain: process.env.authDomain,
  databaseURL: process.env.databaseURL,
  projectId: process.env.projectId
}
Firebase.initializeApp(config)
const firestore = Firebase.firestore()
const settings = {timestampsInSnapshots: true}
firestore.settings(settings)
